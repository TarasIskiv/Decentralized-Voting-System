import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';


const SingleEvent = ({vote, search}) => 
{
    const navigate = useNavigate();

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

    const [isVisible, setIsVisible] = useState(true);

    const fetchMetadata = async () => {
        try {
            console.log(search);
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

        setIsVisible(metadata.name.toLowerCase().includes(search.toLowerCase()));
        } catch (err) {}
    }

    const getEthPrice = (priceInWei) => priceInWei / 1000000000000000000;
    
    const goToEvent = () =>
    {
        if(isVisible) navigate(`/voteEvent/${vote.id}`);
    }

    useEffect(() => 
    {
        fetchMetadata()
    }, [search])

    return (
        <div className="singleEvent" style={{ display: isVisible ? 'block' : 'none' }} onClick={goToEvent} >
            <div style={{height: '75%'}}>
                <img style={{width: '100%', height: '100%'}} className='singleEvent' src={formattedVote.imageUrl} alt='Event doenst contain wallpaper'></img>
            </div>
            <div className="d-flex justify-content-between align-items-center vote-details" style={{height: '25%', padding: '0em 2em'}}>
                <div className='vote-event-container votes-count'>{formattedVote.totalVotes} Votes</div>
                <div className="vote-event-container">
                    <h6 className="price">{getEthPrice(formattedVote.voteFee)}</h6>
                    <FontAwesomeIcon icon={faEthereum} className="eth-icon" />
                </div>
            </div>
        </div>
    );
}

export default SingleEvent;
