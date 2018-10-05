pragma solidity ^0.4.16;

contract GuessGame {

    // 定义一个事件，用来接收游戏结果
    event GuessResult(uint playerChoice, uint computerChoice, uint result);

    // 处理两个猜拳选项
    // 值得注意的是，在web3.js中调用play函数无法获取直接获取返回值，
    // 智能合约执行需要消耗以太币，产生交易，故web3.js得到的返回结果是产生交易的hash值
    // web3.js要获取猜拳结果需要通过监听GuessResult事件
    function play(uint playerChoice, uint computerChoice) public returns (bool) {
        // 石头、剪刀和布均用数字表示
        // 其中1表示
        if (playerChoice > 0 && playerChoice <= 3 && computerChoice > 0 && computerChoice <= 3) {
            // 如果两者相同，则代表平手
            if (playerChoice == computerChoice) {
                emit GuessResult(playerChoice, computerChoice, 1);   // 选项相同 代表平手
            } else if (playerChoice == (computerChoice + 1) % 3) {
                emit GuessResult(playerChoice, computerChoice, 2);  // 这里代表电脑赢了
            } else {
                emit GuessResult(playerChoice, computerChoice, 3);  // 其他情况代表玩家赢了
            }
            return true; //执行成功返回true
        } else {
            return false;  // 执行错误返回false
        }
    }
}