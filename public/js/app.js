angular.module("nightLife", [
  "nightLife.services",
  "nightLife.directives",
  "nightLife.controllers"
  ])
  
  .config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});


$("input").focusin(function(){
  $(".header").addClass("minimize");
});

$("input").focusout(function(){
  $(".header").removeClass("minimize");
});