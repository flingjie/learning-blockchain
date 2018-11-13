# -*- coding: UTF-8 -*-
from web3 import Web3, HTTPProvider
import pickle

w3 = Web3(HTTPProvider("https://mainnet.infura.io/v3/b31e802f763e4728aa6cdd9d4faaef05"))


def download_blocks(max_block_number):
    block_list = []
    for i in range(max_block_number):
        print("Get block {} ...".format(i))
        block = w3.eth.getBlock(i)
        block_list.append({
            "miner": block.miner,
            "difficulty": block.difficulty,
            "extraData": block.extraData.hex(),
            "gasLimit": block.gasLimit,
            "gasUsed": block.gasUsed,
            "hash": block.hash.hex(),
            "logsBloom": block.logsBloom.hex(),
            "mixHash": block.mixHash.hex(),
            "nonce": block.nonce.hex(),
            "number": block.number,
            "parentHash": block.parentHash.hex(),
            "receiptsRoot": block.receiptsRoot.hex(),
            "size": block.size,
            "stateRoot": block.stateRoot.hex(),
            "timestamp": block.timestamp,
            "totalDifficulty": block.totalDifficulty,
            "transactionsRoot": block.transactionsRoot.hex(),
            "transactions": [],
            "uncles": block.uncles,
        })
    pickle.dump(block_list, open("block.pkl", "wb"))


if __name__ == "__main__":
    download_blocks(10000)
