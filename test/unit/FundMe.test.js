// Group test in different functions
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundMe", async function ( {
    let fundMe;
    beforeEach(async function () {
        //deploy our fundMe contract
        //using Hardhat-deploy
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        deployer = await getNamedAccounts().deployer
    })

    describe("constructor", async function () {

    })
}))