// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IReviewDAOSettings.sol";

contract ReviewDAOSettings is IReviewDAOSettings {
    event _RDTListingPriceModified(uint256 newPrice);
    event _ETHListingPriceModified(uint256 newPrice);
    event _RDTListingChallengeRewardModified(uint256 newPrice);
    event _RDTVotePriceModified(uint256 newPrice);
    event _ListingTimerModified(uint256 newTimer);
    event _ChallengeTimerModified(uint256 newTimer);
    event _RDTMembershipAmountModified(uint256 newAmount);
    event _BanishListingLimitModified(int256 newAmount);

    uint256 private listingPriceRDT = 10000;
    uint256 private listingPriceETH = 0.01 ether;
    uint256 private listingChallengeRewardRDT = 20000;
    uint256 private votePriceRDT = 1000;
    uint256 private listingTimer = 1209600;
    uint256 private challengeTimer = 1209600;
    uint256 private membershipAmountRDT = 10000;
    int256 private banishListingLimit = -100;

    function getListingPriceRDT() public view virtual override returns(uint256){
        return listingPriceRDT;
    }

    function getListingChallengeRewardRDT() public view virtual override returns(uint256){
        return listingChallengeRewardRDT;
    }

    function getListingPriceETH() public view virtual override returns(uint256){
        return listingPriceETH;
    }

    function getListingVotePriceRDT() public view virtual override returns(uint256){
        return votePriceRDT;
    }

    function getListingTimer() public view virtual override returns(uint256){
        return listingTimer;
    }

    function getChallengeTimer() public view virtual override returns(uint256){
        return challengeTimer;
    }

    function getMembershipAmountRDT() public view virtual override returns(uint256){
        return membershipAmountRDT;
    }

    function getBanishListingLimit() public view virtual override returns(int256){
        return banishListingLimit;
    }

    function modify_listingPriceRDT(uint256 newPrice_) internal{
        listingPriceRDT = newPrice_;
        emit _RDTListingPriceModified(newPrice_);
    }

    function modify_listingChallengeRewardRDT(uint256 newPrice_) internal{
        require(newPrice_ > listingPriceRDT);
        listingChallengeRewardRDT = newPrice_;
        emit _RDTListingChallengeRewardModified(newPrice_);
    }

    function modify_listingPriceETH(uint256 newPrice_) internal{
        listingPriceETH = newPrice_;
        emit _ETHListingPriceModified(newPrice_);
    }

    function modify_votePriceRDT(uint256 newPrice_) internal{
        votePriceRDT = newPrice_;
        emit _RDTVotePriceModified(newPrice_);
    }

    function modify_listingTimer(uint256 newTimer_) internal{
        listingTimer = newTimer_;
        emit _ListingTimerModified(newTimer_);
    }

    function modify_challengeTimer(uint256 newTimer_) internal{
        challengeTimer = newTimer_;
        emit _ChallengeTimerModified(newTimer_);
    }

    function modify_membershipAmountRDT(uint256 newAmount_) internal{
        membershipAmountRDT = newAmount_;
        emit _RDTMembershipAmountModified(newAmount_);
    }

    function modify_banishListingLimit(int256 newAmount_) internal{
        banishListingLimit = newAmount_;
        emit _BanishListingLimitModified(newAmount_);
    }
}
