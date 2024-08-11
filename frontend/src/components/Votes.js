import { useEffect, useState } from "react";
import {ethers} from 'ethers';
import SingleEvent from './SingleEvent';
import config from '../config.json';
import VoteEventProcessor from '../abis/VoteEventProcessor.json';
import { useVoteEventProcessorContext } from "../contexts/VoteEventProcessorContext";

const Votes = ({search}) => 
{
    const [votes, setVotes] = useState([]);
    const {getVotesShortInfo} = useVoteEventProcessorContext();
    const loadVotes =  async () => 
    {
        try {
            var voteEvents = await getVotesShortInfo(0);
            setVotes(voteEvents);
        } catch (error) {
            console.error('Failed to fetch votes:', error);
        }
    }

    const chunkArray = () => 
    {
        let result = [];
        for(let i = 0; i < votes.length; i += 3)
        {
            result.push(votes.slice(i, i + 3));
        }
        return result;
    }

    useEffect(() => {
        loadVotes();
      }, []);
    const rows = chunkArray(votes);

    return (
        <div className="content">
            <div className="container">
                {rows.map((row, index) => (
                    <div className="row" style={{height: '30vh'}} key={index}>
                        {row.map((vote, voteIndex) => (
                            <div className="col-sm" style={{maxWidth: '33%'}} key={voteIndex}>
                                <SingleEvent vote={vote} search={search} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Votes;