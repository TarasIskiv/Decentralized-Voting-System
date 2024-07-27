import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "@typechain/ethers-v6";

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
};

export default config;
