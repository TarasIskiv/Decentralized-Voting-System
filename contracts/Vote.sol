// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Vote is ERC721URIStorage, IERC721Receiver
{
    using Counters for Counters.Counter;

    Counters.Counter private tokenIds;

    constructor() ERC721("VOTE", "VTE"){}


    function createVoteEvent(string memory _url) external returns (uint256)
    {
        tokenIds.increment();
        uint256 tokenId = tokenIds.current();
        _safeMint(address(this), tokenId);
        _setTokenURI(tokenId, _url);
        return tokenId;
    }

    function removeVoteEvent(uint256 _tokenId) external
    {
        _burn(_tokenId);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}