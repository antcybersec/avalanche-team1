# Monad Zero-Man Company Smart Contract

A smart contract that automatically distributes 20% of incoming MON (Monad's native token) to token holders proportionally, while keeping 80% for the contract owner.

## 🚀 Features

- **ERC20 Token with Dividends**: Each token represents a share in the dividend pool
- **Automatic Distribution**: 20% of incoming MON goes to token holders, 80% to owner
- **Pull-Based Rewards**: Token holders claim dividends via `withdrawDividend()` (gas-efficient)
- **Accurate Tracking**: Uses magnified dividend per share technique to avoid rounding errors
- **Monad Testnet Ready**: Deployable on Monad Testnet
- **High Performance**: Leverages Monad's 10,000 TPS and 400ms block times

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Monad Testnet MON (get from faucet when available)
- Private key for deployment

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your private key and Monad Explorer API key:
   ```
   PRIVATE_KEY=your_private_key_here
   MONAD_EXPLORER_API_KEY=your_monad_explorer_api_key_here
   ```

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm test
```

The tests cover:
- Contract deployment
- Token minting and transfers
- MON distribution (20% to holders, 80% to owner)
- Dividend withdrawal
- Proportional distribution based on token holdings
- Edge cases and error handling

## 🚀 Deployment

### Deploy to Monad Testnet

```bash
npm run deploy:testnet
```

This will:
- Deploy the contract to Monad Testnet
- Display the contract address
- Provide verification command

### Deploy to Monad Mainnet

```bash
npm run deploy:mainnet
```

### Verify Contract

After deployment, verify the contract on Monad Explorer:

```bash
npm run verify:testnet
# or
npm run verify:mainnet
```

## 📖 Usage

### 1. Deploy and Mint Tokens

```javascript
// Deploy contract
const dividendDistributor = await MONDividendDistributor.deploy("Token Name", "SYMBOL");

// Mint tokens to users
await dividendDistributor.mint(userAddress, ethers.parseEther("1000"));
```

### 2. Send MON to Contract

When someone sends MON to the contract:
- 20% is distributed proportionally to token holders
- 80% goes to the contract owner
- Distribution happens automatically

```javascript
// Send MON to contract (triggers distribution)
await user.sendTransaction({
  to: contractAddress,
  value: ethers.parseEther("10") // 10 MON
});
```

### 3. Claim Dividends

Token holders can claim their dividends:

```javascript
// Check withdrawable dividend
const withdrawable = await dividendDistributor.withdrawableDividendOf(userAddress);

// Withdraw dividend
await dividendDistributor.withdrawDividend();
```

## 🔧 Smart Contract Functions

### Core Functions

- `receive()`: Handles incoming MON and distributes dividends
- `withdrawDividend()`: Allows token holders to claim their dividends
- `withdrawableDividendOf(address)`: Returns claimable dividend for an address
- `accumulativeDividendOf(address)`: Returns total accumulated dividend for an address

### Owner Functions

- `mint(address, amount)`: Mint new tokens (owner only)
- `burn(address, amount)`: Burn tokens (owner only)

## 📊 How It Works

1. **Token Creation**: Owner mints tokens to users
2. **MON Reception**: When contract receives MON:
   - Calculates 20% for dividend distribution
   - Updates `magnifiedDividendPerShare`
   - Sends 80% to owner
3. **Dividend Tracking**: Uses magnified dividend technique for accurate proportional tracking
4. **Token Transfers**: Automatically updates dividend corrections when tokens are transferred
5. **Withdrawal**: Users call `withdrawDividend()` to claim their share

## 🌐 Network Configuration

### Monad Testnet
- **Chain ID**: 12345 (placeholder - check Monad docs for actual ID)
- **RPC URL**: https://testnet-rpc.monad.xyz
- **Explorer**: https://testnet-explorer.monad.xyz/

### Monad Mainnet
- **Chain ID**: 12346 (placeholder - check Monad docs for actual ID)
- **RPC URL**: https://rpc.monad.xyz
- **Explorer**: https://explorer.monad.xyz/

## 🚀 Monad Benefits

- **High Throughput**: ~10,000 transactions per second
- **Low Latency**: 400ms block times
- **Fast Finality**: 800ms finality
- **Low Gas Fees**: Significantly lower than Ethereum
- **EVM Compatibility**: Full Ethereum Virtual Machine compatibility

## 🔒 Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Ownable**: Only owner can mint/burn tokens
- **Accurate Math**: Uses fixed-point arithmetic to prevent rounding errors
- **Pull-Based**: Users pull dividends instead of automatic distribution (saves gas)

## 📝 Events

- `DividendsDistributed(address indexed from, uint256 weiAmount)`: Emitted when dividends are distributed
- `DividendWithdrawn(address indexed to, uint256 weiAmount)`: Emitted when user withdraws dividend

## 🐛 Troubleshooting

### Common Issues

1. **"No MON sent"**: Ensure you're sending a positive amount
2. **"No dividend available"**: User has no tokens or no dividends to claim
3. **"Owner transfer failed"**: Check owner address and gas limits
4. **"MON transfer failed"**: Check recipient address and gas limits

### Gas Optimization

- The contract uses pull-based dividends to avoid gas-intensive loops
- Token transfers automatically update dividend corrections
- Magnified dividend technique ensures accurate calculations
- Monad's low gas fees make operations more cost-effective

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For questions or issues:
- Create an issue in the repository
- Check the test files for usage examples
- Review the smart contract code for implementation details
- Visit [Monad Developer Documentation](https://docs.monad.xyz/)

## 🔗 Resources

- [Monad Official Website](https://monad.xyz/)
- [Monad Developer Portal](https://developers.monad.xyz/)
- [Monad Documentation](https://docs.monad.xyz/)
- [Scaffold-Monad-Hardhat](https://github.com/monad-developers/scaffold-monad-hardhat)
