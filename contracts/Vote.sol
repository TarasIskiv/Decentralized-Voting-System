// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract Vote is ERC721URIStorage
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
}