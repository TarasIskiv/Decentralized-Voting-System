import { useState } from 'react';
import Search from './Search';
import Votes from './Votes';

const Home = () => 
{
  const [search, setSearch] = useState("");
  const handleSearchChange = (currentSearch) => 
  {
    setSearch(currentSearch);
  }
  return (
   <div className='home'>
      <Search onSearchChanged={handleSearchChange}/>
      <Votes search={search}/>
   </div>
  );
}

export default Home;
