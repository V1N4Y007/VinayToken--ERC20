var VinayToken = artifacts.require("./VinayToken.sol");
var VinayTokenSale = artifacts.require("./VinayTokenSale.sol");

module.exports = function (deployer) {
    deployer.deploy(VinayToken, 1000000).then(function () {
        // Token price is 0.001 Ether
        var tokenPrice = 1000000000000000;
        return deployer.deploy(VinayTokenSale, VinayToken.address, tokenPrice);
    }).then(function () {
        // Transfer 75% of tokens (750,000) to the token sale contract
        return VinayToken.deployed();
    }).then(function (tokenInstance) {
        return tokenInstance.transfer(VinayTokenSale.address, 750000);
    });
};
