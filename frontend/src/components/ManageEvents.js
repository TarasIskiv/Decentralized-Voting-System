import {ethers} from 'ethers';
import config from '../config.json'
import VoteEventProcessor from '../abis/VoteEventProcessor.json'
import { useEffect, useState } from 'react';
import ManageableEvent from './ManageableEvent';
const ManageEvents = () => 
{

    const [formattedVoteCounts, setFormattedVoteCounts] = useState(
    {
        totalVotes: 0,
        active: 0,
        deactivated: 0
    });

    const [activeVotes, setActiveVotes] = useState([]);
    const [deactivatedVotes, setDeactivatedVotes] = useState([]);

    const loadEvents = async () =>
    {
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
        let voteCounts = await voteEventProcessor.getVotesCount();
        setFormattedVoteCounts({
            totalVotes: voteCounts[0],
            active: voteCounts[1],
            deactivated: voteCounts[2]
        })

        let active = await voteEventProcessor.getVotesShortInfo(0);
        let unActive = await voteEventProcessor.getVotesShortInfo(1);
        setActiveVotes(active);

        if(unActive[0][0] === 0)
            setDeactivatedVotes([]);
        else
            setDeactivatedVotes(unActive);

        console.log(deactivatedVotes);
        console.log(deactivatedVotes.length);
    }

    useEffect(() => 
    {
        loadEvents();
    }, [])

    return (
        <div className='manage-events-container'>
            <div className='w-100 d-flex justify-content-between'>
                <div>
                    <span>Total events: {Number(formattedVoteCounts.totalVotes)} | </span>
                    <span>Active: {Number(formattedVoteCounts.active)} | </span>
                    <span>Deactivated: {Number(formattedVoteCounts.deactivated)}</span>
                </div>
                <button className="btn btn-primary">Mint Event</button>
            </div>
            <hr/>
            <h4>Active</h4>
            {activeVotes.map((vote, voteIndex) => (
                <div key={voteIndex}>
                    <ManageableEvent vote={vote}/>
                </div>
            ))}
            <hr/>
            <h4>Deactivated</h4>
            {
                deactivatedVotes && deactivatedVotes.length > 0 && (
                    <div>
                        {deactivatedVotes.map((vote, voteIndex) => (
                            <div key={voteIndex}>
                                <ManageableEvent vote={vote}/>
                            </div>
                        ))}
                    </div>
                )
            }
            
        </div>
    );
}

export default ManageEvents;