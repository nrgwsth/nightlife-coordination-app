
angular.module("nightLife.services", [])

  .factory("searchService", ["$rootScope", "$http", function($rootScope, $http) {
    var factory = {};
    factory.search = function(loc){
      return $http.get("/api/search/"+loc).then(function(response){
        return Promise.resolve(response.data);
      }, function(err){
        return Promise.reject(err);
      }).catch(function(err){
        return Promise.reject(err);
      })
    }
    
    factory.going = function(id, resid){
      return $http.post("/api/going", {id: id,res: resid}).then(function(response){
        return Promise.resolve(response.data);
      }, function(err){
        return Promise.reject(err);
      })
    }
    
    factory.isUserLoggedIn = function(){
      return $http.get("/api/isuserloggedin").then(function(response){
        console.log(response.data);
        if(response.data.success){
          return Promise.resolve(response.data.user);  
        } else{
          return Promise.resolve(null);
        }
      });
    }
    return factory;
  }])