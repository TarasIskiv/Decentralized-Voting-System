// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.26;

import "./Vote.sol";
import "./BaseAccessControl.sol";
enum VoteEventStatus {
    Active,
    Deactivated
}

struct VoteEventDetail {
    uint256 id;
    VoteEventStatus status;
    uint256 totalVotes;
    uint256 voteFee;
    mapping(uint256 => uint256) candidateVotes; // Nested mapping inside the struct
}

contract VoteEventProcessor is BaseAccessControl
{
    mapping(uint256 => VoteEventDetail) private voteEventDetails;

    Vote private voteContract;

    constructor(address voteContractAddress) BaseAccessControl(msg.sender)
    {
        voteContract = Vote(voteContractAddress);
    }

    receive() external payable {}
    fallback() external payable {}

    modifier isDeactivated(uint256 _eventId) {
        require(voteEventDetails[_eventId].status == VoteEventStatus.Deactivated, "You can't remove active event");
        _;
    }

    function addNewEvent(string memory _tokenURI) onlyPersonWithAccess(msg.sender) public 
    {
        uint256 tokenId = voteContract.createVoteEvent(msg.sender, _tokenURI);

        VoteEventDetail storage voteEvent = voteEventDetails[tokenId];
        voteEvent.id = tokenId;
        voteEvent.status = VoteEventStatus.Active;
        voteEvent.totalVotes = 0;
        voteEvent.voteFee = 1000000000000000 wei;
    }

    function removeEvent(uint256 _tokenId) onlyAdmin(msg.sender) public isDeactivated(_tokenId) 
    {
        voteContract.removeVoteEvent(msg.sender, _tokenId);
        delete voteEventDetails[_tokenId];
    }

    function vote(uint256 _eventId, uint256 _candidateId) onlyUser(msg.sender) public payable {
        VoteEventDetail storage selectedEvent = voteEventDetails[_eventId];
        require(selectedEvent.status == VoteEventStatus.Active, "Event is no longer active");
        require(msg.sender.balance >= selectedEvent.voteFee, "You don't have enough money to vote");

        require(selectedEvent.candidateVotes[_candidateId] >= 0, "Candidate doesn't take part in the event");

        selectedEvent.candidateVotes[_candidateId]++;
        selectedEvent.totalVotes++;
    }

    function addCandidate(uint256 _eventId, uint256 _candidateId) onlyPersonWithAccess(msg.sender) public {
        VoteEventDetail storage voteEvent = voteEventDetails[_eventId];
        voteEvent.candidateVotes[_candidateId] = 0;
    }

    function getCandidateVotes(uint256 _eventId, uint256 _candidateId) public view returns (uint256) {
        return voteEventDetails[_eventId].candidateVotes[_candidateId];
    }

    function getTotalVotes(uint256 _eventId) public view returns (uint256) {
        return voteEventDetails[_eventId].totalVotes;
    }

    function deactivateVoteEvent(uint _eventId) onlyModerator(msg.sender) public
    {
        voteEventDetails[_eventId].status = VoteEventStatus.Deactivated;
    }

    function getEventId(uint256 _eventId) public view returns(uint256)
    {
        return voteEventDetails[_eventId].id;
    }

    function getEventStatus(uint256 _eventId) public view returns(VoteEventStatus)
    {
        return voteEventDetails[_eventId].status;
    }
}
