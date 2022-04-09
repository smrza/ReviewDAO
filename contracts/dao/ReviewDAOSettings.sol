// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IReviewDAOSettings.sol";

contract ReviewDAOSettings is IReviewDAOSettings {
    uint256 private listingPriceRDT = 10000;
    uint256 private votePriceRDT = 1000;
    //uint256 private listingTimer = 1209600;
    //uint256 private challengeTimer = 1209600;
    uint256 private listingTimer = 60; //one min for testing purposes
    uint256 private challengeTimer = 60; //one min for testing purposes
    uint256 private membershipAmountRDT = 10000;
    int256 private banishListingLimit = -100;
    uint256 private newListCreationReward = 1000000;

    function getListingPriceRDT() public view virtual override returns(uint256){
        return listingPriceRDT;
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

    function getNewListCreationReward() public view returns(uint256){
        return newListCreationReward;
    }

    function modify_listingPriceRDT(uint256 newPrice_) internal{
        listingPriceRDT = newPrice_;
    }

    function modify_votePriceRDT(uint256 newPrice_) internal{
        votePriceRDT = newPrice_;
    }

    function modify_listingTimer(uint256 newTimer_) internal{
        listingTimer = newTimer_;
    }

    function modify_challengeTimer(uint256 newTimer_) internal{
        challengeTimer = newTimer_;
    }

    function modify_membershipAmountRDT(uint256 newAmount_) internal{
        membershipAmountRDT = newAmount_;
    }

    function modify_banishListingLimit(int256 newAmount_) internal{
        banishListingLimit = newAmount_;
    }

    function modifiy_newListCreationReward(uint256 newAmount_) internal{
        newListCreationReward = newAmount_;
    }
}