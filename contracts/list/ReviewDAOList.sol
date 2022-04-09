pragma solidity ^0.8.0;

import "./extensions/IReviewDAOListMetadata.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../dao/ReviewDAOSettings.sol";
import "../dao/ReviewDAO.sol";
import "../polls/ReviewDAOPolls.sol";

contract ReviewDAOList is IReviewDAOListMetadata, ReviewDAOPolls {
    string private _name;
    string private _baseUri;
    address private _creator;

    IERC20 private _token;
    address private _ReviewDAO;
    ReviewDAOSettings private _settings;

    constructor(
        string memory name_, 
        string memory baseUri_, 
        address creator_, 
        address token_, 
        address ReviewDAO_, 
        address ReviewDAOSettings_
        ){
        _name = name_;
        _baseUri = baseUri_;
        _creator = creator_;
        _token = IERC20(token_);
        _ReviewDAO = ReviewDAO_;
        _settings = ReviewDAOSettings(ReviewDAOSettings_);
    }

    struct Listing {
        string name;
        bool whitelisted;
        string baseUri;
        address creator;
        uint256 stake;
        uint256 timer;
        uint256 challengeId;
        bool challenged;
        uint256 statusId;
    }

    struct Challenge {
        //uint256 votersCount;
        uint256 rewardPool;
        uint256 stake;
        //uint256 voteStake;
        uint256 votePrice;
        uint256 timer;
        address challenger;
        mapping(address => bool) accountVoted;
        mapping(address => bool) positiveNegativeVote;
        mapping(address => bool) claimedReward;
    }  

    struct ListingStatus {
        uint256 votes;
        mapping(address => bool) accountVoted;
    }

    struct Voter {
        uint256[] votedChallenges;
    }

    //hash32 ID from name
    //bytes32[] listingIds;
    mapping(bytes32 => Listing) public listings;
    mapping(bytes32 => bool) public nameRegistered;

    //map unique IDs for each challenge
    mapping(uint256 => Challenge) public challenges;
    mapping(uint256 => Poll) public polls;
    uint256 challengeIds = 1;

    //once element is whitelisted, map them to status of their upvotes/downvotes
    mapping(uint256 => ListingStatus) statuses;
    uint256 statusesIds = 1;

    //map voters for prices withdrawals
    mapping(address => Voter) voters;

    modifier ensureMemberOfDAO {
        address owner = msg.sender;
        require(_token.balanceOf(owner) >= _settings.getMembershipAmountRDT(), "You do not own enough RDT to be allowed to proceed.");
        _;
    }

    modifier processRDTPayment(uint256 cost_){
        _;
        address owner = msg.sender;
        require(_token.allowance(owner, address(this)) >= cost_, "Allowance too low.");
        bool sent = _token.transferFrom(owner, address(this), cost_);
        require(sent, "Token transfer failed");
    }

    function applyListing(bytes32 listingId_, string memory name_, string memory baseUri_) 
        external 
        payable 
        processRDTPayment(_settings.getListingPriceRDT())
    {
        require(!nameRegistered[listingId_], "This listing already exists.");
        require(msg.value == _settings.getListingPriceETH(), "Incorrect ETH sent.");
        Listing memory listing = Listing({
            name: name_, 
            whitelisted: false, 
            baseUri: baseUri_, 
            creator: msg.sender, 
            stake: _settings.getListingPriceRDT(), 
            timer: block.timestamp + _settings.getListingTimer(), 
            challengeId: 0,
            challenged: false,
            statusId: 0
        });
        listings[listingId_] = listing;
        payable(_ReviewDAO).transfer(msg.value);
        nameRegistered[listingId_] = true;
    } 

    function challengeListing(bytes32 listingId_) 
        external 
        ensureMemberOfDAO
        processRDTPayment(listings[listingId_].stake)
    {
        require(!listings[listingId_].challenged, "This listing is already challenged.");
        require(!listings[listingId_].whitelisted, "This listing is whitelisted.");
        uint256 stake = listings[listingId_].stake;
        listings[listingId_].challenged = true;
        listings[listingId_].stake = 0;
        listings[listingId_].challengeId = challengeIds;
        challenges[challengeIds].rewardPool = stake;
        challenges[challengeIds].stake = stake;
        challenges[challengeIds].votePrice = _settings.getListingVotePriceRDT();
        challenges[challengeIds].timer = block.timestamp + _settings.getChallengeTimer();
        challenges[challengeIds].challenger = msg.sender;
        polls[challengeIds].active = true;    
        ++challengeIds;
    }

    function votePositiveChallenge(bytes32 listingId_) 
        external 
        processRDTPayment(challenges[listings[listingId_].challengeId].votePrice)
    {
        uint256 id = listings[listingId_].challengeId;
        require(challenges[id].timer > block.timestamp, "Challenge is over.");
        require(!challenges[id].accountVoted[msg.sender], "You already voted in this challenge.");
        ++polls[id].votesFor;
        challenges[id].positiveNegativeVote[msg.sender] = true;
        voters[msg.sender].votedChallenges.push(id);
    }

    function voteNegativeChallenge(bytes32 listingId_) 
        external
        processRDTPayment(challenges[listings[listingId_].challengeId].votePrice)
    {
        uint256 id = listings[listingId_].challengeId;
        require(challenges[id].timer > block.timestamp, "Challenge is over.");
        require(!challenges[id].accountVoted[msg.sender], "You already voted in this challenge.");
        ++polls[id].votesAgainst;
        voters[msg.sender].votedChallenges.push(id);
    }

    function upvoteListing(bytes32 listingId_) external ensureMemberOfDAO {
        require(listings[listingId_].whitelisted, "This is not a whitelisted subject.");
        uint256 id = listings[listingId_].statusId;
        require(!statuses[id].accountVoted[msg.sender], "You already voted for this listing.");
        ++statuses[id].votes;
        statuses[id].accountVoted[msg.sender] = true;
    }

    function downvoteListing(bytes32 listingId_) external ensureMemberOfDAO {
        require(listings[listingId_].whitelisted, "This is not a whitelisted subject.");
        uint256 id = listings[listingId_].statusId;
        require(!statuses[id].accountVoted[msg.sender], "You already voted for this listing.");
        --statuses[id].votes;
        statuses[id].accountVoted[msg.sender] = true;
    }

    function resolveChallengeResult(bytes32 listingId_) external {
        uint256 id = listings[listingId_].challengeId;
        require(polls[id].active, "Not an active challenge.");
        require(challenges[id].timer <= block.timestamp, "Challenge not yet finished.");
        //... todo
    }

    function resolveListingPeriod(bytes32 listingId_) external {
        Listing memory listing = listings[listingId_];
        require(listing.timer <= block.timestamp, "Cannot register yet.");
        require(!listing.challenged, "Cannot register yet.");
        // ... todo
    }

    //function claimRewards()

    //dont forget to remove all these challenges which they withdraw
    function getRewardBalance() public view returns(uint256) {
        uint256 rewardBalance = 0;
        for(uint i = voters[msg.sender].votedChallenges.length; i > 0; i--){
            uint256 j = voters[msg.sender].votedChallenges[i];
            rewardBalance += challenges[j].votePrice;

            if(challenges[j].accountVoted[msg.sender] 
                && !challenges[j].claimedReward[msg.sender] 
                && challenges[j].positiveNegativeVote[msg.sender] 
                && polls[j].votesFor >= polls[j].votesAgainst
            ){
                rewardBalance += challenges[j].rewardPool / polls[j].votesFor;
            }
            else if(challenges[j].accountVoted[msg.sender]
                && !challenges[j].claimedReward[msg.sender]
                && !challenges[j].positiveNegativeVote[msg.sender] 
                && polls[j].votesAgainst > polls[j].votesFor
            ){
                rewardBalance += challenges[j].rewardPool / polls[j].votesAgainst * 80 / 100; //20% goes to the challenger for his bravery
            }

            challenges
        }
    }

    function banishListing(bytes32 listingId_) external {
	//todo
    }



    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function baseUri() public view virtual override returns (string memory) {
        return _baseUri;
    }

    function creator() public view virtual override returns (address) {
        return _creator;
    }
    
    //todo
}
