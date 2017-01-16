angular.module("nightLife.directives",[])

  .directive("hotel", function(){
    return{
      restrict: "E",
      transclude: true,
      scope:{
        res: "="  
      },
      templateUrl: "partials/hotel.html"
    }
  })