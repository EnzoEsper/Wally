
var budgetController = (function(){
  var x = 33;

  var add = function(a){
    return(x + a);
  }

  return {
    publicTest : function(b){
      return add(b);
    }
  }
}());

var UIController = (function(){

  // codigo

}());

var controller = (function(budgetCtrl, UICtrl){

  var z = budgetCtrl.publicTest(2);

  return {
    anotherPublic : function(){
      return z;
    }
  }
}(budgetController, UIController));
