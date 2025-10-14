// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IFemCanvas {
    struct Canvas{
        uint256 canvasId;// ERC1155 tokenId
        uint256 dayTimestamp;
        string metadataURI;
        address creator;
        uint256 totalRaised;// wei
        bool finalized;// the settlement been completed
    }

    event CanvasCreated(
        uint256 indexed canvasId,
        uint256 indexed dayTimestamp,
        string metadataURI,
        address indexed creator
    );
    event CanvasURIUpdate(uint256 indexed canvasId,string newURI);
    event CanavasFinalized(uint256 indexed  canvasId,uint256 dayTimestamp);

    // everyday mint one canva
    function mintCanvas(uint256 canvasId,uint256 dayTimestamp,string calldata ipfsURI,uint256 amount) external;

    function finalized(uint256 canvasId) external;

    function getCanvasIdByDay(uint256 dayTimestamp) external view returns (uint256);

    function getCanvas(uint256 canvasId) external view returns (Canvas memory);

}

