import {ethers} from "hardhat";

async function main()
{
    const TOTAL_CANDIDATES: number = 4;
    const candidateBaseUrl: string = "https://ipfs.io/ipfs/Qmai9iwTXbPkim9nuNjtmSSRK11QBJBSavMTnqnZbey3Qe"
    const voteEventUrl: string = "https://ipfs.io/ipfs/QmSLd8TZgsuP9tSGn1v2Mmx3RhfFRXP2EJsVN2L1FWdm4i/1.json";

    const [admin, moderator, user] = await ethers.getSigners();

    const adminAddress = await admin.getAddress();
    const moderatorAddress = await moderator.getAddress();

    //BaseAccessControl Deployment
    const BaseAccessControl = await ethers.getContractFactory('BaseAccessControl');
    const baseAccessControl: any = await BaseAccessControl.deploy(adminAddress);
    await baseAccessControl.waitForDeployment();
    console.log('BaseAccessControl has been deployed');

    //Candidate Deployment
    const Candidate = await ethers.getContractFactory('Candidate');
    const candidate: any = await Candidate.deploy();
    await candidate.waitForDeployment();
    console.log('Candidate has been deployed');

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

    //VoteEventProcessor Deployment
    const voteAddress = await vote.getAddress();
    const VoteEventProcessor = await ethers.getContractFactory('VoteEventProcessor');
    const voteEventProcessor: any = await VoteEventProcessor.deploy(voteAddress);
    await voteEventProcessor.waitForDeployment();
    console.log('VoteEventProcessor has been deployed');

    //Grant moderator with access
    await voteEventProcessor.connect(admin).grantModeratorRole(adminAddress, moderatorAddress);

    //Mint Vote Event
    await voteEventProcessor.connect(admin).addNewEvent(voteEventUrl);

    console.log('Deployemnt finished');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });