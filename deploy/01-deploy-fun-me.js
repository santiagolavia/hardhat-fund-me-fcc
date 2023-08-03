module.exports = async ({ getNammedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNammedAccounts()
    const chainId = network.config.chainId

    //When going local network we want to use mocks
}
