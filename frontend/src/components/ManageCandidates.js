import { useContext, useEffect, useState } from 'react';
import { useBaseAccessControl } from '../contexts/BaseAccessControlContext';
import { useCandidateContext } from '../contexts/CandidateContext';
import MintItem from './MintItem';
import ManageableCandidate from './ManagableCandidate';

const ManageCandidates = () =>
{
    const {canRemove, canDeactivate} = useBaseAccessControl();
    const [isMintOpened, setIsMintOpened] = useState(false);

    const {getCandidates} = useCandidateContext();
    const [candidates, setCandidates] = useState([]);
    const loadCandidates = async () => 
    {
        let candidates = await getCandidates();
        setCandidates(candidates);
    }

    const openMint = () => 
    {
        setIsMintOpened(true);
    }

    const mintEvent = async (url) => 
    {
        if(url != null)
        {
            //await addNewEvent(url);
        }
        setIsMintOpened(false);
    }
    
    const hasAccess = () => 
    {
        if(isMintOpened) return false;
        return (canRemove || canDeactivate);
    }

    useEffect(() => 
    {
        loadCandidates();
    }, [])

    return (
        <div className='manage-events-container'>
            <div className='w-100 d-flex justify-content-between'>
                <div>
                    <span className="single-candidate-info">Total events: 1 </span>
                </div>
                <button className="btn btn-primary" disabled={() => !hasAccess()} onClick={openMint}>Mint Candidate</button>
            </div>
            <hr/>
            <MintItem isHidden={!isMintOpened} onMintLinkChanged={mintEvent}/>
            <h4>Candidates</h4>
            {candidates.map((candidate, voteIndex) => (
                <div key={voteIndex}>
                    <ManageableCandidate disabled={isMintOpened} candidate={candidate} canRemove={canRemove}/>
                </div>
            ))}
            <hr/>
        </div>
    );
}

export default ManageCandidates;