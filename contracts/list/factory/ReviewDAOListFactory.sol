// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../ReviewDAOList.sol";
import "./IReviewDAOListFactory.sol";

contract ReviewDAOListFactory is IReviewDAOListFactory {
    event _NewList(address indexed newList, bytes32 indexed hash, string name, string baseUri);
    
    ReviewDAOList[] private _lists;
    mapping(bytes32 => uint256) _listsIds;

    function createList(
        bytes32 nameHash_,
        string memory name_,
        string memory baseUri_,
        address creator_,
        address token_,
        address ReviewDAO_
    ) external virtual override {
        ReviewDAOList list = new ReviewDAOList(
            name_,
            baseUri_,
            creator_,
            token_,
            ReviewDAO_
        );
        _lists.push(list);
        _listsIds[nameHash_] = _lists.length - 1;
        emit _NewList(address(list), nameHash_, name_, baseUri_);
    }

    function allLists()
        public
        view
        returns (ReviewDAOList[] memory)
    {
        return _lists;
    }

    function getList(bytes32 nameHash_) public view returns(ReviewDAOList){
        uint256 index = _listsIds[nameHash_];
        return _lists[index];
    }

    function getListAddress(bytes32 nameHash_) external view virtual override returns(address){
        uint256 index = _listsIds[nameHash_];
        return address(_lists[index]);
    }
}
