import { createContext, useContext, useEffect, useState } from "react";
import {ethers} from 'ethers';
import VoteEventProcessor from '../abis/VoteEventProcessor.json';
import config from '../config.json';
import { AccountContext } from "./AccountContext";
const VoteEventProcessorContext = createContext(null);

export const useVoteEventProcessorContext = () =>
{
    return useContext(VoteEventProcessorContext);
}

export const VoteEventProcessorProvider = ({children}) => 
{
    const { account } = useContext(AccountContext);
    const [contract, setContract] = useState(null);

    const initialiseContract = async () => 
    {
        if (!window.ethereum) {
            console.error('Ethereum provider not found.');
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const voteEventProcessorAddress = config[Number(network.chainId)]?.voteEventProcessor?.address;

        if (!voteEventProcessorAddress) {
            console.error('Vote Event Processor address not found for the current network.');
            return;
        }

        try {
            const voteEventProcessorContract = new ethers.Contract(voteEventProcessorAddress, VoteEventProcessor, signer);
            setContract(voteEventProcessorContract);
        } catch (error) {
            console.error('Failed to create contract instance:', error);
        }
    };

    const getVoteShortInfo = async (voteEventId) =>
    {
        if(!contract) return null;
        const shortInfo = await contract.getVoteShortInfo(voteEventId);
        return shortInfo;
    }

    const getVotesShortInfo = async (status) =>
    {
        if(!contract) return [];
        const shortInfo = await contract.getVotesShortInfo(status);
        return shortInfo;
    }
    
    const getEventCandidates = async (voteEventId) =>
    {
        if(!contract) return null;
        const shortInfo = await contract.getEventCandidates(voteEventId);
        return shortInfo;
    }

    const voteForCandidate = async (voteEventId, candidateId, fee) => 
    {
        if(!contract) return null;
        await contract.vote(voteEventId, candidateId, {value: fee});
    }

    const deactivateVoteEvent = async (voteEventId) =>
    {
        if(!contract) return null;
        const shortInfo = await contract.deactivateVoteEvent(voteEventId);
        return shortInfo;
    }

    const activateVoteEvent = async (voteEventId) =>
    {
        if(!contract) return null;
        const shortInfo = await contract.activateVoteEvent(voteEventId);
        return shortInfo;
    }
    
    const votesCount = async () =>
    {
        if(!contract) return null;
        let voteCounts = await contract.getVotesCount();
        return voteCounts;
    }

    const getCandidateVotes = async (voteEventId, candidateId) => 
    {
        if(!contract) return;
        let candidateVotes = await contract.getCandidateVotes(voteEventId, candidateId);
        return candidateVotes;
    }
    useEffect(() => 
    {
        initialiseContract();
    }, [account])

    return (
        <VoteEventProcessorContext.Provider value={{getVoteShortInfo,getVotesShortInfo,votesCount,activateVoteEvent, deactivateVoteEvent, voteForCandidate, getEventCandidates, getCandidateVotes }}>
            {children}
        </VoteEventProcessorContext.Provider>
    );
}