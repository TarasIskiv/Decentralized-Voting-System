import { useState } from "react";

const MintItem = ({isHidden, onMintLinkChanged}) =>
{

    const [url, setUrl] = useState("");

    const handleChange = (e) => 
    {
        setUrl(e.target.value);
    };
    
    const processAction = (canceled) =>
    {
        onMintLinkChanged(canceled ? null : url)
    }
    return (
        <div style={{ display: isHidden ? 'none' : 'block' }} className="row">
            <div className="d-flex justify-content-between">
            <div className="input-group mb-3" style={{width: '50%'}}>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Metadata Url" 
                        onChange={handleChange} 
                        aria-describedby="basic-addon2"
                    />
                </div>
                <div>
                    <button className="btn btn-danger" onClick={() => processAction(true)}
                        style={{marginRight: '.5em'}}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => processAction(false)}>Mint</button>
                </div>
            </div>
        </div>
    )
}

export default MintItem;