import { useState, useContext, createContext, useEffect } from "react";
import { AccountContext } from "./AccountContext";
import { ethers } from 'ethers';
import config from '../config.json';
import Candidate from '../abis/Candidate.json';

const CandidateContext = createContext(null);

export const useCandidateContext = () => {
    const context = useContext(CandidateContext);
    if (context === null) {
        throw new Error('useCandidateContext must be used within a CandidateProvider');
    }
    return context;
}

export const CandidateProvider = ({ children }) => {
    const {account} = useContext(AccountContext);
    const [contract, setContract] = useState(null);

    const initialiseContract = async () => {
        if (!window.ethereum) {
            console.error('Ethereum provider not found.');
            return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const candidateAddress = config[Number(network.chainId)]?.candidate?.address;

        if (!candidateAddress) {
            console.error('Candidate address not found for the current network.');
            return;
        }

        try {
            const candidateContract = new ethers.Contract(candidateAddress, Candidate, signer);
            setContract(candidateContract);
        } catch (error) {
            console.error('Failed to create contract instance:', error);
        }
    };

    const getCandidateTokenURI = async (candidateId) => {
        if (!contract) return "";
        try {
            const tokenURI = await contract.tokenURI(candidateId);
            return tokenURI;
        } catch (error) {
            console.error('Failed to fetch token URI:', error);
            return "";
        }
    };

    const getCandidates = async () => 
    {
        if (!contract) return [];

        let candidates = await contract.getCandidates();
        return candidates;
    }

    const removeCandidate = async (candidateId) =>
    {
        if (!contract) return;
        await contract.removeCandidate(candidateId);
    }

    const mint = async (url) =>
    {
        if (!contract) return;
        await contract.registerCandidate(url);
    }

    useEffect(() => {
        initialiseContract();
    }, [account]);

    return (
        <CandidateContext.Provider value={{ getCandidateTokenURI, removeCandidate, getCandidates, mint }}>
            {children}
        </CandidateContext.Provider>
    );
};
