// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ERC721A.sol";

contract RDNFT is Ownable, ERC721A, ReentrancyGuard {
  uint256 public constant maxMintAmountPerAddress = 10;
  uint64 public pubsalePrice = 0.1 ether;
  bool reviewDAOMinted = false;

  string private _baseTokenURI = "www.example.com";

  constructor() ERC721A("Reviewdaos", "RDNFT", 10, 10000) {}

  modifier callerIsUser() {
    require(tx.origin == msg.sender, "Caller is another contract");
    _;
  }

  function pubsaleMint(uint256 quantity) external payable callerIsUser{
    require(numberMinted(msg.sender) + quantity <= maxMintAmountPerAddress, "Minting too many");
    require(msg.value == pubsalePrice * quantity, "Incorrect ETH");
    require(totalSupply() + quantity <= collectionSize, "Sold out");
    _safeMint(msg.sender, quantity);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }

  function setBaseURI(string calldata baseURI) external onlyOwner {
    _baseTokenURI = baseURI;
  }

  function mintToReviewDAO(address reviewDAO) external onlyOwner {
    require(!reviewDAOMinted, "ReviewDAO has already minted its tokens");
    
    uint256 interations = 100 / maxBatchSize;
    for (uint256 i = 0; i < interations; i++) {
      _safeMint(reviewDAO, maxBatchSize);
    }
    reviewDAOMinted = true;
  }

  function withdrawToReviewDAO(address reviewDAO) external onlyOwner nonReentrant {
    uint balance = address(this).balance;
    payable(reviewDAO).transfer(balance);
  }

  function numberMinted(address owner) public view returns (uint256) {
    return _numberMinted(owner);
  }
}
