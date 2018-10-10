var express = require('express'); // 加载express
var app = express();              // 新建一个express应用
var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
app.use(express.static('static'));
//
var fabric_client = new Fabric_Client();

// setup the fabric network
var channel = fabric_client.newChannel('mychannel');
var peer = fabric_client.newPeer('grpc://localhost:7051');
channel.addPeer(peer);
var order = fabric_client.newOrderer('grpc://localhost:7050')
channel.addOrderer(order);

//
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log('Store path:'+store_path);
var tx_id = null;


// 定义返回
app.get('/',function(req,res){

    // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
    Fabric_Client.newDefaultKeyValueStore({ path: store_path
    }).then((state_store) => {
        // assign the store to the fabric client
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        // use the same location for the state store (where the users' certificate are kept)
        // and the crypto store (where the users' keys are kept)
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);

        // get the enrolled user from persistence, this user will sign all requests
        return fabric_client.getUserContext('user1', true);
    }).then((user_from_store) => {
        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded user1 from persistence');
            member_user = user_from_store;
        } else {
            throw new Error('Failed to get user1.... run registerUser.js');
        }

        // queryCar chaincode function - requires 1 argument, ex: args: ['CAR4'],
        // queryAllCars chaincode function - requires no arguments , ex: args: [''],
        const request = {
            //targets : --- letting this default to the peers assigned to the channel
            // 注释原有命令
            chaincodeId: 'fabcar',
            fcn: 'queryAllCars',
            args: ['']
            // 查询CAR3信息
            // chaincodeId: 'fabcar',
            // fcn: 'queryCar',
            // args: ['CAR3']
        };

        // send the query proposal to the peer
        return channel.queryByChaincode(request);
    }).then((query_responses) => {
        var content = ""
        console.log("Query has completed, checking results");
        // query_responses could have more than one  results if there multiple peers were used as targets
        if (query_responses && query_responses.length == 1) {
            if (query_responses[0] instanceof Error) {
                console.error("error from query = ", query_responses[0]);
                res.send("error from query = ", query_responses[0]);
            } else {
                console.log("Response is ", query_responses[0].toString());

                var cars = JSON.parse(query_responses[0].toString());
                var content = ""
                content += '<!doctype html>'
                content += '<html lang="en">'
                content += '<head>'
                content += '<meta charset="utf-8">'
                content += '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'
                content += '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">'
                content += '</head>'
                content += '<body>'
                content += '<div class="text-center"><h1>fabcar 实例</h1></div>'
                content += '<table class="table table-striped">'
                content += '<thead><tr><th>汽车</th><th>颜色</th><th>厂商</th><th>型号</th><th>所有者</th></tr></thead>'
                content += '<tbody>'
                for(var i=0;i<cars.length;i++){
                    content += '<tr><th scope="row"><a href="./'+ cars[i].Key + '">' + cars[i].Key + '</a></th>';
                    content += '<td>' + cars[i].Record.colour + '</td>';
                    content += '<td>' + cars[i].Record.make +'</td>';
                    content += '<td>' + cars[i].Record.model + '</td>';
                    content += '<td>' + cars[i].Record.owner + '</td>';
                    content += '</tr>';
                }
                content += '</tbody>'
                content += '</table>'
                content += '<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>'
                content += '<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>'
                content += '<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>'
                content += '</body>'
                content += '</html>'

                res.send(content);
            }
        } else {
            console.log("No payloads were returned from query");
            res.send("No payloads were returned from query");
        }
    }).catch((err) => {
        console.error('Failed to query successfully :: ' + err);
        res.send('Failed to query successfully :: ' + err);
    });
});


app.get("/:carId",function(req, res, next){
    // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
    Fabric_Client.newDefaultKeyValueStore({ path: store_path
    }).then((state_store) => {
        // assign the store to the fabric client
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        // use the same location for the state store (where the users' certificate are kept)
        // and the crypto store (where the users' keys are kept)
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);

        // get the enrolled user from persistence, this user will sign all requests
        return fabric_client.getUserContext('user1', true);
    }).then((user_from_store) => {
        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded user1 from persistence');
            member_user = user_from_store;
        } else {
            throw new Error('Failed to get user1.... run registerUser.js');
        }

        // queryCar chaincode function - requires 1 argument, ex: args: ['CAR4'],
        // queryAllCars chaincode function - requires no arguments , ex: args: [''],
        const request = {
            //targets : --- letting this default to the peers assigned to the channel
            // 注释原有命令
            chaincodeId: 'fabcar',
            fcn: 'queryCar',
            args: [req.params.carId]
            // 查询CAR3信息
            // chaincodeId: 'fabcar',
            // fcn: 'queryCar',
            // args: ['CAR3']
        };

        // send the query proposal to the peer
        return channel.queryByChaincode(request);
    }).then((query_responses) => {
        var content = ""
        console.log("Query has completed, checking results");
        // query_responses could have more than one  results if there multiple peers were used as targets
        if (query_responses && query_responses.length == 1) {
            if (query_responses[0] instanceof Error) {
                console.error("error from query = ", query_responses[0]);
                res.send("error from query = ", query_responses[0]);
            } else {
                console.log("Response is ", query_responses[0].toString());

                var car = JSON.parse(query_responses[0].toString());
                var content = ""
                content += '<!doctype html>'
                content += '<html lang="en">'
                content += '<head>'
                content += '<meta charset="utf-8">'
                content += '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'
                content += '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">'
                content += '</head>'
                content += '<body>'
                content += '<div class="text-center"><h1>' + req.params.carId + '详情</h1><div><a href="/">返回</a></div></div>'
                content += '<div class="container">'
                content += '<div class="card" style="width: 18rem;margin:auto">'
                content += '<img class="card-img-top" src="./images/' + req.params.carId + '.jpeg" alt="' + req.params.carId + '">'
                content += '<div class="card-body">'
                content += '<h5 class="card-title">' + req.params.carId + '</h5>'
                content += '<p class="card-text">颜色：' + car.colour + '</p>'
                content += '<p class="card-text">厂商：' + car.make + '</p>'
                content += '<p class="card-text">型号：' + car.model + '</p>'
                content += '<p class="card-text">所有者：' + car.owner + '</p>'
                content += '</div>'
                content += '</div>'
                content += '</div>'
                content += '<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>'
                content += '<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>'
                content += '<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>'
                content += '</body>'
                content += '</html>'

                res.send(content);
            }
        } else {
            console.log("No payloads were returned from query");
            res.send("No payloads were returned from query");
        }
    }).catch((err) => {
        console.error('Failed to query successfully :: ' + err);
        res.send('Failed to query successfully :: ' + err);
    });
})

// 监听在3000端口
app.listen(3000);
