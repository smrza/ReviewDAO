// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IReviewDAOListFactory {

    function createList(
        bytes32 nameHash_,
        string memory name_,
        string memory baseUri_,
        address creator_,
        address token_,
        address ReviewDAO_,
        address ReviewDAOSettings_
    ) external; 
    
    function getListAddress(bytes32 nameHash_) external view returns(address);
}
