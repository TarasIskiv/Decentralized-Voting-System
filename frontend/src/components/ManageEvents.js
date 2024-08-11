import {ethers} from 'ethers';
import config from '../config.json'
import VoteEventProcessor from '../abis/VoteEventProcessor.json'
import { useContext, useEffect, useState } from 'react';
import ManageableEvent from './ManageableEvent';
import { useBaseAccessControl } from '../contexts/BaseAccessControlContext';
import { useVoteEventProcessorContext } from '../contexts/VoteEventProcessorContext';
const ManageEvents = () => 
{

    const {votesCount, getVotesShortInfo} = useVoteEventProcessorContext();
    const {canRemove, canDeactivate} = useBaseAccessControl();

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
        
        let voteCounts = await votesCount();
        setFormattedVoteCounts({
            totalVotes: voteCounts[0],
            active: voteCounts[1],
            deactivated: voteCounts[2]
        })

        let active = await getVotesShortInfo(0);
        let unActive = await getVotesShortInfo(1);
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
                    <span className="single-candidate-info">Total events: {Number(formattedVoteCounts.totalVotes)} | </span>
                    <span className="single-candidate-info">Active: {Number(formattedVoteCounts.active)} | </span>
                    <span className="single-candidate-info">Deactivated: {Number(formattedVoteCounts.deactivated)}</span>
                </div>
                <button className="btn btn-primary" disabled={!(canRemove || canDeactivate)}>Mint Event</button>
            </div>
            <hr/>
            <h4>Active</h4>
            {activeVotes.map((vote, voteIndex) => (
                <div key={voteIndex}>
                    <ManageableEvent vote={vote} canDeactivate={canDeactivate} canRemove={canRemove}/>
                </div>
            ))}
            <hr/>
            <h4>Deactivated</h4>
            {
                deactivatedVotes && deactivatedVotes.length > 0 && (
                    <div>
                        {deactivatedVotes.map((vote, voteIndex) => (
                            <div key={voteIndex}>
                                <ManageableEvent vote={vote} canDeactivate={canDeactivate} canRemove={canRemove}/>
                            </div>
                        ))}
                    </div>
                )
            }
            
        </div>
    );
}

export default ManageEvents;