import { artifacts, ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { common } from "./common";

import {
    abi as FACTORY_ABI,
    bytecode as FACTORY_BYTECODE,
} from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json";
import {
    abi as SWAP_ROUTER_ABI,
    bytecode as SWAP_ROUTER_BYTECODE,
} from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json'

import {
    abi as NFTDescriptor_ABI, bytecode as NFTDescriptor_BYTECODE
} from '@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json'

import {
    abi as NFTPositionManager_ABI, bytecode as NFTPositionManager_BYTECODE
} from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'

import {
    abi as NFTPositionDescriptor_ABI, bytecode as NFTPositionDescriptor_BYTECODE
} from '@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json'

import {
    abi as TickLens_ABI, bytecode as TickLens_BYTECODE
} from '@uniswap/v3-periphery/artifacts/contracts/lens/TickLens.sol/TickLens.json'

import {
    abi as Quoter_ABI, bytecode as Quoter_BYTECODE
} from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'

import {
    abi as V3Migrator_ABI, bytecode as V3Migrator_BYTECODE
} from '@uniswap/v3-periphery/artifacts/contracts/V3Migrator.sol/V3Migrator.json'

async function main() {
    const [deployer] = await ethers.getSigners();

    const uniV3Factory = await deploy_UniV3Factory(deployer);
    console.log("deployed Uniswap_V3 Factory addr: ", uniV3Factory.address);
    // thread sleep 1.5s, to get last nonce number
    await delay(1500);

    var wtxoc9_addr = "";

    // deploy WTXOC9 
    const wtxoc9 = await deploy_WXOC9(deployer);
    console.log("deployed wxoc9 addr: ", wtxoc9.address);
    await delay(1500);
    wtxoc9_addr = wtxoc9.address;

    // deploy Multicall2
    // const multicall2 = await deploy_Multicall2(deployer);
    // console.log("deploy multicall2 addr: ", multicall2.address);
    // await delay(1500);

    const multicall3 = await deploy_Multicall3(deployer);
    console.log("deploy multicall3 addr: ", multicall3.address);
    await delay(1500);

    // deploy proxyadmin
    const proxyAdmin = await deploy_ProxyAdmin(deployer);
    console.log("deploy proxyAdmin addr: ", proxyAdmin.address)
    await delay(1500)

    // deploy TickLens
    const ticklens = await deploy_TickLens(deployer);
    console.log("deploy ticklens addr: ", ticklens.address)
    await delay(1500)

    // deploy Quoter
    const uniV3SwapQuoter = await deploy_Quoter(deployer, uniV3Factory.address, wtxoc9_addr);
    console.log("deployed SwapX_V3 Quoter addr: ", uniV3SwapQuoter.address);
    await delay(1500);

    // deploy swapRouter
    const uniV3SwapRouter = await deploy_UniV3SwapRouter(deployer, uniV3Factory.address, wtxoc9_addr);
    console.log("deployed SwapX_V3 SwapRouter addr: ", uniV3SwapRouter.address);
    await delay(1500);

    // deploy NFTDescriptor
    const nftDescriptorlibrary = await deploy_NFTDescriptorlibrary(deployer);
    console.log("deployed SwapX_V3 NFTDescriptorlibrary addr: ", nftDescriptorlibrary.address);
    await delay(1500);
 

    // deploy NonfungibleTokenPositionDescriptor
    const nftPositionDescriptor = await deploy_NFTPositionDescriptor(deployer, nftDescriptorlibrary.address, wtxoc9_addr);
    console.log("deployed SwapX_V3 NFTPositionDescriptor addr: ", nftPositionDescriptor.address);
    await delay(1500);

    // deploy 
    const nftPositionManager = await deploy_NFTPositionManager(deployer, uniV3Factory.address, wtxoc9_addr, nftPositionDescriptor.address);
    console.log("deployed SwapX_V3 NFTPositionManager addr: ", nftPositionManager.address);
    await delay(1500);

    const transparentUpgradeableProxy = await deploy_TransparentUpgradeableProxy(deployer, nftPositionDescriptor.address, proxyAdmin.address)
    console.log("deployed transparentUpgradeableProxy addr: ", transparentUpgradeableProxy.address)
    await delay(1500)

    const v3Migrator = await deploy_V3Migrator(deployer, uniV3Factory.address, wtxoc9_addr, nftPositionManager.address)
    console.log("deployed SwapX_V3 v3Migrator addr: ", v3Migrator.address)
}

async function deploy_UniV3Factory(deployer: SignerWithAddress) {
    const univ3_factory = await ethers.getContractFactory(
        FACTORY_ABI,
        FACTORY_BYTECODE,
        deployer
    );

    return await univ3_factory.deploy();
}

async function deploy_WXOC9(deployer: SignerWithAddress) {
    const wxoc9_factory = await ethers.getContractFactory("WXOC9", deployer);

    return await wxoc9_factory.deploy();
}

async function deploy_Multicall2(deployer:SignerWithAddress) {
    const multicall2_factory = await ethers.getContractFactory("Multicall2", deployer);

    return await multicall2_factory.deploy();
}

async function deploy_Multicall3(deployer:SignerWithAddress) {
    const multicall2_factory = await ethers.getContractFactory("Multicall3", deployer);

    return await multicall2_factory.deploy();
}


async function deploy_ProxyAdmin(deployer:SignerWithAddress) {
    const proxyAdmin_factory = await ethers.getContractFactory("contracts/ProxyAdmin/ProxyAdmin.sol:ProxyAdmin", deployer);

    return await proxyAdmin_factory.deploy();
}

async function deploy_TickLens(deployer: SignerWithAddress) {
    const nftDescriptorlibrary_factory = await ethers.getContractFactory(
        TickLens_ABI,
        TickLens_BYTECODE,
        deployer
    );

    return nftDescriptorlibrary_factory.deploy();
}

async function deploy_Quoter(deployer: SignerWithAddress, factory_addr: string, eth9_addr: string) {
    const univ3SwapRouter_factory = await ethers.getContractFactory(
        Quoter_ABI,
        Quoter_BYTECODE,
        deployer
    );

    return univ3SwapRouter_factory.deploy(factory_addr, eth9_addr);
}

async function deploy_TransparentUpgradeableProxy(deployer: SignerWithAddress, nftPositionDescriptor_addr: string, proxyAdmin_addr: string) {
    const transparentUpgradeableProxy_factory = await ethers.getContractFactory("contracts/TransparentUpgradeableProxy/TransparentUpgradeableProxy.sol:TransparentUpgradeableProxy", deployer)

    return transparentUpgradeableProxy_factory.deploy(nftPositionDescriptor_addr, proxyAdmin_addr, "0x")
}

async function deploy_UniV3SwapRouter(deployer: SignerWithAddress, factory_addr: string, eth9_addr: string) {
    const univ3SwapRouter_factory = await ethers.getContractFactory(
        SWAP_ROUTER_ABI,
        SWAP_ROUTER_BYTECODE,
        deployer
    );

    return univ3SwapRouter_factory.deploy(factory_addr, eth9_addr);
}

async function deploy_NFTDescriptorlibrary(deployer: SignerWithAddress) {
    const nftDescriptorlibrary_factory = await ethers.getContractFactory(
        NFTDescriptor_ABI,
        NFTDescriptor_BYTECODE,
        deployer
    );

    return nftDescriptorlibrary_factory.deploy();
}

async function deploy_NFTPositionDescriptor(deployer: SignerWithAddress, library_addr: string, eth9_addr: string) {
    const linkedBytecode = common.linkLibrary(NFTPositionDescriptor_BYTECODE,
        {
            ['contracts/libraries/NFTDescriptor.sol:NFTDescriptor']: library_addr
        }
    );

    const nftPositionDescriptor_factory = await ethers.getContractFactory(
        NFTPositionDescriptor_ABI,
        linkedBytecode,
        deployer
    );

    return nftPositionDescriptor_factory.deploy(eth9_addr, "0x54584f4300000000000000000000000000000000000000000000000000000000");
}

async function deploy_NFTPositionManager(deployer: SignerWithAddress, factory_addr: string, wtxoc9_addr: string, positionDescriptor_addr: string) {
    const nftPositionManager_factory = await ethers.getContractFactory(
        NFTPositionManager_ABI,
        NFTPositionManager_BYTECODE,
        deployer
    );

    return nftPositionManager_factory.deploy(factory_addr, wtxoc9_addr, positionDescriptor_addr);
}

async function deploy_V3Migrator(deployer: SignerWithAddress, factory_addr: string, wtxoc9_addr: string, nftPostionManager_addr: string) {
    const V3Migrator_factory = await ethers.getContractFactory(
        V3Migrator_ABI,
        V3Migrator_BYTECODE,
        deployer
    );

    return V3Migrator_factory.deploy(factory_addr, wtxoc9_addr, nftPostionManager_addr)
}

function delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});