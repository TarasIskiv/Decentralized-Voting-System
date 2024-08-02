const SingleCandidate = ({candidate}) =>
{
    return (
        <div className='single-candidate container'>
            <div className="row">
                <div className="col-2" style={{ paddingLeft: '0'}}>
                    <img src={candidate.image} alt='None' className="candidate-img" />
                </div>
                <div className="col-8 d-flex-justify-content-start candidate-info">
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
                <div className="col d-flex align-items-center justify-content-center">
                    <button className="btn btn-primary vote-btn">Vote</button>
                </div>
            </div>
        </div>
    );
}

export default SingleCandidate;