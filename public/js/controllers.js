angular.module("nightLife.controllers", [])

  .controller("MainCtrl", ["$scope", "searchService", function($scope, searchService) {
    
    $scope.user = null;
    
    $scope.login_show = true;
    
    
    
    searchService.isUserLoggedIn().then((user)=>{
      if(user){
        console.log("User is logged in");
        $scope.user = user;
        $scope.login_show = false;
        
      } else{
        console.log("User is not logged in");
        $scope.user = null;
      }
      
    });
    $scope.loading = false;
    $scope.error = true;
    $scope.errorMsg = null;
    $scope.searchLocation = function(loc) {
      localStorage.setItem("location", loc);
      $scope.restaurants = null;
      $scope.loading = true;
      $scope.error = false;
      searchService.search(loc).then((data)=>{
        console.log(data);
        if(data){
          $scope.loading = false;
          $scope.restaurants = data;
        } else{
          $scope.loading = false;
          $scope.error = true;
          $scope.errorMsg = "No results for this location"
        }
    });
  }
  
  function searchForPreviousLocation(){
    if(localStorage.getItem("location")){
      $scope.searchLocation(localStorage.getItem("location"));
      $scope.location =localStorage.getItem("location") ;
    }
  }
  
  searchForPreviousLocation();
  
  
  
  $scope.going = function(res, index){
    console.log("user is",$scope.user);
    if($scope.user===null){
      alert("Please Login");
       
    }
    else{
      
        searchService.going($scope.user.twitter.id, res.id).then((data)=>{
          console.log(data);
          
          if(data.going){
            $scope.restaurants[index].going += 1;  
          } else{
            $scope.restaurants[index].going -= 1;
          }
          
        });
    }
  }
}]);