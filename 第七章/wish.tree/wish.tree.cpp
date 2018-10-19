#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>

class wish_contract : public eosio::contract {
  public:
    wish_contract(account_name self)
      :eosio::contract(self),   // 构造函数
      wishes(_self, _self)
      {}

    // @abi action
    void create(account_name author,       // 创建者
                const uint32_t id,         // 索引值
                const std::string& nickname ,   // 昵称
                const std::string& description  // 愿望
                ) {
      // 新增内容往往用到emplace构造函数，来进行数据库对象的新增。
      // emplace函数接收两个参数，一个创建者,和一个要创建对象的表达式
      wishes.emplace(author, [&](auto& new_wish) {
        new_wish.id  = id;
        new_wish.author = author;
        new_wish.nickname = nickname;
        new_wish.description = description;
      });
      
      // 打印结果
      eosio::print("wish#", id, " created");
    }

    // @abi action
    void destroy(account_name author, const uint32_t id) {
      // 根据id寻找对应的愿望
      auto wish_lookup = wishes.find(id);
      // 删除这个愿望
      wishes.erase(wish_lookup);
      // 打印结果
      eosio::print("wish#", id, " destroyed");
    }


  private:
    // @abi table wishes i64
    struct wish {
      uint64_t id;
      std::string author;
      std::string nickname;
      std::string description;

      // primary_key函数是定义主键的函数。
      uint64_t primary_key() const { return id; }
      // EOSLIB_SERIALIZE宏提供序列化和反序列化方法，以便可以在合约和nodeos系统之间来回传递操作。
      EOSLIB_SERIALIZE(wish, (id)(description)(nickname))
    };

    typedef eosio::multi_index<N(wishes), wish> wish_table;
    wish_table wishes;
};

EOSIO_ABI(wish_contract, (create)(destroy))