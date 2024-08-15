// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./BaseAccessControl.sol";

struct CandidateShortInfo{
    uint256 id;
    string url;
}


contract Candidate is ERC721URIStorage, IERC721Receiver, BaseAccessControl {
    using Counters for Counters.Counter;

    Counters.Counter private tokenIds;
    uint256 public totalSupply = 0;

    CandidateShortInfo[] private candidatesShortListItems;

    constructor() ERC721("Candidate", "CND") BaseAccessControl(msg.sender) {}

    function registerCandidate(string memory _url) public onlyPersonWithAccess(msg.sender) returns (uint256) {
        tokenIds.increment();
        uint256 tokenId = tokenIds.current();
        _safeMint(address(this), tokenId);
        _setTokenURI(tokenId, _url);


        candidatesShortListItems.push(CandidateShortInfo(
        {
            id: tokenId,
            url: _url
        }));   

        totalSupply = tokenId;
        return tokenId;
    }

    function removeCandidate(uint256 _tokenId) public onlyAdmin(msg.sender) 
    {
        uint256 index = findKey(_tokenId);
        if(index != uint256(int256(-1))) delete candidatesShortListItems[index];
        _burn(_tokenId);
    }

    function findKey(uint256 key) private view returns(uint256)
    {
        for(uint i = 0; i < candidatesShortListItems.length; ++i)
        {
            if(key == candidatesShortListItems[i].id) return i;
        }

        return uint256(int256(-1));
    }

    function getCandidates() public view returns(CandidateShortInfo[] memory)
    {
        return candidatesShortListItems;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(AccessControl, ERC721URIStorage) returns (bool) {}

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}