# uniswapV3_deployer

## deploy Prepare
### pull runtime dependencies
```shell
npm i
npx hardhat compile
```

### parameter configuration
modify hardhat.config.ts
```javascript
  // default execution network environment
  defaultNetwork: "hardhat",
  networks: {
    "hardhat": {},
    // custom network configuration
    // network name
    "polygonMumbai": {
      // rpc endpoint
      url: "https://rpc.ankr.com/polygon_mumbai",
      // account private key (hex)
      accounts: ["<privateKey>"]
    }
  }
```

### deploy
console execution command
```shell
npx hardhat run ./scripts/01_deploy_univ3.ts --network <network name>
```
after the console executes the command, the program will start to deploy and output a deployed contract address.

```shell
deployed Uniswap_V3 Factory addr:  0xB6D7721e409baaEE9ABD5AC84A649536761A08a7
deployed wxoc addr:  0x75a23bF9e15b6CF1a9C65aaACE51b3f873EF6a81
deploy multicall2 addr:  0x1c2e9A3481fd8995611D2eCFf7bd468EB8DA5C96
deploy proxyAdmin addr:  0xDf16E65666C4603311c3f389Dcf7a16330d7efcC
deploy ticklens addr:  0x26Cb1298DAc8c577a0e9193A6223A4020F4968d5
deployed Uniswap_V3 Quoter addr:  0x9DF8a13A99940Fc0122BC3FD6aaC14e594943128
deployed Uniswap_V3 SwapRouter addr:  0x48a7fef77098024FC2636E893089D2244064Ddb2
deployed Uniswap_V3 NFTDescriptorlibrary addr:  0x2eAc030D0CE789Aa36f835Bb5F80B0e7313941Ab
deployed Uniswap_V3 NFTPositionDescriptor addr:  0xB5cE570271650feb4Ce67Ff3893097b9b2dEd677
deployed Uniswap_V3 NFTPositionManager addr:  0x25EaC640a4f5C4F3436e16171C9c443E5D0E1445
deployed transparentUpgradeableProxy addr:  0x82c56347BFD3eC0261363948eAe1228E519284d7
deployed uniswap v3Migrator addr:  0x6263dC5EE9524b18FAC7ef6c662180A2df8eda51
```

#### deployment considerations
If you do not need to deploy a new WTXOC9 contract, you need to comment the code in lines 38 to 41 in 01_deploy_univ3.ts and assign the specified contract address to the *weth9_addr* variable.
```typescript
    // 填写已有的合约地址
    var wxoc9_addr = "<address>";

    // const wtxoc9 = await deploy_WTXOC9(deployer);
    // console.log("deployed wtxoc9 addr: ", wtxoc9.address);
    // await delay(1500);
    // wtxoc9_addr = wtxoc9.address;
```

