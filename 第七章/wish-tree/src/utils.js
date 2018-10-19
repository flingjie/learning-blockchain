const eosjs = require('eosjs');
const fetch = require('node-fetch');                            // node only; not needed in browsers
const { TextDecoder, TextEncoder } = require('text-encoding');  
const rpc = new eosjs.Rpc.JsonRpc('http://127.0.0.1:8888', { fetch });
// 以实际创建的私钥为准
const defaultPrivateKey = "5JgCFRTK4g2RLBY2CFYZz7ezkc7Yyz9Zgg3vXFrRxrgNUwKwTxy"; 
const signatureProvider = new eosjs.SignatureProvider([defaultPrivateKey]);
const api = new eosjs.Api({ rpc, signatureProvider, textDecoder: new TextDecoder, textEncoder: new TextEncoder });

export default{
    install(Vue,options)
    {
      // Vue.prototype.newWish = function (i, nickname, wish) {
      //   (async () => {
      //     const result = await api.transact({
      //       actions: [{
      //         account: 'wisher',
      //         name: 'create',
      //         authorization: [{
      //           actor: 'wisher',
      //           permission: 'active',
      //         }],
      //         data: {
      //           id: i,
      //           author: 'wisher',
      //           nickname: 'test',
      //           description: 'aaaa',
      //         },
      //       }]
      //     }, {
      //       blocksBehind: 3,
      //       expireSeconds: 30,
      //     });
      //     // 打印返回结果
      //     console.log(result);
      //   })();
      // }
    }
  }