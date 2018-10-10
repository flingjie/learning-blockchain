#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>

using namespace eosio;

class hello : public contract {
  public:
      using contract::contract;

      // @abi action
      void helloworld() {
         print( "Hello World");
      }
};
EOSIO_ABI( hello, (helloworld))
