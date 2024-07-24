// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./BaseAccessControl.sol";


contract Candidate is ERC721URIStorage, BaseAccessControl
{
    using Counters for Counters.Counter;

    Counters.Counter private tokenIds;

    constructor() ERC721("Candidate", "CND"){}

    function registerCandidate(string memory _url) public onlyPersonWithAccess()
    {
        tokenIds.increment();
        uint256 tokenId = tokenIds.current();
        _safeMint(address(this), tokenId);
        _setTokenURI(tokenId, _url);
    }

    function removeCandidate(uint256 _tokenId) public onlyAdmin()
    {
        _burn(_tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}