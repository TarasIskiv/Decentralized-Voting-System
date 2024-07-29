import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'; 

const Search = ({ onSearchChanged }) => {
    const [search, setSearch] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        onSearchChanged(value); // Call with the updated value directly
    };

    return (
        <div>
            <div className="d-flex justify-content-center">
                <div className="input-group mb-3" style={{width: '50%'}}>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search for Vote Event" 
                        onChange={handleChange} 
                        aria-describedby="basic-addon2"
                    />
                    <span className="input-group-text">
                        <FontAwesomeIcon icon={faSearch} />
                    </span>
                </div>
            </div>
            <hr />
        </div>
    );
};

export default Search;
