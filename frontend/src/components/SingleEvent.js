import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import {useEffect, useState} from 'react'
const SingleEvent = ({vote}) => 
{
    const [imageUrl, setImageUrl] = useState('');
    const formattedVote = 
    {
        id: Number(vote[0]),
        totalVotes: Number(vote[1]),
        voteFee: Number(vote[2]),
        tokenURI: vote[3]
    }

    const fetchMetadata = async () => {
        try {
          const response = await fetch(formattedVote.tokenURI);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const metadata = await response.json();
          setImageUrl(metadata.image);
        } catch (err) {}
    }

    const getEthPrice = (priceInWei) => priceInWei / 1000000000000000000;
    
    useEffect(() => 
    {
        fetchMetadata()
    }, [])

    return (
        <div className="singleEvent">
            <div style={{height: '75%'}}>
                <img style={{width: '100%', height: '100%'}} className='singleEvent' src={imageUrl} alt='Event doenst contain wallpaper'></img>
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
