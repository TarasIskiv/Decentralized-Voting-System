import { useState } from "react";
import { ethers } from 'ethers';

const Header = () =>
{
    const [connected, setConnected] = useState(false);
    const [account, setAccount] = useState(null);
    const connectWallet = async () => 
    {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        const account = await ethers.getAddress(accounts[0]);
        //connect wallet
        setConnected(true);
        setAccount(account);
        console.log(account);
    }


    return (
        <div className='d-flex justify-content-between header'>
            <h3>Decentalized Vote App</h3>
            {
                account ?
                (<button className="btn btn-success" onClick={connectWallet}>{account.slice(0, 6) + '...' + account.slice(38, 42)}</button>) :
                (<button className="btn btn-primary" onClick={connectWallet}>Connect</button>) 
                
            }
        </div>
    )
}

export default Header;