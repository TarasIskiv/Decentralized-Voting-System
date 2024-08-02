import '../App.css';
import Home from './Home';
import Header from './Header';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
    <BrowserRouter>
      <div className="App">
        <Header account={account} setAccount={setAccount}/>
        {account ? 
        (
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/voteEvent/:voteEventId' element={<EventPage />} /> 
          
        </Routes>
        )
          :
          (<div>Connect your wallet</div>)
        }
      </div>
    </BrowserRouter>
  );
}

export default App;
