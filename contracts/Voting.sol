// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.28;

contract Voting{
    struct Condidate{
        string name;
        uint voteCount;
    }

    mapping (uint => Condidate) public condidates;
    mapping (address => bool) public hasVoted;
    uint public numberOfCondidates;
    address public owner;

    modifier onlyOwner(){
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }
    
     
    constructor() {
        owner = msg.sender;
    }
      
    function addCondidate(string memory _name) public onlyOwner{
           condidates[numberOfCondidates] = Condidate(_name, 0);
           numberOfCondidates++;
    }

    function vote(uint _condidateId) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(_condidateId < numberOfCondidates, "Invalid condidate id");
        hasVoted[msg.sender] = true;
        condidates[_condidateId].voteCount++;
    }
}