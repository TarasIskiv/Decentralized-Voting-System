import { useState } from 'react';
import Search from './Search';

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
      <p>{search}</p>
   </div>
  );
}

export default Home;
