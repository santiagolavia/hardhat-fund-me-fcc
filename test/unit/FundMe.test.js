// Group test in different functions
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", async function () {
    let fundMe
    let mockV3Aggregator
    let deployer
    const sendValue = ethers.parseEther("1")
    beforeEach(async function () {
        //deploy our fundMe contract
        //using Hardhat-deploy

        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer,
        )
    })

    describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async () => {
            const response = await fundMe.s_priceFeed()
            assert.equal(response, mockV3Aggregator.target)
        })
    })
    describe("fund", function () {
        // https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
        // could also do assert.fail
        it("Fails if you don't send enough ETH", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!",
            )
        })
        it("Updates the amount funded data structure", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.s_addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds funder to array of s_funders", async () => {
            await fundMe.fund({ value: sendValue })
            const funder = await fundMe.s_funders(0)
            assert.equal(funder, deployer)
        })
    })

    describe("withdraw", async function () {
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue })
            // First we fund the contract for test the withdrawals
        })
        it("Withdraw ETH from a single founder", async function () {
            //Arrange
            const startingFundMeBalance = await ethers.provider.getBalance(
                await fundMe.getAddress(),
            ) //BigNumber output --> toString() and add()

            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer,
            )
            //Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, gasPrice } = transactionReceipt
            const gasCost = gasUsed * gasPrice
            const endingFundMeBalance = await ethers.provider.getBalance(
                await fundMe.getAddress(),
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer,
            )
            //Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance + startingDeployerBalance,
                endingDeployerBalance + gasCost,
            )
        })
        it("Withdraw with multiple s_funders", async function () {
            //Arrange
            const accounts = await ethers.getSigners()
            for (i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i],
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }
            const startingFundMeBalance = await ethers.provider.getBalance(
                await fundMe.getAddress(),
            ) //BigNumber output --> toString() and add()

            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer,
            )
            //Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, gasPrice } = transactionReceipt
            const gasCost = gasUsed * gasPrice
            const endingFundMeBalance = await ethers.provider.getBalance(
                await fundMe.getAddress(),
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer,
            )
            //Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance + startingDeployerBalance,
                endingDeployerBalance + gasCost,
            )
            await expect(fundMe.s_funders(0)).to.be.reverted

            for (i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.s_addressToAmountFunded(
                        accounts[i].getAddress(),
                    ),
                    0,
                )
            }
        })
        it("Only allows the owner to withdraw the funds", async function () {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const fundMeConnectedContract = await fundMe.connect(attacker)
            await expect(
                fundMeConnectedContract.withdraw(),
            ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner")
        })
        it("cheaperWithdraw testing....", async function () {
            //Arrange
            const accounts = await ethers.getSigners()
            for (i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i],
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }
            const startingFundMeBalance = await ethers.provider.getBalance(
                await fundMe.getAddress(),
            ) //BigNumber output --> toString() and add()

            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer,
            )
            //Act
            const transactionResponse = await fundMe.cheaperWithdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, gasPrice } = transactionReceipt
            const gasCost = gasUsed * gasPrice
            const endingFundMeBalance = await ethers.provider.getBalance(
                await fundMe.getAddress(),
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer,
            )
            //Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance + startingDeployerBalance,
                endingDeployerBalance + gasCost,
            )
            await expect(fundMe.s_funders(0)).to.be.reverted

            for (i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.s_addressToAmountFunded(
                        accounts[i].getAddress(),
                    ),
                    0,
                )
            }
        })
        it("Withdraw ETH from a single founder", async function () {
            //Arrange
            const startingFundMeBalance = await ethers.provider.getBalance(
                await fundMe.getAddress(),
            ) //BigNumber output --> toString() and add()

            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer,
            )
            //Act
            const transactionResponse = await fundMe.cheaperWithdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, gasPrice } = transactionReceipt
            const gasCost = gasUsed * gasPrice
            const endingFundMeBalance = await ethers.provider.getBalance(
                await fundMe.getAddress(),
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer,
            )
            //Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance + startingDeployerBalance,
                endingDeployerBalance + gasCost,
            )
        })
    })
})
