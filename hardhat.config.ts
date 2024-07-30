import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "@typechain/ethers-v6";
import "@nomicfoundation/hardhat-ethers";

const config: HardhatUserConfig = {
  solidity: "0.8.26",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  typechain: {
    outDir: "typechain", 
    target: "ethers-v6", 
  },
  networks: {
    hardhat: {
        chainId: 31337 
    },
    localhost: {
        url: "http://localhost:8545",
        chainId: 31337
    }
}
};

export default config;
