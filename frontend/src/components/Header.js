import { useContext } from "react";
import { ethers } from 'ethers';
import { AccountContext } from "../contexts/AccountContext";
const Header = () =>
{
    const { account, setAccount } = useContext(AccountContext);

    const connectWallet = async () => 
    {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
            const selectedAccount = ethers.getAddress(accounts[0]);
            setAccount(selectedAccount); // Update the account in context
        }
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