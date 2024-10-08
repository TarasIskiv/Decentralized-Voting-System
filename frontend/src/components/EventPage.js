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
import { useCandidateContext } from "../contexts/CandidateContext";
import { useVoteEventProcessorContext } from "../contexts/VoteEventProcessorContext";
const EventPage = () =>
{
    const {account} = useContext(AccountContext);
    const { getCandidateTokenURI } = useCandidateContext();
    const {getVoteShortInfo, getEventCandidates, getCandidateVotes, voteForCandidate } = useVoteEventProcessorContext();

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
            
            var shortInfo = await getVoteShortInfo(voteEventId);
            var metadata = await loadMeta(shortInfo[4]);
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
            console.log(voteEvent.imageUrl);
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
            
            var candidates = await getEventCandidates(voteEventId);
            await fillOutCandidateDetails(candidates);
            
        } catch (error) {
            console.error('Failed to fetch candidates:', error);
        }
    }

    const fillOutCandidateDetails = async(candidates) => 
    {
        let freshCandidates = [];
        for(let i = 0; i < candidates.length; ++i)
        {
            let candidateVotes = await getCandidateVotes(voteEventId, candidates[i]);
            let uri = await getCandidateTokenURI(candidates[i]);
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
    const vote = async (candidateId) => 
    {
        await voteForCandidate(voteEventId, candidateId, voteEvent.voteFee);
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