import { expect } from "chai";
import { ethers } from "hardhat";

describe('Vote Event Processor', () => 
{
    beforeEach(async() => 
    {
        var Vote = await ethers.getContractFactory('Vote');
        var vote = await Vote.deploy();
        vote.waitForDeployment();
        console.log('vote deployed')

        var voteAddress = await vote.getAddress();
        var VoteEventProcessor = await ethers.getContractFactory('VoteEventProcessor');
        var voteEventProcessor = await VoteEventProcessor.deploy(voteAddress);
        voteEventProcessor.waitForDeployment();
        console.log('voteEventProcessor deployed')
    })  

    describe('Managing Vote Events', () => 
    {
        it('Creating Vote Event', async() => {});
        it('Adding Candidates', async() => {});
        it('Deactivation Vote Event', async() => {});
        it('Removing Vote Event', async() => {});

    });

    describe('Handling Vote Actions', () => 
    {
        it('Vote Actions', async() => {});
        it('Get Candidate Votes', async() => {});
        it('Get Total Votes', async() => {});
    });

});