import { useEffect, useState } from "react";
// If exported as a default export
import SingleEvent from './SingleEvent';

const Votes = () => 
{
    const [votes, setVotes] = useState([]);

    const loadVotes = () => 
    {
        //real loading process

        let tempVotes = [{
            id: 1,
            name: "Hello",
            desc: "djjd",
        },
        {
            id: 2,
            name: "AAAA",
            desc: "ds",
        },
        {
            id: 3,
            name: "POPOP",
            desc: "ssss",
        }];
        debugger;
        setVotes(tempVotes);
    }

    const chunkArray = () => 
    {
        let result = [];
        for(let i = 0; i < votes.length; i += 3)
        {
            result.push(votes.slice(i, i + 3));
        }
        return result;
    }

    useEffect(() => {
        loadVotes();
      }, []);
    const rows = chunkArray(votes);

    return (
        <div className="content">
            <div className="container">
                {rows.map((row, index) => (
                    <div className="row" style={{height: '30vh'}} key={index}>
                        {row.map((vote, voteIndex) => (
                            <div className="col-sm" key={voteIndex}>
                                <SingleEvent vote={vote} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Votes;