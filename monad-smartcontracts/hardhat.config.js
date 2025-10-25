require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    monadTestnet: {
      url: process.env.MONAD_TESTNET_RPC_URL || "https://testnet-rpc.monad.xyz",
      gasPrice: 1000000000, // 1 gwei (Monad has low gas fees)
      chainId: parseInt(process.env.MONAD_TESTNET_CHAIN_ID) || 12345, // Placeholder chain ID
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    monadMainnet: {
      url: process.env.MONAD_MAINNET_RPC_URL || "https://rpc.monad.xyz",
      gasPrice: 1000000000, // 1 gwei
      chainId: parseInt(process.env.MONAD_MAINNET_CHAIN_ID) || 12346, // Placeholder chain ID
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 66 ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      monadTestnet: process.env.MONAD_EXPLORER_API_KEY || "",
      monadMainnet: process.env.MONAD_EXPLORER_API_KEY || "",
    },
    customChains: [
      {
        network: "monadTestnet",
        chainId: parseInt(process.env.MONAD_TESTNET_CHAIN_ID) || 12345,
        urls: {
          apiURL: process.env.MONAD_TESTNET_EXPLORER_API_URL || "https://testnet-explorer.monad.xyz/api",
          browserURL: process.env.MONAD_TESTNET_EXPLORER_URL || "https://testnet-explorer.monad.xyz"
        }
      },
      {
        network: "monadMainnet",
        chainId: parseInt(process.env.MONAD_MAINNET_CHAIN_ID) || 12346,
        urls: {
          apiURL: process.env.MONAD_MAINNET_EXPLORER_API_URL || "https://explorer.monad.xyz/api",
          browserURL: process.env.MONAD_MAINNET_EXPLORER_URL || "https://explorer.monad.xyz"
        }
      }
    ]
  },
};
