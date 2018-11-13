const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          // 助记词
          "hello well money ....",    
          // infura接口地址
          "https://ropsten.infura.io/XXX"
        );
      },
      network_id: "*",
      gas: 4000000
    }
  }
};