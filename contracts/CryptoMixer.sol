// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CryptoMixer {
    mapping(bytes32 => bool) public commitments;
    mapping(bytes32 => bool) public nullifiers;
    uint256 public constant MIN_DENOMINATION = 0.001 ether;
    
    event Deposit(bytes32 indexed commitment, uint32 leafIndex, uint256 timestamp, uint256 amount);
    event Withdrawal(address to, bytes32 nullifierHash, uint256 amount);
    
    constructor() {}
    
    function deposit(bytes32 _commitment) external payable {
        require(msg.value >= MIN_DENOMINATION, "Please send at least 0.001 ETH");
        require(!commitments[_commitment], "The commitment has been submitted");
        
        uint32 insertedIndex = _insert(_commitment);
        commitments[_commitment] = true;
        
        emit Deposit(_commitment, insertedIndex, block.timestamp, msg.value);
    }
    
    function withdraw(bytes32 _nullifierHash, address payable _recipient) external {
        require(!nullifiers[_nullifierHash], "The note has been already spent");
        require(_recipient != address(0), "Cannot withdraw to zero address");
        
        nullifiers[_nullifierHash] = true;
        
        uint256 amount = address(this).balance;
        _recipient.transfer(amount);
        emit Withdrawal(_recipient, _nullifierHash, amount);
    }
    
    function _insert(bytes32 _commitment) internal returns (uint32) {
        uint32 index = uint32(block.number);
        return index;
    }
}