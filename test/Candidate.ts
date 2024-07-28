import { expect } from "chai";
import {ethers} from "hardhat"

describe('Candidate', () => 
{
    it('Registration', async() => 
    {
        let signers = await ethers.getSigners();
        let admin = signers[0];
        let Candidate = await ethers.getContractFactory('Candidate');
        let candidate: any = await Candidate.deploy();
        await candidate.waitForDeployment();

        await candidate.connect(admin).registerCandidate("");
        var totalSupply = await candidate.totalSupply();
        expect(Number(totalSupply)).to.be.equal(1);
    });
});