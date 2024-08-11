import {ethers} from 'ethers';
import BaseAccessControl from '../abis/BaseAccessControl.json';
import config from '../config.json';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AccountContext } from './AccountContext';
const BaseAccessControlContext = createContext(null);

export const useBaseAccessControl = () =>
{
    return useContext(BaseAccessControlContext);
}

export const BaseAccessControlProvider = ({children}) => 
{
    const { account } = useContext(AccountContext);
    const [contract, setContract] = useState(null);
    const [canRemove, setCanRemove] = useState(false);
    const [canDeactivate, setCanDeactivate] = useState(false);

    const initialiseContract = async () => 
    {
        if (!window.ethereum) {
            console.error('Ethereum provider not found.');
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const baseAccessControlAddress = config[Number(network.chainId)]?.baseAccessControl?.address;

        if (!baseAccessControlAddress) {
            console.error('Base Access Control address not found for the current network.');
            return;
        }

        try {
            const baseAccessControlContract = new ethers.Contract(baseAccessControlAddress, BaseAccessControl, signer);
            setContract(baseAccessControlContract);
        } catch (error) {
            console.error('Failed to create contract instance:', error);
        }
    };

    const loadAccessRules = async () =>
    {
        if (!contract) return;

        try {
            console.log(account);
            const isAdmin = await contract.isAdmin();
            const isModerator = await contract.isModerator();
            setCanDeactivate(isModerator);
            setCanRemove(isAdmin);
        } catch (error) {
            console.error('Failed to load access rules:', error);
        }
    }

    useEffect(() => 
    {
        const loadContract = async () => 
        {
            await initialiseContract();
            await loadAccessRules();
        }

        loadContract();
    }, [account]);

    return (
        <BaseAccessControlContext.Provider value={{ canRemove, canDeactivate }}>
            {children}
        </BaseAccessControlContext.Provider>
    );
}