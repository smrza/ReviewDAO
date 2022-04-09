// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

pragma solidity ^0.8.0;

contract ReviewDAOToken is ERC20, Ownable, ReentrancyGuard {
    uint64 public MAX_INITIAL_LIQUIDITY = 10000000;
    uint64 public MAX_TEAM_GET = 20000000;
    uint64 public MAX_ECOSYSTEM_GET = 60000000;
    uint256 public constant PRICE_PER_TOKEN = 0.1 ether;
    bool public liquidityMinted = false;
    bool public teamMinted = false;
    bool public ecosystemMinted = false;

    constructor() ERC20("Review DAO Token", "RDT"){}

    mapping(address => uint256) private privateInvestors;

    function setPrivateList(address[] calldata addresses, uint256 numAllowedToMint)
        external
        onlyOwner
    {
        for (uint256 i = 0; i < addresses.length; i++) {
            privateInvestors[addresses[i]] = numAllowedToMint;
        }
    }

    function privateAvailableToMint(address addr) external view returns (uint256) {
        return privateInvestors[addr];
    }

    function mintPrivateList(uint256 amount) external payable {
        require(
            amount <= privateInvestors[msg.sender],
            "Exceeded max available to purchase."
        );
        require(
            PRICE_PER_TOKEN * amount == msg.value,
            "Ether value sent is not correct."
        );
        privateInvestors[msg.sender] -= amount;
        _mint(msg.sender, amount);
    }

    function mintLiquidity(address liquidityProvider)
        external
        onlyOwner
    {
        require(
            !liquidityMinted,
            "Initial liquidity tokens already minted."
        );
        _mint(liquidityProvider, MAX_INITIAL_LIQUIDITY);
        liquidityMinted = true;
    }

    function mintTeam()
        external
        onlyOwner
    {
        require(
            !teamMinted,
            "Team tokens already minted."
        );
        _mint(msg.sender, MAX_TEAM_GET);
        teamMinted = true;
    }

    function withdrawToLiquidityProvider(address liquidityProvider) external onlyOwner nonReentrant {
		payable(liquidityProvider).transfer(address(this).balance);
	}

    function mintEcosystem(address ReviewDAOContract)
        external
        onlyOwner
    {
        require(
            !ecosystemMinted,
            "Contract tokens already minted."
        );
        _mint(ReviewDAOContract, MAX_ECOSYSTEM_GET);
        ecosystemMinted = true;
    }
}