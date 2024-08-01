import '../App.css';
import Home from './Home';
import Header from './Header';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EventPage from './EventPage';

function App() 
{
  const [account, setAccount] = useState(null);

  window.ethereum.on('accountsChanged', async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const caccount = await ethers.getAddress(accounts[0]);
    setAccount(caccount);
  })

  return (
    <div className="App">
      <Header account={account} setAccount={setAccount}/>
      {account ? 
      (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/voteEvent/:voteEventId' element={<EventPage />} /> 
        <Route path='*' element={<div></div>}/>
      </Routes>
      )
        :
         (<div>Connect your wallet</div>)
      }
    </div>
  );
}

export default App;
