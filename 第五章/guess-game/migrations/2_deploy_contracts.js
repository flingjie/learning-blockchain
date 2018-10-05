var GuessGame = artifacts.require("GuessGame");
module.exports = function(deployer) {
    deployer.deploy(GuessGame);
};
