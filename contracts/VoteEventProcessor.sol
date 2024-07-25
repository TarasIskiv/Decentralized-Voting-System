// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.26;

import "./Vote.sol";

enum VoteEventStatus {
    Active,
    Deactivated
}

struct VoteEventDetail {
    uint256 id;
    bool isActive;
    uint256 totalVotes;
    uint256 voteFee;
    mapping(uint256 => uint256) candidateVotes; // Nested mapping inside the struct
}

contract VoteEventProcessor {
    mapping(uint256 => VoteEventDetail) private voteEventDetails;

    Vote private voteContract;

    constructor(address voteContractAddress) 
    {
        voteContract = Vote(voteContractAddress);
    }

    receive() external payable {}

    modifier isDeactivated(uint256 _eventId) {
        require(!voteEventDetails[_eventId].isActive, "You can't remove active event");
        _;
    }

    function addNewEvent(string memory _tokenURI) public 
    {
        uint256 tokenId = voteContract.createVoteEvent(_tokenURI);

        VoteEventDetail storage voteEvent = voteEventDetails[tokenId];
        voteEvent.id = tokenId;
        voteEvent.isActive = true;
        voteEvent.totalVotes = 0;
        voteEvent.voteFee = 1000000 gwei;
    }

    function removeEvent(uint256 _tokenId) public isDeactivated(_tokenId) 
    {
        voteContract.removeVoteEvent(_tokenId);
        delete voteEventDetails[_tokenId];
    }

    function vote(uint256 _eventId, uint256 _candidateId) public {
        VoteEventDetail storage selectedEvent = voteEventDetails[_eventId];
        require(selectedEvent.isActive, "Event is no longer active");
        require(msg.sender.balance >= selectedEvent.voteFee, "You don't have enough money to vote");

        require(selectedEvent.candidateVotes[_candidateId] >= 0, "Candidate doesn't take part in the event");

        payable(msg.sender).transfer(selectedEvent.voteFee);

        selectedEvent.candidateVotes[_candidateId]++;
        selectedEvent.totalVotes++;
    }

    function addCandidate(uint256 _eventId, uint256 _candidateId) public {
        VoteEventDetail storage voteEvent = voteEventDetails[_eventId];
        voteEvent.candidateVotes[_candidateId] = 0;
    }

    function getCandidateVotes(uint256 _eventId, uint256 _candidateId) public view returns (uint256) {
        return voteEventDetails[_eventId].candidateVotes[_candidateId];
    }

    function getTotalVotes(uint256 _eventId) public view returns (uint256) {
        return voteEventDetails[_eventId].totalVotes;
    }

    function deactivateVoteEvent(uint _eventId) public
    {
        voteEventDetails[_eventId].isActive = false;
    }
}
