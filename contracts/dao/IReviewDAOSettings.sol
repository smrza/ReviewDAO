// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IReviewDAOSettings {
    function getListingPriceRDT() external view returns(uint256);

    function getListingChallengeRewardRDT() external view returns(uint256);

    function getListingPriceETH() external view returns(uint256);

    function getListingVotePriceRDT() external view returns(uint256);

    function getListingTimer() external view returns(uint256);

    function getChallengeTimer() external view returns(uint256);

    function getMembershipAmountRDT() external view returns(uint256);

    function getBanishListingLimit() external view returns(int256);
}
