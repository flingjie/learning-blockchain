App = {
  web3Provider: null,
  PetShop: null,

  init: function() {
    // 加载宠物列表.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    if(typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
    }else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('PetShop.json', function(data){
        var PetShopContract = TruffleContract(data);

        PetShopContract.setProvider(App.web3Provider);
        App.PetShop = PetShopContract.at("0x1140e609379b9666bd1838473c1d0d76a86721dc");

        App.PetShop.AdoptedEvent(function(err, result){
            if(!err){
                console.log(result.args.petId.toString(10));
                console.log(result.args.adopter);
            }else{
                console.log(err);
            }
        });

        return App.updatePetStatus();
    })

    setInterval(App.updatePetStatus, 3000);

    return App.bindEvents();
  },

  updatePetStatus: function() {
      App.PetShop.getAdoptedPets.call()
      .then(function(pets){
          pets.forEach(function(petId, i) {
              $(".panel-pet").eq(petId.toString(10)).find("button").text("Adopted").attr("disabled", true);
          })
      }).catch(function(err){
          console.error(err.message);
      })
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(petId) {
    App.PetShop.isAdopted.call(petId)
    .then(function(adopted){
        if(adopted){
            $('.panel-pet').eq(petId).find("button").text("Adopted").attr("disaled", true);
        } else {
            $("panel-pet").eq(petId).find("button").text("Adopt").removeAttr("disabled");
        }
    })
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    $(this).text("Processing...").attr("disabled", true);

    web3.eth.getAccounts(function(error, accounts){
        if(error){
            console.error(error);

        }else{
            var account = accounts[0];

            App.PetShop.adopt(petId, {from: account})
            .then(function(result){
                alert("Adoption Success!");
                return App.markAdopted(petId);
            }).catch(function(err){
                $(this).text("Adopt").removeAttr("disabled");
                console.error(err.message);
            })
        }

    })
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
