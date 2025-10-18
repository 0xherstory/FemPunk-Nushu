// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "../interface/IFemCanvasContribution.sol";
import "../interface/IFemCanvas.sol";

contract FemCanvasRevenue is Ownable, ReentrancyGuard {
    using Address for address payable;
    IFemCanvasContribution public femCanvasContribution;
    IFemCanvas public femCanvas;
    // key is canvasId
    mapping(uint256 => uint256) public canvasRevenue;
    // canvasId : contributor address: claimable amount
    mapping(uint256 => mapping(address => uint256)) public claimableAmount;
    // canvasId: whether revenue has been distributed
    mapping(uint256 => bool) public revenueDistributed;
    // 10%
    uint256 public platformFeeRate = 100; 
    // todo 
    address public platformFeeRecipientAddress;
    uint256 public totalPlatformFees;
    
    event RevenueReceived(uint256 indexed canvasId, uint256 amount);
    event RevenueDistributed(uint256 indexed canvasId, uint256 totalAmount, uint256 contributorsCount);
    event RevenueClaimed(uint256 indexed canvasId, address indexed contributor, uint256 amount);
    event PlatformFeeUpdated(uint256 oldRate, uint256 newRate);
    event PlatformFeeRecipientUpdated(address oldRecipient, address newRecipient);
    
    constructor(
        address _contributionContract,
        address _canvasContract,
        address _platformFeeRecipient
    ) Ownable(msg.sender) {
        require(_contributionContract != address(0), "Invalid contribution contract");
        require(_platformFeeRecipient != address(0), "Invalid platform fee recipient");
        
        femCanvasContribution = IFemCanvasContribution(_contributionContract);
        femCanvas = IFemCanvas(_canvasContract);
        platformFeeRecipientAddress = _platformFeeRecipient;
    }
    

    function receiveRevenue(uint256 canvasId) external payable {
        require(msg.value > 0, "No revenue received");
        require(femCanvasContribution.getTotalContribution(canvasId) > 0, "No contributions for this canvas");
        require(femCanvas.getCanvas(canvasId).canvasId != 0, "Canvas does not exist");

        canvasRevenue[canvasId] += msg.value;
        emit RevenueReceived(canvasId, msg.value);
    }
    
    /**
        * @dev Distribute revenue for a canvas to its contributors based on their contributions.
     */
    function distributeRevenue(uint256 canvasId) external onlyOwner nonReentrant {
        require(!revenueDistributed[canvasId], "Revenue already distributed");
        require(femCanvas.getCanvas(canvasId).canvasId != 0, "Canvas does not exist");
        require(canvasRevenue[canvasId] > 0, "No revenue to distribute");
        // todo 
        uint256 totalRevenue = canvasRevenue[canvasId];
        uint256 platformFee = (totalRevenue * platformFeeRate) / 10000;
        uint256 distributableRevenue = totalRevenue - platformFee;
        totalPlatformFees += platformFee;
        
        (
            address[] memory contributors,
            uint256[] memory amounts,
            uint256 totalContributions
        ) = femCanvasContribution.getCanvasContributionDetails(canvasId);
        require(totalContributions > 0, "No contributions found");
        
        for (uint256 i = 0; i < contributors.length; i++) {
            if (amounts[i] > 0) {
                uint256 contributorShare = (distributableRevenue * amounts[i]) / totalContributions;
                claimableAmount[canvasId][contributors[i]] += contributorShare;
            }
        }
        
        revenueDistributed[canvasId] = true;     
        emit RevenueDistributed(canvasId, distributableRevenue, contributors.length);
    }
    
    
    /**
        * @dev Claim distributed revenue for a canvas.
     */
    function claimRevenue(uint256 canvasId) external nonReentrant {
        require(femCanvas.getCanvas(canvasId).canvasId != 0, "Canvas does not exist");
        require(revenueDistributed[canvasId], "Revenue not distributed yet");
        
        uint256 claimable = claimableAmount[canvasId][msg.sender];
        require(claimable > 0, "No revenue to claim");
        claimableAmount[canvasId][msg.sender] = 0;
        payable(msg.sender).sendValue(claimable);     
        emit RevenueClaimed(canvasId, msg.sender, claimable);
    }

    
    /**
        * @dev Claim accumulated platform fees.
     */
    function claimPlatformFees() external nonReentrant {
        require(totalPlatformFees > 0, "No platform fees to claim");
        
        uint256 fees = totalPlatformFees;
        totalPlatformFees = 0;
        payable(platformFeeRecipientAddress).sendValue(fees);
    }
    

    function setPlatformFeeRate(uint256 newRate) external onlyOwner {
        uint256 oldRate = platformFeeRate;
        platformFeeRate = newRate;
        emit PlatformFeeUpdated(oldRate, newRate);
    }
    

    function setPlatformFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid recipient");
        
        address oldRecipient = platformFeeRecipientAddress;
        platformFeeRecipientAddress = newRecipient;
        emit PlatformFeeRecipientUpdated(oldRecipient, newRecipient);
    }
    

    function getClaimableAmount(uint256 canvasId, address contributor) external view returns (uint256) {
        return claimableAmount[canvasId][contributor];
    }
    
    
    function getTotalClaimableAmount(
        uint256[] calldata canvasIds,
        address contributor
    ) external view returns (uint256) {
        uint256 total = 0;
        
        for (uint256 i = 0; i < canvasIds.length; i++) {
            total += claimableAmount[canvasIds[i]][contributor];
        }
        
        return total;
    }
    

    function getCanvasRevenueStatus(uint256 canvasId) external view returns (uint256 totalRevenue,bool distributed,uint256 contributorsCount){
        totalRevenue = canvasRevenue[canvasId];
        distributed = revenueDistributed[canvasId];
        
        (
            address[] memory contributors,
            uint256[] memory amounts,
            uint256 totalContributions
        ) = femCanvasContribution.getCanvasContributionDetails(canvasId);
        contributorsCount = contributors.length;
    }
    

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        payable(owner()).sendValue(balance);
    }
    

    receive() external payable {
        
    }
}