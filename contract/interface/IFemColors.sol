// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IFemColors {

        // Only callable by the platform or authorized contract
        function rewardColor(address to,uint256 colorId) external ;
        // Transfers NFT to buyer only if payment is correct
        function transferColor(address _to,uint256 colorId) external payable ;
        // Users purchase a color
        function buyColor(uint256 colorId) external payable ;
        // Useful for front-end to display current price before purchase
        function getPrice(uint256 colorId) external view returns(uint256 price);
        // The URI pointing to the color's metadata JSON on IPFS or other storage
        function tokenURI(uint256 tokenId) external view returns(string memory);
        // Typically called during initialization or metadata update
        function setURI(uint256 colorId, string memory newURI) external;
        // Since each user can only hold one copy of each color, returns a list of tokenIds
        function colorsOfUser(address owner) external view returns(uint256[] memory);
        // The address of the current owner of this color
        function ownerOf(uint256 colorId) external view returns(address); 
    
}