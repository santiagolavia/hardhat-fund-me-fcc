# Solidity API

## FundMe__NotOwner

```solidity
error FundMe__NotOwner()
```

## FundMe

This contract is to demo a sample funding contract

_This implements data feeds as our library_

### s_addressToAmountFunded

```solidity
mapping(address => uint256) s_addressToAmountFunded
```

### s_funders

```solidity
address[] s_funders
```

### i_owner

```solidity
address i_owner
```

### MINIMUM_USD

```solidity
uint256 MINIMUM_USD
```

### s_priceFeed

```solidity
contract AggregatorV3Interface s_priceFeed
```

### onlyOwner

```solidity
modifier onlyOwner()
```

### constructor

```solidity
constructor(address priceFeedAddress) public
```

### fallback

```solidity
fallback() external payable
```

### receive

```solidity
receive() external payable
```

### fund

```solidity
function fund() public payable
```

### withdraw

```solidity
function withdraw() public payable
```

### cheaperWithdraw

```solidity
function cheaperWithdraw() public payable
```

## PriceConverter

### getPrice

```solidity
function getPrice(contract AggregatorV3Interface priceFeed) internal view returns (uint256)
```

### getConversionRate

```solidity
function getConversionRate(uint256 ethAmount, contract AggregatorV3Interface priceFeed) internal view returns (uint256)
```

