
// CONTROLADOR BUDGET (DATA)
var budgetController = (function(){
  
}());

// CONTROLADOR UI
var UIController = (function(){

  // Objeto con strings del DOM para facilitar el cambio de nombre de clases o ID's, si se llegara a necesitar en un futuro.
  var DOMstrings = {
    inputType : '.add__type' ,
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }

  return {
    getInput : function(){
      return {
        //se reemplazan los parametros con los strings del DOM corresp
        type : document.querySelector(DOMstrings.inputType).value,
        description : document.querySelector(DOMstrings.inputDescription).value,
        value : document.querySelector(DOMstrings.inputValue).value
      }
    },
    getDOMstrings : function(){
      return DOMstrings;
    }
  }

}());

// CONTROLADOR GLOBAL 
var controller = (function(budgetCtrl, UICtrl){

  //Obtiene el objeto DOMstrings del CONTROLADOR UI
  var DOM = UICtrl.getDOMstrings();

  var ctrlAddItem = function(){
    
    // Obtener los datos de los campos de la UI
    var input = UICtrl.getInput();
    console.log(input);
  }

  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
  
  document.addEventListener('keypress', function(event){
    if (event.keyCode === 13 || event.which === 13 ) {
      ctrlAddItem();
    }
  })

}(budgetController, UIController));
