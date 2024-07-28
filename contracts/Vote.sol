// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./BaseAccessControl.sol";

contract Vote is ERC721URIStorage, IERC721Receiver, BaseAccessControl
{
    using Counters for Counters.Counter;

    Counters.Counter private tokenIds;

    constructor() ERC721("VOTE", "VTE") BaseAccessControl(msg.sender){}


    function createVoteEvent(address _caller,  string memory _url) onlyPersonWithAccess(_caller) external returns (uint256)
    {
        tokenIds.increment();
        uint256 tokenId = tokenIds.current();
        _safeMint(address(this), tokenId);
        _setTokenURI(tokenId, _url);
        return tokenId;
    }

    function removeVoteEvent(address _caller, uint256 _tokenId) onlyAdmin(_caller) external
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

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(AccessControl, ERC721URIStorage) returns (bool) {}
}