var VinayToken = artifacts.require("./VinayToken");

module.exports = function (deployer) {
  deployer.deploy(VinayToken, 1000000);
};
