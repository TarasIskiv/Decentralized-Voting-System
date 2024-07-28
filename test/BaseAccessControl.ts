import { expect } from "chai";
import { ethers } from "hardhat";

describe('BaseAccessControl', () => 
{
    var admin: any, moderator: any;
    var adminRole: any;
    var moderatorRole: any;
    let baseAccessControl: any;
    let adminAddress:any, moderatorAddress: any;

    beforeEach(async() => 
    {
        [admin, moderator] = await ethers.getSigners();
        adminAddress = await admin.getAddress();
        moderatorAddress = await moderator.getAddress();

        const BaseAccessControl = await ethers.getContractFactory("BaseAccessControl");
        baseAccessControl = await BaseAccessControl.deploy(adminAddress);
        adminRole = await baseAccessControl.connect(admin).ADMIN_ROLE();
        moderatorRole = await baseAccessControl.connect(admin).MODERATOR_ROLE();
    });

    describe('Deploying',() => 
    {
        it('Admin role set correctly', async() => 
        {
            var roleGrantedCorrectly = await baseAccessControl.hasRole(adminRole, admin);
            expect(roleGrantedCorrectly).to.equal(true);
        });

    });

    describe('Managing Roles', () => 
    {
        it('Grant Moderator Role', async() => 
        {
            await baseAccessControl.connect(admin).grantModeratorRole(adminAddress, moderator)
            var roleGrantedCorrectly = await baseAccessControl.hasRole(moderatorRole, moderator);
            expect(roleGrantedCorrectly).to.equal(true);
        });

        it('Revoke moderator role', async() => 
        {
            await baseAccessControl.connect(admin).revokeModeratorRole(adminAddress, moderator);
            var hasRole = await baseAccessControl.hasRole(moderatorRole, moderator);
            expect(hasRole).to.be.equal(false);
        });
    });
});

