// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.26;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract BaseAccessControl is AccessControl
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR");

    constructor()
    {
        _setupRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(MODERATOR_ROLE, ADMIN_ROLE);
    }

    modifier onlyAdmin()
    {
        require(hasRole(ADMIN_ROLE, msg.sender), "You don't have access for this action");
        _;
    }

    modifier onlyPersonWithAccess()
    {
        require(hasRole(MODERATOR_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender), "You don't have access for this action");
        _;
    }

    function grantModeratorRole(address _moderator) public onlyAdmin()
    {
        grantRole(MODERATOR_ROLE, _moderator);
    }

    function revokeModeratorRole(address _moderator) public onlyAdmin()
    {
        revokeRole(MODERATOR_ROLE, _moderator);
    }
}