import { useState } from 'react';
import Search from './Search';
import Votes from './Votes';

const Home = () => 
{
  const [search, setSearch] = useState("");
  const handleSearchChange = (fsearch) =>
  {
    setSearch(fsearch);
    console.log(fsearch);
  }
  return (
   <div className='home'>
      <Search onSearchChanged={handleSearchChange}/>
      <Votes/>
   </div>
  );
}

export default Home;
