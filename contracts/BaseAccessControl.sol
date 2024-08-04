// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.26;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract BaseAccessControl is AccessControl
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR");

    constructor(address _admin)
    {
        _setupRole(ADMIN_ROLE, _admin);
        _setRoleAdmin(MODERATOR_ROLE, ADMIN_ROLE);
    }

    modifier onlyAdmin(address _caller)
    {
        require(hasRole(ADMIN_ROLE, _caller), "You don't have access for this action");
        _;
    }

    modifier onlyModerator(address _caller)
    {
        require(hasRole(MODERATOR_ROLE, _caller), "You don't have access for this action");
        _;
    }

    modifier onlyPersonWithAccess(address _caller)
    {
        require(hasRole(MODERATOR_ROLE, _caller) || hasRole(ADMIN_ROLE, _caller), "You don't have access for this action");
        _;
    }

    modifier onlyUser(address _caller)
    {
        require(!(hasRole(ADMIN_ROLE, _caller) || hasRole(MODERATOR_ROLE, _caller)), "Moderators or admins can't call this function");
        _;
    }

    function grantModeratorRole(address _caller, address _moderator) public onlyAdmin(_caller)
    {
        _grantRole(MODERATOR_ROLE, _moderator);
    }
    
    function revokeModeratorRole(address _caller, address _moderator) public onlyAdmin(_caller)
    {
        revokeRole(MODERATOR_ROLE, _moderator);
    }

    function isAdmin() public view returns(bool)
    {
        return (hasRole(ADMIN_ROLE, msg.sender));
    }

    function isModerator() public view returns(bool)
    {
        return (hasRole(MODERATOR_ROLE, msg.sender));
    }
}