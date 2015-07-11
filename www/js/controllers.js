angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicModal) {
  
  $scope.shouldShowDelete = false;
  $scope.listCanSwipe = true;

  $scope.FridgeArray = [];
  
  if(window.localStorage.MyFridge != undefined){
    $scope.FridgeArray = JSON.parse(window.localStorage.MyFridge);
  }

  $scope.swiped = function(){
    if($scope.shouldShowDelete == true){
      $scope.shouldShowDelete = false;
    }
    else if($scope.shouldShowDelete == false){
      $scope.shouldShowDelete = true;
    }
  }

  $scope.deleteItem = function(description){
    for(var i = 0; i < $scope.FridgeArray.length; i++){
      if($scope.FridgeArray[i].description == description){
        $scope.FridgeArray.splice(i, 1);
        window.localStorage.MyFridge = JSON.stringify($scope.FridgeArray);
      }
    }
  }

  $scope.showDetails = function(name){
    $ionicModal.fromTemplateUrl('templates/fridgeitem.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.ItemDetailsName = name;
      $scope.modal = modal;
      $scope.openModal();
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
  }

  $scope.makeRequestToAPI = function(barcode){

      // Redbull works

      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", "http://api.upcdatabase.org/json/63560711dd6d990026d22a48c20451f4/" + barcode, false );
      xmlHttp.send( null );
      var responseObj = JSON.parse(xmlHttp.responseText);
      if(responseObj.valid == "true"){
        try{
          alert("Item Added!");
          $scope.FridgeArray.push(responseObj);
          window.localStorage.MyFridge = JSON.stringify($scope.FridgeArray);
        }
        catch(e){
          alert(e);
        }
      }
      else{
        var description = window.prompt("Enter Description", "Product Description Here");
        $scope.FridgeArray.push({"description": description});
        window.localStorage.MyFridge = JSON.stringify($scope.FridgeArray);
      }
  }

  $scope.loadScanner = function(){
    cordova.plugins.barcodeScanner.scan(
  function (result) {
    $scope.makeRequestToAPI(result.text);
 }, 
  function (error) {
    alert("Scanning failed: " + error);
  });
  }
})

.controller('ChatsCtrl', function($scope, $rootScope, Chats) {

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
