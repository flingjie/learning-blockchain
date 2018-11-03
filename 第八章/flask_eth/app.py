from flask import Flask, render_template, request, jsonify
from web3 import Web3, HTTPProvider
import pickle

# 新建一个Flask应用
app = Flask(__name__)


# 初始化web3
w3 = Web3(HTTPProvider("https://mainnet.infura.io/v3/b31e802f763e4728aa6cdd9d4faaef05"))


@app.route("/")
def get_last_block():
    # 获取最新区块
    last_block = w3.eth.getBlock("latest")

    # 提取区块信息
    block = {
        "miner": last_block.miner,
        "difficulty": last_block.difficulty,
        "extraData": last_block.extraData.hex(),
        "gasLimit": last_block.gasLimit,
        "gasUsed": last_block.gasUsed,
        "hash": last_block.hash.hex(),
        "logsBloom": last_block.logsBloom.hex(),
        "mixHash": last_block.mixHash.hex(),
        "nonce": last_block.nonce.hex(),
        "number": last_block.number,
        "parentHash": last_block.parentHash.hex(),
        "receiptsRoot": last_block.receiptsRoot.hex(),
        "size": last_block.size,
        "stateRoot": last_block.stateRoot.hex(),
        "timestamp": last_block.timestamp,
        "totalDifficulty": last_block.totalDifficulty,
        "transactionsRoot": last_block.transactionsRoot.hex(),
        "transactions": [],
        "uncles": last_block.uncles,
    }
    for t in last_block.transactions:
        block['transactions'].append(
            t.hex()
        )
    return render_template("block.html", block=block)


@app.route("/transaction", methods=["GET", "POST"])
def handle_transaction():
    if request.method == 'GET':
        return render_template('transaction.html')
    else:
        h = request.form.get("transaction")
        transaction = w3.eth.getTransaction(h)
        result = {
            "blockHash": transaction.blockHash.hex(),
            "blockNumber": transaction.blockNumber,
            "from": transaction["from"],
            "gas": transaction.gasPrice,
            "gasPrice": transaction.gasPrice,
            "hash": transaction.hash.hex(),
            "input": transaction.input,
            "nonce": transaction.nonce,
            "r": transaction.r.hex(),
            "s": transaction.s.hex(),
            "to": transaction.to,
            "transactionIndex": transaction.transactionIndex,
            "v": transaction.v,
            "value": transaction.value

        }
        return jsonify(result)


@app.route("/balance", methods=["GET", "POST"])
def get_balance():
    if request.method == 'GET':
        return render_template('balance.html')
    else:
        account = request.form.get("account")
        balance = float(w3.fromWei(w3.eth.getBalance(account), 'ether'))
        result = {
            "balance": balance

        }
        return jsonify(result)


@app.route("/visualization")
def visualization():
    x_data = []
    difficulty_data = []
    data = pickle.load(open("block.pkl", "rb"))
    for i, b in enumerate(data):
        x_data.append(i)
        difficulty_data.append(b['difficulty'])
    return render_template("visualization.html",
                           x_data=x_data,
                           difficulty_data=difficulty_data)


if __name__ == "__main__":
    app.run(debug=True)
