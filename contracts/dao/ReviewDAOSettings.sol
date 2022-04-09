// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ReviewDAOSettings {
    event _RDTListingPriceModified(uint256 newPrice);
    event _ETHListingPriceModified(uint256 newPrice);
    event _RDTVotePriceModified(uint256 newPrice);
    event _ListingTimerModified(uint256 newTimer);
    event _ChallengeTimerModified(uint256 newTimer);
    event _RDTMembershipAmountModified(uint256 newAmount);
   
    IERC20 private _token;

    constructor(address token_){
        _token = IERC20(token_);
    }

    uint256 private listingPriceRDT = 10000;
    uint256 private listingPriceETH = 0.01 ether;
    uint256 private votePriceRDT = 1000;
    uint256 private listingTimer = 1209600;
    uint256 private challengeTimer = 1209600;
    uint256 private membershipAmountRDT = 10000;

    function getListingPriceRDT() public view returns(uint256){
        return listingPriceRDT;
    }

    function getListingPriceETH() public view returns(uint256){
        return listingPriceETH;
    }

    function getListingVotePriceRDT() public view returns(uint256){
        return votePriceRDT;
    }

    function getListingTimer() public view returns(uint256){
        return listingTimer;
    }

    function getChallengeTimer() public view returns(uint256){
        return challengeTimer;
    }

    function getMembershipAmountRDT() public view returns(uint256){
        return membershipAmountRDT;
    }

    function modify_listingPriceRDT(uint256 newPrice) external{
        listingPriceRDT = newPrice;
        emit _RDTListingPriceModified(newPrice);
    }

    function modify_listingPriceETH(uint256 newPrice) external{
        listingPriceETH = newPrice;
        emit _ETHListingPriceModified(newPrice);
    }

    function modify_votePriceRDT(uint256 newPrice) external{
        votePriceRDT = newPrice;
        emit _RDTVotePriceModified(newPrice);
    }

    function modify_listingTimer(uint256 newTimer) external{
        listingTimer = newTimer;
        emit _ListingTimerModified(newTimer);
    }

    function modify_challengeTimer(uint256 newTimer) external{
        challengeTimer = newTimer;
        emit _ChallengeTimerModified(newTimer);
    }

    function modify_membershipAmountRDT(uint256 newAmount) external{
        membershipAmountRDT = newAmount;
        emit _RDTMembershipAmountModified(newAmount);
    }
}
