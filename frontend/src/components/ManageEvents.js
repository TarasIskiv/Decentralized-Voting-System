
import { useEffect, useState } from 'react';
import ManageableEvent from './ManageableEvent';
import { useBaseAccessControl } from '../contexts/BaseAccessControlContext';
import { useVoteEventProcessorContext } from '../contexts/VoteEventProcessorContext';
import MintItem from './MintItem';
const ManageEvents = () => 
{

    const {votesCount, getVotesShortInfo, addNewEvent} = useVoteEventProcessorContext();
    const {canRemove, canDeactivate} = useBaseAccessControl();
    const [isMintOpened, setIsMintOpened] = useState(false);

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
    }

    const hasAccess = () => 
    {
        if(isMintOpened) return true;
        return (canRemove || canDeactivate);
    }

    const openMint = () => 
    {
        setIsMintOpened(true);
    }

    const mintEvent = async (url) => 
    {
        if(url != null)
        {
            await addNewEvent(url);
        }
        setIsMintOpened(false);
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
                <button className="btn btn-primary" disabled={hasAccess()} onClick={openMint}>Mint Event</button>
            </div>
            <hr/>
            <MintItem isHidden={!isMintOpened} onMintLinkChanged={mintEvent}/>
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