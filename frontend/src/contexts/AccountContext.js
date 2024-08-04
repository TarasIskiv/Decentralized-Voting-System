// AccountContext.js
import { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const handleAccountsChanged = async () => {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const caccount = ethers.getAddress(accounts[0]);
            setAccount(caccount);
        };

        handleAccountsChanged();

        // Set up event listener for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);

        // Clean up event listener on unmount
        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        };
    }, []);

    return (
        <AccountContext.Provider value={{ account, setAccount }}>
            {children}
        </AccountContext.Provider>
    );
};
