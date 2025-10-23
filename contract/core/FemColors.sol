// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interface/IFemColors.sol";

contract FemColors is ERC721URIStorage, Ownable, IFemColors {
    uint256 public colorsCounter;
    // colorId => price
    mapping(uint256 => uint256) private colorPrices;
    mapping(address => uint256[]) private ownedColors;
    mapping(uint256 => string) private colorCodes;
    // colors that have been minted
    mapping(uint256 => address) private exists;

    constructor() ERC721("FemColors", "FC") Ownable(msg.sender) {}

    function rewardColor(address to, uint256 colorId,string memory metadataURI) external onlyOwner {
        require(exists[colorId] == address(0), "Color already exists");
        _safeMint(to, colorId);
        _setTokenURI(colorId, metadataURI);
        ownedColors[to].push(colorId);
        exists[colorId] = to;
        colorsCounter++;
        emit ColorMinted(to, colorId, colorCodes[colorId]);
    }

    function buyColor(uint256 colorId, string calldata metadataURI) external payable {
        require(exists[colorId] != address(0), "Color already minted");
        uint256 price = colorPrices[colorId];
        require(msg.value >= price, "Insufficient payment");

        _safeMint(msg.sender, colorId);
        _setTokenURI(colorId, metadataURI);
        exists[colorId] = msg.sender;
        ownedColors[msg.sender].push(colorId);

        colorsCounter++;

        emit ColorMinted(msg.sender, colorId, colorCodes[colorId]);
    }

    function transferColor(address to, uint256 colorId) external payable {
        require(ownerOf(colorId) == msg.sender, "Not owner");
        _transfer(msg.sender, to, colorId);

        _removeColorFromOwner(msg.sender, colorId);
        ownedColors[to].push(colorId);

        emit ColorTransferred(msg.sender, to, colorId, msg.value);
    }

    function setPrice(uint256 colorId, uint256 price) external onlyOwner {
        colorPrices[colorId] = price;
    }

    function getPrice(uint256 colorId) external view returns(uint256) {
        return colorPrices[colorId];
    }

    function setURI(uint256 colorId, string memory newURI) external onlyOwner {
        _setTokenURI(colorId, newURI);
    }

    function colorsOfUser(address owner) external view returns(uint256[] memory) {
        return ownedColors[owner];
    }

    function _removeColorFromOwner(address owner, uint256 colorId) internal {
        uint256[] storage colors = ownedColors[owner];
        for (uint256 i = 0; i < colors.length; i++) {
            if (colors[i] == colorId) {
                colors[i] = colors[colors.length - 1];
                colors.pop();
                break;
            }
        }
    }

    function ownerOf(uint256 tokenId)public view override(ERC721, IERC721, IFemColors) returns(address){
        return super.ownerOf(tokenId);
    }

    // covered ERC721URIStorage / IFemColors 的 tokenURI
    function tokenURI(uint256 tokenId)public view override(ERC721URIStorage, IFemColors) returns(string memory){
        return super.tokenURI(tokenId);
    }
}
