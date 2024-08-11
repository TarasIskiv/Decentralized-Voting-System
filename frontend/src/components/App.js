import '../App.css';
import Home from './Home';
import Header from './Header';
import { ethers } from 'ethers';
import { useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EventPage from './EventPage';
import ManageEvents from './ManageEvents';
import { AccountProvider, AccountContext } from '../contexts/AccountContext';
import { BaseAccessControlProvider } from '../contexts/BaseAccessControlContext';
import { CandidateProvider } from '../contexts/CandidateContext';
function App() {
  // The provider should be at the top level of the app, wrapping the BrowserRouter
  return (
    <AccountProvider>
      <BaseAccessControlProvider>
        <CandidateProvider>
          <BrowserRouter>
            <div className="App">
              <Header />
              <AppRoutes />
            </div>
          </BrowserRouter>
        </CandidateProvider>
      </BaseAccessControlProvider>
    </AccountProvider>
  );
}

// Separate component to handle routing and account checking
const AppRoutes = () => {
  const { account, setAccount } = useContext(AccountContext);

  useEffect(() => {
    const handleAccountsChanged = async () => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const caccount = ethers.getAddress(accounts[0]);
        setAccount(caccount);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    // Initial call
    handleAccountsChanged();

    // Set up event listener for account changes
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    // Clean up the event listener on unmount
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [setAccount]);

  return (
    account ? (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/voteEvent/:voteEventId' element={<EventPage />} /> 
        <Route path='/manageEvents/' element={<ManageEvents />} /> 
      </Routes>
    ) : (
      <div>Connect your wallet</div>
    )
  );
};

export default App;
