import { useState, useEffect } from "react";
import {ethers} from 'ethers';
import config from '../config.json'
import VoteEventProcessor from '../abis/VoteEventProcessor.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { useVoteEventProcessorContext } from "../contexts/VoteEventProcessorContext";

const ManageableEvent = ({vote, canRemove, canDeactivate}) =>
{
    const [isVisible, setIsVisible] = useState(true);

    const {deactivateVoteEvent, activateVoteEvent} = useVoteEventProcessorContext();

    const [formattedVote, setFormattedVote] = useState(
        {
            id: Number(vote[0]),
            status: Number(vote[1]),
            totalVotes: Number(vote[2]),
            voteFee: Number(vote[3]),
            tokenURI: vote[4],
            name: "",
            description: "",
            imageUrl: ""
        });

    const fetchMetadata = async () => {
        try {
            const response = await fetch(formattedVote.tokenURI);
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            const metadata = await response.json();

            setFormattedVote(prevState => ({
            ...prevState,
            imageUrl: metadata.image,
            description: metadata.description,
            name: metadata.name
            }));
            setIsVisible(metadata.name.toLowerCase().includes(""));

        } catch (err) {}
    }

    const getEthPrice = (priceInWei) => priceInWei / 1000000000000000000;

    const deactivateEvent = async () => 
    {
        await deactivateVoteEvent(formattedVote.id);
    }

    const activateEvent = async () => 
    {
        await activateVoteEvent(formattedVote.id);
    }

    useEffect(() => 
    {
        fetchMetadata();
    }, [])

    if(Number(formattedVote.id))
    {
        return (
            <div className='single-candidate container' style={{ display: isVisible ? 'block' : 'none' }}>
                <div className="row">
                    <div className="col-2" style={{ paddingLeft: '0'}}>
                        <img src={formattedVote.imageUrl} alt='None' className="candidate-img" />
                    </div>
                    <div className="col-7 d-flex-justify-content-start candidate-info">
                    <p><span className="single-candidate-info">Name: </span> {formattedVote.name}</p>
                    <p><span className="single-candidate-info">Description: </span> {formattedVote.description}</p>
                    <p><span className="single-candidate-info">Votes: </span> {formattedVote.totalVotes}</p>
                    <p><span className="single-candidate-info">Vote Fee: </span> 
                    {getEthPrice(formattedVote.voteFee)}
                    <FontAwesomeIcon icon={faEthereum} />
                    </p>
                </div>
                    <div className="col">
                        <div className="d-flex flex-column justify-content-center w-100 h-100">
                            {
                                formattedVote.status === 0 ?
                                (<button className="btn btn-warning" 
                                    style={{ display: formattedVote.status === 0 ? 'block' : 'none' }}
                                    disabled={!canDeactivate} 
                                    onClick={deactivateEvent}>Deactivate</button>)
                                :
                                (<button className="btn btn-warning" 
                                    style={{ display: formattedVote.status === 1 ? 'block' : 'none' }}
                                    disabled={!canDeactivate} 
                                    onClick={activateEvent}>Activate</button>)
                            }
                            <br/>
                            <button className="btn btn-danger" style={{ display: formattedVote.status === 1 ? 'block' : 'none' }} disabled={!canRemove}>Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    } 
}

export default ManageableEvent;