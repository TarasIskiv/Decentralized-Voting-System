import { expect } from "chai";
import { ethers } from "hardhat";
import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe('Vote Event Processor', () => 
{
    var voteEventProcessor: any;
    var admin: any;
    var moderator: any;
    var user: any;
    async function InitializeFixture()
    {
        [admin, moderator, user] = await ethers.getSigners();
        var Vote = await ethers.getContractFactory('Vote');
        var vote = await Vote.deploy();
        vote.waitForDeployment();

        var voteAddress = await vote.getAddress();
        var VoteEventProcessor = await ethers.getContractFactory('VoteEventProcessor');
        voteEventProcessor = await VoteEventProcessor.deploy(voteAddress);
        voteEventProcessor.waitForDeployment();
    }

    async function createVoteEventFixture()
    {
        var url: string = "";
        await voteEventProcessor.connect(admin).addNewEvent(url);
    }

    async function addCandidatesFixture()
    {
        const eventId = 1;
        for(let i = 0; i < 2; ++i)
        {
            await voteEventProcessor.connect(admin).addCandidate(eventId, i);
        }
    }

    describe('Managing Vote Events', () => 
    {
        it('Creating Vote Event', async() => 
        {
            await loadFixture(InitializeFixture);
            await loadFixture(createVoteEventFixture);

            var transaction: number = await voteEventProcessor.connect(admin).getEventId(1);
            expect(Number(transaction)).to.be.equal(1);
        });

        it('Deactivation Vote Event', async() => 
        {
            await voteEventProcessor.connect(moderator).deactivateVoteEvent(1);
            var status = await voteEventProcessor.connect(moderator).getEventStatus(1);
            expect(Number(status)).to.be.equal(1);
        });

        it('Removing Vote Event', async() => 
        {
            await voteEventProcessor.connect(admin).removeEvent(1);
            var transaction: number = await voteEventProcessor.connect(admin).getEventId(1);
            expect(Number(transaction)).to.be.equal(0);
        });

    });

    describe('Handling Vote Actions', () => {
        const weiAmount = ethers.getBigInt('1000000000000000');
    
        it('Vote Actions', async () => {
            await loadFixture(InitializeFixture);
            await loadFixture(createVoteEventFixture);
            await loadFixture(addCandidatesFixture);
    

            const userAddress = await user.getAddress();
            const contractAddress = await voteEventProcessor.getAddress();
            const userBalanceBefore = await ethers.provider.getBalance(userAddress);
            const contractBalanceBefore = await ethers.provider.getBalance(contractAddress);
            // Send transaction
            await voteEventProcessor.connect(user).vote(1, 1, { value: weiAmount });
    
            //Check user balance
            const userBalanceAfter = await ethers.provider.getBalance(userAddress);
            expect(Number(userBalanceAfter)).to.be.lt(Number(userBalanceBefore - weiAmount)); // Balance should be zero if the full amount is sent
    
            // Check contract balance
            const contractBalanceAfter = await ethers.provider.getBalance(contractAddress);
            expect(Number(contractBalanceAfter)).to.be.equal(Number(contractBalanceBefore + weiAmount));
        });
    
        it('Get Candidate Votes', async () => {
            const candidateVotes = await voteEventProcessor.connect(user).getCandidateVotes(1, 1);
            expect(Number(candidateVotes)).to.be.equal(1);
        });
    
        it('Get Total Votes', async () => {
            const totalVotes = await voteEventProcessor.connect(user).getTotalVotes(1);
            expect(Number(totalVotes)).to.be.equal(1);
        });
    });
});

