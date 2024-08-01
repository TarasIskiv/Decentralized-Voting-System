import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

const EventPage = () =>
{
    const { voteEventId } = useParams();

    const loadEventCandidates = () => 
    {

    }

    const vote = (candidateId) => 
    {
        
    }

    useEffect(() => {loadEventCandidates()}, []);
    
    return(
        <div>
            <h4></h4>
            <div class="container">
                <div class="row">
                    <div class="col"></div>
                    <div class="col"></div>
                </div>
            </div>
            <div class="d-flex justify-content-between">

            </div>
            <hr/>
            candidates
        </div>
    );
}

export default EventPage;