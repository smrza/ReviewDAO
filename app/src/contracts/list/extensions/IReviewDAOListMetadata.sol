// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IReviewDAOListMetadata {
    function name() external view returns (string memory);
    function baseUri() external view returns (string memory);
    function creator() external view returns (address);
}
