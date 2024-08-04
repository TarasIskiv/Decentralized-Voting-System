const SingleCandidate = ({candidate, onVoteClicked}) =>
{
    const handleVote = () =>
    {
        onVoteClicked(candidate.id);
    }
    return (
        <div className='single-candidate container'>
            <div className="row">
                <div className="col-2" style={{ paddingLeft: '0'}}>
                    <img src={candidate.image} alt='None' className="candidate-img" />
                </div>
                <div className="col-7 d-flex-justify-content-start candidate-info">
                    <p><span className="single-candidate-info">Name: </span> {candidate.name}</p>
                    <p><span className="single-candidate-info">Description: </span> {candidate.description}</p>
                    <p>
                        {candidate.personalityInfo.map((info, index) => 
                        (
                            <span><text>{info.property}: </text> {info.value} {index === candidate.personalityInfo.length - 1 ? '' : '|'} </span>
                        ))}
                    </p>
                    <p><span className="single-candidate-info">Votes: </span> {candidate.votes}</p>
                </div>
                <div className="col">
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <button className="btn btn-primary vote-btn" onClick={handleVote}>Vote</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleCandidate;