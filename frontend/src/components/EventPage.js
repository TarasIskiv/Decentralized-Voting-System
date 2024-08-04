import { useContext, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import config from '../config.json';
import VoteEventProcessor from '../abis/VoteEventProcessor.json';
import Candidate from '../abis/Candidate.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import SingleCandidate from "./SingleCandidate";
import { AccountContext } from "../contexts/AccountContext";

const EventPage = () =>
{
    const {account} = useContext(AccountContext);

    const { voteEventId } = useParams();
    const [voteEvent, setVoteEvent] = useState(
    {
        id: 0,
        totalVotes:0 ,
        voteFee: 0,
        tokenURI: "",
        imageUrl: "",
        description: "",
        name: ""
    });

    const [candidates, setCandidates] = useState([]);

    const[loading, setLoading] = useState(true);

    const loadEventDetails = async () => 
    {
        try {
            if (!window.ethereum) {
                console.error('Ethereum provider not found. Make sure you have MetaMask installed.');
                return;
            }
       
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner(); // Create a signer from the provider
            const network = await provider.getNetwork();
            const voteEventProcessorAddress = config[Number(network.chainId)]?.voteEventProcessor?.address;

            if (!voteEventProcessorAddress) {
                console.error('VoteEventProcessor address not found for the current network.');
                return;
            }
            const voteEventProcessor = new ethers.Contract(voteEventProcessorAddress, VoteEventProcessor, signer);
            var shortInfo = await voteEventProcessor.getVoteShortInfo(voteEventId);

            var metadata = await loadMeta(shortInfo[3]);

            setVoteEvent(
            {
                id: Number(shortInfo[0]),
                totalVotes: Number(shortInfo[1]),
                voteFee: Number(shortInfo[2]),
                tokenURI: shortInfo[3],
                imageUrl: metadata.image,
                description: metadata.description,
                name: metadata.name
            });

            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch votes:', error);
        }
    }

    const getEthPrice = (priceInWei) => priceInWei / 1000000000000000000;

    const loadMeta = async(uri) =>
    {
        try {
          const response = await fetch(uri);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const metadata = await response.json();

          return metadata
        } catch (err) {}
    }

    const loadCandidates = async () => 
    {
        try {
            if (!window.ethereum) {
                console.error('Ethereum provider not found. Make sure you have MetaMask installed.');
                return;
            }
       
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner(); // Create a signer from the provider
            const network = await provider.getNetwork();
            const voteEventProcessorAddress = config[Number(network.chainId)]?.voteEventProcessor?.address;

            if (!voteEventProcessorAddress) {
                console.error('VoteEventProcessor address not found for the current network.');
                return;
            }
            const voteEventProcessor = new ethers.Contract(voteEventProcessorAddress, VoteEventProcessor, signer);
            var candidates = await voteEventProcessor.getEventCandidates(voteEventId);
            await fillOutCandidateDetails(voteEventProcessor, candidates);
            
        } catch (error) {
            console.error('Failed to fetch candidates:', error);
        }
    }

    const fillOutCandidateDetails = async(voteEventProcessor, candidates) => 
    {
        let freshCandidates = [];
        for(let i = 0; i < candidates.length; ++i)
        {
            let candidateVotes = await voteEventProcessor.getCandidateVotes(voteEventId, candidates[i]);
            let uri = await loadCandidateMetaURI(candidates[i]);
            let candidateMeta = await loadMeta(uri);
            let candidate = 
            {
                id: Number(candidates[i]),
                name: candidateMeta.name,
                description: candidateMeta.description,
                image: candidateMeta.image,
                personalityInfo: candidateMeta.attributes,
                votes: Number(candidateVotes)
            };
            freshCandidates.push(candidate);
        }

        setCandidates(freshCandidates);
    }

    const loadCandidateMetaURI = async (candidateId) => 
    {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(); 
        const network = await provider.getNetwork();
        const candidateAddress = config[Number(network.chainId)]?.candidate?.address;

        if (!candidateAddress) {
            console.error('VoteEventProcessor address not found for the current network.');
            return;
        }
        const voteEventProcessor = new ethers.Contract(candidateAddress, Candidate, signer);
        return await voteEventProcessor.tokenURI(candidateId);
    }

    const vote = async (candidateId) => 
    {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(); 
        const network = await provider.getNetwork();

        const voteEventProcessorAddress = config[Number(network.chainId)]?.voteEventProcessor?.address;

        if (!voteEventProcessorAddress) 
        {
            console.error('VoteEventProcessor address not found for the current network.');
            return;
        }
        
        const voteEventProcessor = new ethers.Contract(voteEventProcessorAddress, VoteEventProcessor, signer);
        //call vote action
        await voteEventProcessor.vote(voteEventId, candidateId, {value: voteEvent.voteFee});
    }

    useEffect(() => 
        {
            const fetchData = async () => 
            {
                await loadEventDetails();
                await loadCandidates();
            };
    
            fetchData()
        }, [voteEventId]);
    
    return (
        <div>
          {loading ? (
            <div>Loading...</div> // It's often useful to provide some kind of loading indicator or message
          ) : (
            <div className="vote-event-content">
              <h4 className='vote-event-title'>{voteEvent.name}</h4>
              <div className="container ">
                <div className="row vote-event-details d-flex justify-content-start">
                  <div className="col vote-event-wall-container d-flex justify-content-start">
                    <img
                      style={{ height: '100%' }} // Adjusted height to 'auto' to maintain aspect ratio
                      src={voteEvent.imageUrl}
                      alt="Event doesn't contain wallpaper"
                      className="vote-event-wall"
                    />
                  </div>
                  <div className="col vote-event-desc">
                    <p><span style={{fontWeight: 'bold'}} >Description: </span> {voteEvent.description}</p>
                    <p><span style={{fontWeight: 'bold'}} >Total Votes: </span> {voteEvent.totalVotes}</p>
                    <p>
                        <span style={{fontWeight: 'bold'}} >Vote Fee: </span>
                            {getEthPrice(voteEvent.voteFee)} 
                        <span>
                            <FontAwesomeIcon icon={faEthereum} />
                        </span>
                    </p>
                  </div>
                </div>
              </div>
              <hr />
              <div style={{overflow: 'scroll', maxHeight: '40vh'}}>
                {candidates.map((candidate,index) => (
                    <SingleCandidate candidate={candidate} onVoteClicked={vote} />
                ))}
              </div>
            </div>
          )}
        </div>
      );
}

export default EventPage;