import {ethers} from "hardhat";

async function main()
{
    const TOTAL_CANDIDATES: number = 4;
    const candidateBaseUrl: string = "https://ipfs.io/ipfs/QmWeA3L3UuM5F6dL8FWLkFhmXmTrU15otBpspHRrks5Chm"
    const voteEventUrl: string = "https://ipfs.io/ipfs/QmPzxyHbEHXEjLsQmLSHV3Mn7UHJVzvczbto72unvnx4aD/1.json";

    const [admin, moderator] = await ethers.getSigners();

    const adminAddress = await admin.getAddress();
    const moderatorAddress = await moderator.getAddress();

    //BaseAccessControl Deployment
    const BaseAccessControl = await ethers.getContractFactory('BaseAccessControl');
    const baseAccessControl: any = await BaseAccessControl.deploy(adminAddress);
    await baseAccessControl.waitForDeployment();
    console.log('BaseAccessControl has been deployed');
    console.log(await baseAccessControl.getAddress());

    //Candidate Deployment
    const Candidate = await ethers.getContractFactory('Candidate');
    const candidate: any = await Candidate.deploy();
    await candidate.waitForDeployment();
    console.log('Candidate has been deployed');
    console.log(await candidate.getAddress());

    //Minting Candidates
    for(var i = 0; i < TOTAL_CANDIDATES; ++i)
    {
        var transaction = await candidate.connect(admin).registerCandidate(`${candidateBaseUrl}/${i + 1}.json`);
        await transaction.wait();
    }

    //Vote Deployment
    const Vote = await ethers.getContractFactory('Vote');
    const vote: any = await Vote.deploy();
    await vote.waitForDeployment();
    console.log('Vote has been deployed');
    console.log(await vote.getAddress());

    //VoteEventProcessor Deployment
    const voteAddress = await vote.getAddress();
    const VoteEventProcessor = await ethers.getContractFactory('VoteEventProcessor');
    const voteEventProcessor: any = await VoteEventProcessor.deploy(voteAddress);
    await voteEventProcessor.waitForDeployment();
    console.log('VoteEventProcessor has been deployed');

    //Grant moderator with access
    await baseAccessControl.connect(admin).grantModeratorRole(adminAddress, moderatorAddress)

    //Mint Vote Event
    await voteEventProcessor.connect(admin).addNewEvent(voteEventUrl);
    await voteEventProcessor.connect(admin).addCandidate(1, 1);
    await voteEventProcessor.connect(admin).addCandidate(1, 2);
    console.log(await voteEventProcessor.getAddress());

    console.log('Admins address: ' + adminAddress);
    console.log('Moderators address: ' + moderatorAddress);
    console.log('Deployemnt finished');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });