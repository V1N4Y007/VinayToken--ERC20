# VinayToken - ERC20 Token Sale DApp

A complete Ethereum DApp for creating and selling ERC20 tokens, built with Solidity, Truffle, and Web3.js.

## Features

- **VinayToken (VIN)**: ERC20-compliant cryptocurrency token with 1,000,000 total supply
- **Token Sale Contract**: Purchase tokens at 0.001 ETH per token
- **Web Interface**: User-friendly frontend with MetaMask integration
- **Token Transfer**: Send VIN tokens to other Ethereum addresses
- **Real-time Updates**: Automatic balance and transaction tracking

## Technology Stack

- **Smart Contracts**: Solidity 0.5.16
- **Development Framework**: Truffle
- **Local Blockchain**: Ganache
- **Frontend**: HTML, CSS (Bootstrap), JavaScript
- **Web3 Integration**: Web3.js 1.5.2
- **Wallet**: MetaMask

## Prerequisites

- Node.js (v14 or higher)
- Ganache (for local blockchain)
- MetaMask browser extension

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/vinay-token-sale.git
cd vinay-token-sale
```

2. Install dependencies:
```bash
npm install
```

3. Start Ganache on port 7545

4. Deploy contracts:
```bash
truffle migrate --reset
```

5. Run tests:
```bash
truffle test
```

6. Start the development server:
```bash
npm run dev
```

7. Open `http://localhost:3000` in your browser

## MetaMask Configuration

1. Add Ganache network to MetaMask:
   - Network Name: Ganache
   - RPC URL: http://localhost:7545
   - Chain ID: 1337 or 5777
   - Currency Symbol: ETH

2. Import a Ganache account using its private key

## Smart Contracts

### VinayToken.sol
ERC20 token implementation with:
- Name: Vinay Token
- Symbol: VIN
- Total Supply: 1,000,000 tokens
- Standard ERC20 functions (transfer, approve, transferFrom)

### VinayTokenSale.sol
Token sale mechanism with:
- Fixed price: 0.001 ETH per token
- 750,000 tokens available for purchase
- Admin controls to end the sale

## Usage

### Buy Tokens
1. Enter the number of tokens to purchase
2. Click "Buy Tokens"
3. Confirm the transaction in MetaMask
4. Wait for confirmation

### Transfer Tokens
1. Enter recipient's Ethereum address
2. Enter the amount of tokens
3. Click "Transfer VIN"
4. Confirm in MetaMask

## Project Structure

```
token_sale/
├── contracts/          # Solidity smart contracts
├── migrations/         # Deployment scripts
├── test/              # Contract tests
├── src/               # Frontend files
│   ├── index.html     # Main HTML file
│   └── js/
│       └── app.js     # Web3 integration
├── build/             # Compiled contracts (generated)
└── truffle-config.js  # Truffle configuration
```

## Testing

Run the test suite:
```bash
truffle test
```

Tests include:
- Token initialization and metadata
- Token transfers and approvals
- Sale contract initialization
- Token purchase functionality
- Sale termination

## License

MIT

## Author

Created by Vinay Trivedi

## Acknowledgments

Built as a learning project for Ethereum smart contract development.
