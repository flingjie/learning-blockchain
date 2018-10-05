pragma solidity ^0.4.17;


contract PetShop {

    // 宠物信息
    struct PetDetail {
        address adopter;   // 领养者地址
        bool adopted;      // 领养标志
    }

    // 宠物领养的映射信息
    mapping(uint=>PetDetail) public pets;

    // 被领养的宠物列表
    uint[] public adoptedPetList;

    // 领养事件
    event AdoptedEvent(uint petId, address adopter);

    // 领养函数
    function adopt(uint petId) public returns (bool) {
        pets[petId] = PetDetail({
            adopter: msg.sender,
            adopted: true
        });
        adoptedPetList.push(petId);
        emit AdoptedEvent(petId, msg.sender);
        return true;
    }

    // 宠物是否被领养
    function isAdopted(uint petId) public view returns (bool) {
        return pets[petId].adopted;
    }

    // 获取被领养的宠物ID
    function getAdoptedPets() public view returns (uint[]) {
        return adoptedPetList;
    }
}
