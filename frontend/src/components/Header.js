import { useContext, useEffect, useState } from "react";
import { ethers } from 'ethers';
import { AccountContext } from "../contexts/AccountContext";
import BaseAccessControl from '../abis/BaseAccessControl.json'
import config from '../config.json';
import { useNavigate } from 'react-router-dom';

const Header = () =>
{
    const navigate = useNavigate();
    const { account, setAccount } = useContext(AccountContext);
    const [hasAccess, setHasAccess] = useState(false);

    const connectWallet = async () => 
    {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
            const selectedAccount = ethers.getAddress(accounts[0]);
            setAccount(selectedAccount); // Update the account in context
        }
    }

    const verifyAccess = async () => 
    {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(); 
        const network = await provider.getNetwork();

        const baseAccessControlAddress = config[Number(network.chainId)]?.baseAccessControl?.address;

        if (!baseAccessControlAddress) 
        {
            console.error('VoteEventProcessor address not found for the current network.');
            return;
        }
        
        const baseAccessControl = new ethers.Contract(baseAccessControlAddress, BaseAccessControl, signer);
        //call vote action
        let isAdmin = await baseAccessControl.isAdmin();

        let isModerator = await baseAccessControl.isModerator();
        
        setHasAccess(isAdmin || isModerator);
    }

    const goToEvents = () => 
    {
        navigate("/manageEvents/");
    }

    const goToCandidates = () => 
    {
        //navigate("/manageEvents/");
    }

    useEffect(() => 
    {
        verifyAccess();
    }, [account])

    return (
        <div className='d-flex justify-content-between align-items-center header'>
          <h3>Decentralized Vote App</h3>
          <div className='d-flex align-items-center'>
            {hasAccess && (
              <>
                <button className='btn btn-primary action-btn me-2' onClick={goToEvents}>Manage Events</button>
                <button className='btn btn-primary action-btn me-2'>Manage Candidates</button>
              </>
            )}
            {account ? (
              <button className='btn btn-success' onClick={connectWallet}>
                {account.slice(0, 6) + '...' + account.slice(38, 42)}
              </button>
            ) : (
              <button className='btn btn-primary' onClick={connectWallet}>
                Connect
              </button>
            )}
          </div>
        </div>
      );
}

export default Header;