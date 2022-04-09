// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ReviewDAOPolls {
    struct Poll {
        bool active;
        uint256 votesFor;
        uint256 votesAgainst;
    }    
    
    function upvote(Poll memory poll_) internal pure returns(Poll memory){
        require(poll_.active, "This is not an active poll.");
        ++poll_.votesFor;
        return poll_;
    }

    function downvote(Poll memory poll_) internal pure returns(Poll memory){
        require(poll_.active, "This is not an active poll.");
        --poll_.votesAgainst;
        return poll_;
    }

    function closePoll(Poll memory poll_) internal pure returns(Poll memory){
        poll_.active = false;
        return poll_;
    }

    function openPoll(Poll memory poll_) internal pure returns(Poll memory){
        poll_.active = true;
        return poll_;
    }

    function getPollResult(Poll memory poll_) internal pure returns(bool){
        if(poll_.votesFor >= poll_.votesAgainst) return true;
        else return false;
    }

    function getVotesFor(Poll memory poll_) internal pure returns(uint256){
        return poll_.votesFor;
    }

    function getVotesAgainst(Poll memory poll_) internal pure returns(uint256){
        return poll_.votesAgainst;
    }

    function getPollStatus(Poll memory poll_) internal pure returns(bool){
        return poll_.active;
    }
}
