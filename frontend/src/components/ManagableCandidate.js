import { useEffect, useState } from "react";
import { useCandidateContext } from '../contexts/CandidateContext';

const ManageableCandidate = ({candidateShortInfo, canRemove, canDeactivate}) =>
{
    const {removeCandidate} = useCandidateContext();

    const [candidate, setCandidate] = useState(
    {
        id: 0,
        url: '',
        name: '',
        image: '',
        description: '',
        attributes: []
    })

    const loadCandidateMeta = async () => 
    {
       var meta = await loadMeta(candidateShortInfo[1]);
       setCandidate(
        {
            id: Number(candidateShortInfo[0]),
            url: candidateShortInfo[1],
            name: meta.name,
            image: meta.image,
            description: meta.description,
            attributes: meta.attributes
        });
    }

    const loadMeta = async(uri) =>
    {
        try {
            const response = await fetch(uri);
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            const metadata = await response.json();

            return metadata
        } catch (err) {}
    }

    const remove = async () =>
    {
        await removeCandidate(candidate.id);
    }

    useEffect(() => 
    {
        loadCandidateMeta();
    }, [candidateShortInfo, canRemove, canDeactivate]);

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
                        {candidate.attributes.map((info, index) => 
                        (
                            <span><text>{info.property}: </text> {info.value} {index === candidate.attributes.length - 1 ? '' : '|'} </span>
                        ))}
                    </p>
                </div>
                <div className="col-2">
                    <div className="w-100 h-100 d-flex justify-content-end align-items-center">
                        <button className="btn btn-danger" disabled={!canRemove} onClick={remove}>Remove</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageableCandidate;