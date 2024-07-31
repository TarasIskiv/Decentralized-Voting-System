import { useEffect, useState } from "react";
import {ethers} from 'ethers';
import SingleEvent from './SingleEvent';
import config from '../config.json';
import VoteEventProcessor from '../abis/VoteEventProcessor.json';

const Votes = () => 
{
    const [votes, setVotes] = useState([]);
    
    const loadVotes =  async () => 
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
            var voteEvents = await voteEventProcessor.getVotesShortInfo();

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
                                <SingleEvent vote={vote} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Votes;