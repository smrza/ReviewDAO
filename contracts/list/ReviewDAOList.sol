// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./extensions/IReviewDAOListMetadata.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../dao/ReviewDAOSettings.sol";

contract ReviewDAOList is IReviewDAOListMetadata, ReentrancyGuard{
    event _Application(bytes32 indexed hash, address indexed applicant);
    event _ResolveListing(bytes32 indexed hash, bool whitelisted, address resolver);
    event _Withdrawal(address indexed sender, uint256 timestamp, uint256 amount);
    event _ListingModified(
        bytes32 indexed hash, 
        string name, 
        bool whitelisted, 
        string baseUri, 
        address indexed creator, 
        uint256 stake, 
        uint256 challengerReward, 
        uint256 timer, 
        uint256 challengeId, 
        bool challenged, 
        uint256 statusId
    );
    event _ChallengeModified(uint256 indexed id, uint256 challengerReward, uint256 listingStake, uint256 challengerStake, uint256 votePrice, uint256 timer, address indexed challenger);
    event _Banished(address indexed sender, bytes32 indexed hash, uint256 downvotes);

    string private _name;
    string private _baseUri;
    address private _creator;

    IERC20 private _token;
    address private _ReviewDAO;
    IReviewDAOSettings private _settings;

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

    function test() public view returns (uint256){
        return _settings.getChallengeTimer();
    }

    struct Listing {
        string name;
        bool whitelisted;
        string baseUri;
        address creator;
        uint256 stake;
        uint256 challengerReward;
        uint256 timer;
        uint256 challengeId;
        bool challenged;
        uint256 statusId;
    }

    struct Challenge {
        uint256 challengerReward;
        uint256 listingStake;
        uint256 challengerStake;
        uint256 votePrice;
        uint256 timer;
        address challenger;
        mapping(address => bool) accountVoted;
        mapping(address => bool) positiveNegativeVote;
    }  

    struct ListingStatus {
        int256 votes;
        mapping(address => bool) accountVoted;
    }

    struct Voter {
        uint256[] votedChallenges;
    }

    struct Poll {
        uint256 votesFor;
        uint256 votesAgainst;
    }    

    //hash32 ID from name
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
        require(_token.transferFrom(owner, address(this), cost_),"Token transfer failed");
    }

    function applyListing(bytes32 listingId_, string memory name_, string memory baseUri_) 
        external 
        payable 
        processRDTPayment(_settings.getListingPriceRDT() + _settings.getListingChallengeRewardRDT())
    {
        require(!nameRegistered[listingId_], "This listing already exists.");
        require(msg.value == _settings.getListingPriceETH(), "Incorrect ETH sent.");

        uint256 listingPriceRDT = _settings.getListingPriceRDT();
        uint256 challengerPrice = _settings.getListingChallengeRewardRDT();
        uint256 timeLeft = block.timestamp + _settings.getListingTimer();
        Listing memory listing = Listing({
            name: name_, 
            whitelisted: false, 
            baseUri: baseUri_, 
            creator: msg.sender, 
            stake: listingPriceRDT, 
            challengerReward: challengerPrice,
            timer: timeLeft, 
            challengeId: 0,
            challenged: false,
            statusId: 0
        });
        listings[listingId_] = listing;
        payable(_ReviewDAO).transfer(msg.value);
        nameRegistered[listingId_] = true;
        emit _Application(listingId_, msg.sender);
        emit _ListingModified(listingId_, name_, false, baseUri_, msg.sender, listingPriceRDT, challengerPrice, timeLeft, 0, false, 0);
    } 

    function challengeListing(bytes32 listingId_) 
        external 
        ensureMemberOfDAO
        processRDTPayment(listings[listingId_].stake)
    {
        require(!listings[listingId_].challenged, "This listing is already challenged.");
        require(!listings[listingId_].whitelisted, "This listing is whitelisted.");
        require(listings[listingId_].timer >= block.timestamp, "Registration period is over.");
        
        uint256 stake = listings[listingId_].stake;
        uint256 reward = listings[listingId_].challengerReward;
        listings[listingId_].challenged = true;
        listings[listingId_].stake = 0;
        listings[listingId_].challengerReward = 0;
        listings[listingId_].challengeId = challengeIds;

        emit _ListingModified(
            listingId_, 
            listings[listingId_].name, 
            false, 
            listings[listingId_].baseUri, 
            listings[listingId_].creator, 
            0, 
            0, 
            listings[listingId_].timer, 
            challengeIds, 
            true, 
            0
        );

        uint256 votePrice = _settings.getListingVotePriceRDT();
        uint256 timeLeft = block.timestamp + _settings.getChallengeTimer();
        challenges[challengeIds].challengerReward = reward;
        challenges[challengeIds].listingStake = stake;
        challenges[challengeIds].challengerStake = stake;
        challenges[challengeIds].votePrice = votePrice;
        challenges[challengeIds].timer = timeLeft;
        challenges[challengeIds].challenger = msg.sender;

        emit _ChallengeModified(challengeIds, reward, stake, stake, votePrice, timeLeft, msg.sender);
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
        challenges[id].accountVoted[msg.sender] = true;
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
        challenges[id].accountVoted[msg.sender] = true;
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

    function resolveListing(bytes32 listingId_) external nonReentrant {
        Listing storage listing = listings[listingId_];
        require(!listing.whitelisted, "Listing is whitelisted.");
        //listing is not challenged and registration period is over
        bool result;
        if(
            listing.timer < block.timestamp
            && !listing.challenged
        ){
            listing.whitelisted = true;
            require(
                _token.transfer(listing.creator, listing.challengerReward)
                , "Transfer failed."
            );
            require(
                _token.transfer(_ReviewDAO, listing.stake)
                , "Transfer failed."
            );
            listing.stake = 0;
            listing.challengerReward = 0;
            listing.statusId = statusesIds;
            ++statusesIds;
            result = true;
        }
        //listing is challenged
        else if(
            listing.challenged
        ){
            if(
                challenges[listing.challengeId].timer < block.timestamp
            ){
                Poll memory poll = polls[listing.challengeId];
                //listing won
                //in an unlikely case of challenge ending in draw, the benefit goes to the subject
                if(
                    poll.votesFor >= poll.votesAgainst
                ){
                    listing.whitelisted = true;
                    require(
                        _token.transfer(listing.creator, challenges[listing.challengeId].challengerReward)
                        , "Transfer failed."
                    );
                    require(
                        _token.transfer(_ReviewDAO, challenges[listing.challengeId].listingStake)
                        , "Transfer failed."
                    );
                    listing.statusId = statusesIds;
                    ++statusesIds;
                    uint256 additional = challenges[listing.challengeId].challengerStake % poll.votesFor;
                    require(
                        _token.transfer(_ReviewDAO, additional)
                        , "Transfer failed."
                    );
                    result = true;
                }
                //listing lost
                else if(
                    poll.votesAgainst > poll.votesFor
                ){
                    require(
                        _token.transfer(challenges[listing.challengeId].challenger, challenges[listing.challengeId].challengerReward)
                        , "Transfer failed."
                    );
                    require(
                        _token.transfer(_ReviewDAO, challenges[listing.challengeId].challengerStake)
                        , "Transfer failed."
                    );
                    nameRegistered[listingId_] = false;
                    uint256 additional = challenges[listing.challengeId].listingStake % poll.votesAgainst;
                    require(
                        _token.transfer(_ReviewDAO, additional)
                        , "Transfer failed."
                    );
                    result = false;
                }
            }
        }
        emit _ResolveListing(listingId_, result, msg.sender);
    }

    function claimRewards() external nonReentrant {
        uint256 reward = getRewardBalance();
        require(_token.transfer(msg.sender, reward), "Transfer failed.");
        uint256 counter = 0;
        uint256 length = 0;
        for(uint i = voters[msg.sender].votedChallenges.length; i > 0; i--){
            uint256 j = voters[msg.sender].votedChallenges[i-1];
            if(challenges[j].timer >= block.timestamp){
                ++length;
            }
        }
        uint256[] memory tmp = new uint256[](length);
        for(uint i = voters[msg.sender].votedChallenges.length; i > 0; i--){
            uint256 j = voters[msg.sender].votedChallenges[i-1];
            if(challenges[j].timer >= block.timestamp){
                tmp[counter] = j;
                ++counter;
            }
            voters[msg.sender].votedChallenges.pop();
        }
        require(voters[msg.sender].votedChallenges.length == 0, "Failed to claim rewards.");
        voters[msg.sender].votedChallenges = tmp;
        emit _Withdrawal(msg.sender, block.timestamp, reward);
    }

    function getRewardBalance() public view returns(uint256) {
        uint256 rewardBalance = 0;
        for(uint i = voters[msg.sender].votedChallenges.length; i > 0; i--){
            uint256 j = voters[msg.sender].votedChallenges[i-1];
            if(
                challenges[j].timer < block.timestamp
            ){
                rewardBalance += challenges[j].votePrice;
                
                if(challenges[j].accountVoted[msg.sender] 
                    && challenges[j].positiveNegativeVote[msg.sender] 
                    && polls[j].votesFor >= polls[j].votesAgainst
                ){
                    rewardBalance += challenges[j].challengerStake / polls[j].votesFor;
                }
                else if(challenges[j].accountVoted[msg.sender]
                    && !challenges[j].positiveNegativeVote[msg.sender] 
                    && polls[j].votesAgainst > polls[j].votesFor
                ){
                    rewardBalance += challenges[j].listingStake / polls[j].votesAgainst;
                }
            }
        }
        return rewardBalance;
    }

    function banishListing(bytes32 listingId_) external {
        require(statuses[listings[listingId_].statusId].votes < _settings.getBanishListingLimit());
        delete listings[listingId_].whitelisted;
        delete nameRegistered[listingId_];
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
}
