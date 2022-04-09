// SPDX-License-Identifier: MIT

import "./ReviewDAOSettings.sol";
import "../list/factory/IReviewDAOListFactory.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

pragma solidity ^0.8.0;

contract ReviewDAO is ReviewDAOSettings {
    event _ProposalModified(bytes32 indexed hash, string name, string baseUri, address creator, uint256 votes);
    event _NewListCreated(bytes32 indexed hash, address list);

    IReviewDAOListFactory _factory;
    IERC721 _NFT;
    IERC20 _token;

    constructor(
        address factory_,
        address NFT_,
        address token_
    ){
        _factory = IReviewDAOListFactory(factory_);
        _NFT = IERC721(NFT_);
        _token = IERC20(token_);
        waitingPeriod = block.timestamp + 604800;
    }

    modifier onlyNFTOwner() {
        require(_NFT.balanceOf(msg.sender) > 0, "Not an owner");
        _;
    }

    modifier ensureMemberOfDAO {
        address owner = msg.sender;
        require(_token.balanceOf(owner) >= getMembershipAmountRDT(), "You do not own enough RDT to proceed.");
        _;
    }

    struct ListProposal{
        string name;
        string baseUri;
        address creator;
        uint256 votes;
    }

    bytes32[] hashes;
    mapping(bytes32 => ListProposal) listProposals;
    mapping(bytes32 => bool) listProposed;
    mapping(address => uint256) recentProposal;

    mapping(address => mapping(bytes32 => bool)) voted;

    uint256 waitingPeriod;

    function proposeNewList(bytes32 hash_, string calldata name_, string calldata baseUri_) external onlyNFTOwner {
        require(!listProposed[hash_], "List already proposed.");
        require(recentProposal[msg.sender] < block.timestamp);
        listProposals[hash_].name = name_;
        listProposals[hash_].baseUri = baseUri_;
        listProposals[hash_].creator = msg.sender;
        listProposed[hash_] = true;
        hashes.push(hash_);
        //improve
        recentProposal[msg.sender] = block.timestamp + 604800;
        emit _ProposalModified(hash_, name_, baseUri_, msg.sender, 0);
    }

    function voteForProposal(bytes32 hash_) external onlyNFTOwner ensureMemberOfDAO {
        require(listProposed[hash_], "List does not exist.");
        require(!voted[msg.sender][hash_], "You already voted for this proposal.");
        ++listProposals[hash_].votes;
        emit _ProposalModified(hash_, listProposals[hash_].name, listProposals[hash_].baseUri, listProposals[hash_].creator, listProposals[hash_].votes);
    }

    function createNewList() external {
        require(waitingPeriod < block.timestamp, "Waiting period not yet over.");
        ListProposal memory proposal = listProposals[hashes[0]];
        bytes32 hash = hashes[0];
        uint256 index;
        for(uint i = 0; i < hashes.length; i++){
            if(listProposals[hashes[i]].votes > proposal.votes){
                proposal = listProposals[hashes[i]];
                hash = hashes[i];
                index = i;
            }
        }
        _factory.createList(
            hash, 
            proposal.name,
            proposal.baseUri,
            proposal.creator,
            address(_token),
            address(this)
        );
        waitingPeriod = block.timestamp + 604800;
        delete hashes[index];
        require(
            _token.transfer(proposal.creator, getNewListCreationReward())
            , "Transfer failed."
        );
        emit _NewListCreated(hash, _factory.getListAddress(hash));
    }


    //////////
    //TESTING below
    //////////

    bool testCalled = false;

    function generateListsForTestingPurposes(
        bytes32 hash_, 
        bytes32 hash2_, 
        string memory name_,
        string memory name2_,
        string memory baseUri_,
        string memory baseUri2_
    ) external {
        require(!testCalled, "Stop.");
        listProposed[hash_] = true;
        listProposed[hash2_] = true;

        _factory.createList(
            hash_, 
            name_,
            baseUri_,
            msg.sender,
            address(_token),
            address(this)
        );

        _factory.createList(
            hash2_, 
            name2_,
            baseUri2_,
            msg.sender,
            address(_token),
            address(this)
        );

        testCalled = true;
    }

    //NFT rewards (contract gets 100 NFTs)
    //improvements - make proposals to change settings values
    //banish list option (+ downvote, upvote)
}
