import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      },
      {
        version: '0.4.22',
      },
      {
        version: '0.7.0',
      },
      {
        version: '0.8.12'
      }
    ]
  },

  defaultNetwork: "hardhat",
  networks: {
    "hardhat": {},
    "xone-test": {
      url: "https://rpc.xonetest.plus/",
      accounts: ["d061563918d9d4b158975407b2c828429524931ece96e641396daf7e84c7e5dc"]
    }
  }
};

export default config;
