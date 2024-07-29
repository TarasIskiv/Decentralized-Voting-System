import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';

const SingleEvent = ({vote}) => 
{
    return (
        <div className="singleEvent">
            <div style={{height: '75%'}}>Image</div>
            <div className="d-flex justify-content-between align-items-center" style={{height: '25%', padding: '0em 2em'}}>
                <div className='vote-event-container votes-count'>111 Votes</div>
                <div className="vote-event-container">
                    <h6 className="price">0.05</h6>
                    <FontAwesomeIcon icon={faEthereum} className="eth-icon" />
                </div>
            </div>
            {/* <FontAwesomeIcon icon="" /> */}
        </div>
    );
}

export default SingleEvent;
