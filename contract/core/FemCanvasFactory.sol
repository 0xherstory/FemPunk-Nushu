// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./FemCanvas.sol";
import "./FemCanvasContribution.sol";
import "./FemCanvasRevenue.sol";


contract FemCanvasFactory is Ownable {
    // contract addresses
    address public canvasContract;
    address public contributionContract;
    address public revenueContract;
    
    // system configuration
    struct SystemConfig {
        string baseURI;
        address platformFeeRecipient;
        uint256 platformFeeRate;
        bool systemInitialized;
    }
    
    SystemConfig public systemConfig;
    
    // 授权的系统管理员
    mapping(address => bool) public systemAdmins;
    
    event SystemDeployed(
        address canvasContract,
        address contributionContract,
        address revenueContract
    );
    
    event SystemConfigUpdated(
        string baseURI,
        address platformFeeRecipient,
        uint256 platformFeeRate
    );
    
    event SystemAdminUpdated(address admin, bool status);
    
    modifier onlySystemAdmin() {
        require(systemAdmins[msg.sender] || msg.sender == owner(), "Not system admin");
        _;
    }
    
    modifier systemNotInitialized() {
        require(!systemConfig.systemInitialized, "System already initialized");
        _;
    }
    
    constructor() Ownable(msg.sender) {
        systemAdmins[msg.sender] = true;
    }
    
    /**
     * @dev 部署整个系统
     * @param baseURI ERC1155基础URI
     * @param platformFeeRecipient 平台费用接收地址
     * @param platformFeeRate 平台费率（基于10000）
     */
    function deploySystem(
        string memory baseURI,
        address platformFeeRecipient,
        uint256 platformFeeRate
    ) external onlyOwner systemNotInitialized {
        require(bytes(baseURI).length > 0, "Invalid base URI");
        require(platformFeeRecipient != address(0), "Invalid fee recipient");
        require(platformFeeRate <= 1000, "Fee rate too high"); // 最大10%
        
        FemCanvasContribution contribution = new FemCanvasContribution();
        contributionContract = address(contribution);
        
        FemCanvas canvas = new FemCanvas(baseURI);
        canvasContract = address(canvas);
        
        FemCanvasRevenue revenue = new FemCanvasRevenue(
            contributionContract,
            platformFeeRecipient
        );
        revenueContract = address(revenue);
        
        systemConfig = SystemConfig({
            baseURI: baseURI,
            platformFeeRecipient: platformFeeRecipient,
            platformFeeRate: platformFeeRate,
            systemInitialized: true
        });
        
        // setup permissions between contracts
        _setupContractPermissions();
        
        emit SystemDeployed(canvasContract, contributionContract, revenueContract);
        emit SystemConfigUpdated(baseURI, platformFeeRecipient, platformFeeRate);
    }
    
    /**
     * @dev 设置合约间的权限关系
     */
    function _setupContractPermissions() private {
        // set canvas contract authorized minters
        FemCanvas(canvasContract).setAuthorizedMinter(address(this), true);
        FemCanvas(canvasContract).setAuthorizedMinter(owner(), true);
        
        // 设置贡献合约的授权记录者
        FemCanvasContribution(contributionContract).setAuthorizedRecorder(address(this), true);
        FemCanvasContribution(contributionContract).setAuthorizedRecorder(owner(), true);
        
        // 将合约所有权转移给工厂合约（可选）
        // 这样可以通过工厂合约统一管理所有子合约
    }
    
    /**
     * @dev 创建每日画布（统一入口）
     * @param dayTimestamp 日期时间戳
     * @param ipfsURI 画布元数据IPFS链接
     */
    function createDailyCanvas(
        uint256 dayTimestamp,
        string calldata ipfsURI
    ) external onlySystemAdmin returns (uint256 canvasId) {
        require(systemConfig.systemInitialized, "System not initialized");
        
        FemCanvas canvas = FemCanvas(canvasContract);
        canvasId = canvas.getCurrentCanvasCounter();
        
        canvas.mintCanvas(canvasId, dayTimestamp, ipfsURI, 1);
        
        return canvasId;
    }
    
    /**
     * @dev 记录用户贡献（统一入口）
     * @param canvasId 画布ID
     * @param contributor 贡献者地址
     * @param amount 贡献量
     */
    function recordUserContribution(
        uint256 canvasId,
        address contributor,
        uint256 amount
    ) external onlySystemAdmin {
        require(systemConfig.systemInitialized, "System not initialized");
        
        FemCanvasContribution(contributionContract).recordContribution(
            canvasId,
            contributor,
            amount
        );
    }
    
    /**
     * @dev 批量记录贡献（结算期使用）
     * @param canvasId 画布ID
     * @param contributors 贡献者数组
     * @param amounts 贡献量数组
     */
    function recordContributionsBatch(
        uint256 canvasId,
        address[] calldata contributors,
        uint256[] calldata amounts
    ) external onlySystemAdmin {
        require(systemConfig.systemInitialized, "System not initialized");
        
        FemCanvasContribution(contributionContract).recordContributionsBatch(
            canvasId,
            contributors,
            amounts
        );
    }
    
    /**
     * @dev 完成画布并进入结算期
     * @param canvasId 画布ID
     */
    function finalizeCanvas(uint256 canvasId) external onlySystemAdmin {
        require(systemConfig.systemInitialized, "System not initialized");
        
        FemCanvas(canvasContract).finalized(canvasId);
    }
    
    /**
     * @dev 分配画布收益
     * @param canvasId 画布ID
     */
    function distributeCanvasRevenue(uint256 canvasId) external onlySystemAdmin {
        require(systemConfig.systemInitialized, "System not initialized");
        
        FemCanvasRevenue(revenueContract).distributeRevenue(canvasId);
    }
    
    /**
     * @dev 设置系统管理员
     * @param admin 管理员地址
     * @param status 授权状态
     */
    function setSystemAdmin(address admin, bool status) external onlyOwner {
        require(admin != address(0), "Invalid admin address");
        systemAdmins[admin] = status;
        
        // 同步到子合约
        if (systemConfig.systemInitialized) {
            FemCanvas(canvasContract).setAuthorizedMinter(admin, status);
            FemCanvasContribution(contributionContract).setAuthorizedRecorder(admin, status);
        }
        
        emit SystemAdminUpdated(admin, status);
    }
    
    /**
     * @dev 更新系统配置
     * @param newBaseURI 新的基础URI
     * @param newPlatformFeeRecipient 新的平台费用接收地址
     * @param newPlatformFeeRate 新的平台费率
     */
    function updateSystemConfig(
        string memory newBaseURI,
        address newPlatformFeeRecipient,
        uint256 newPlatformFeeRate
    ) external onlyOwner {
        require(systemConfig.systemInitialized, "System not initialized");
        require(bytes(newBaseURI).length > 0, "Invalid base URI");
        require(newPlatformFeeRecipient != address(0), "Invalid fee recipient");
        require(newPlatformFeeRate <= 1000, "Fee rate too high");
        
        systemConfig.baseURI = newBaseURI;
        systemConfig.platformFeeRecipient = newPlatformFeeRecipient;
        systemConfig.platformFeeRate = newPlatformFeeRate;
        
        // 更新收益合约的配置
        FemCanvasRevenue(revenueContract).setPlatformFeeRecipient(newPlatformFeeRecipient);
        FemCanvasRevenue(revenueContract).setPlatformFeeRate(newPlatformFeeRate);
        
        emit SystemConfigUpdated(newBaseURI, newPlatformFeeRecipient, newPlatformFeeRate);
    }
    
    /**
     * @dev 获取系统状态
     * @return 系统合约地址和配置信息
     */
    function getSystemStatus() 
        external 
        view 
        returns (
            address canvas,
            address contribution,
            address revenue,
            SystemConfig memory config
        ) 
    {
        return (canvasContract, contributionContract, revenueContract, systemConfig);
    }
    
    /**
     * @dev 获取画布详细信息（聚合查询）
     * @param canvasId 画布ID
     * @return canvas 画布信息
     * @return contributorsCount 贡献者数量
     * @return totalContributions 总贡献量
     * @return totalRevenue 总收益
     * @return revenueDistributed 收益是否已分配
     */
    function getCanvasDetails(uint256 canvasId) 
        external 
        view 
        returns (
            IFemCanvas.Canvas memory canvas,
            uint256 contributorsCount,
            uint256 totalContributions,
            uint256 totalRevenue,
            bool revenueDistributed
        ) 
    {
        require(systemConfig.systemInitialized, "System not initialized");
        
        canvas = FemCanvas(canvasContract).getCanvas(canvasId);
        contributorsCount = FemCanvasContribution(contributionContract).getContributorsCount(canvasId);
        totalContributions = FemCanvasContribution(contributionContract).getTotalContribution(canvasId);
        
        (totalRevenue, revenueDistributed,) = FemCanvasRevenue(revenueContract).getCanvasRevenueStatus(canvasId);
    }
    
    /**
     * @dev 紧急暂停系统（仅限紧急情况）
     */
    function emergencyPause() external onlyOwner {
        // 可以添加暂停逻辑，比如禁用某些功能
        // 这里只是示例，具体实现根据需求
    }
}