pragma solidity ^0.4.24;

import "./TradeableERC721Token.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title LittlePig
 * LittlePig - a contract for my non-fungible creatures.
 */
contract LittlePig is TradeableERC721Token {
  constructor(address _proxyRegistryAddress) TradeableERC721Token("LittlePig", "LITTLE", _proxyRegistryAddress) public {  }

  function baseTokenURI() public view returns (string) {
    return "https://little-pig-api.herokuapp.com/api/creature/";
  }
}