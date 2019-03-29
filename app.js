
// CONTROLADOR BUDGET (DATA)
var budgetController = (function(){
  
  // function constructors para los ingresos y los gastos
  var Expense = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // estructura de datos para almacenar ingresos y datos
  var data = {
    allItems: {
      exp : [],
      inc : []
    },
    totals : {
      exp : 0 ,
      inc : 0
    }
  }

  return {
    addItem : function(type, des, val){
      var newItem, ID;

      // el ID debe ser un numero unico que se le debe asignar a cada nuevo item, ya sea income o expense
      // ejemplos: si se tiene [1 2 3 4 5] el ID siguiente deberia ser 6
      // pero      si se tiene [1 2 4 6 8] el ID siguiente deberia ser 9
      // debido a que vamos a poder eliminar los items, el arreglo puede ser modificado, por lo que se requiere que el ID sea el ultimo elemento del arreglo + 1
      if(data.allItems[type].length > 0){
        ID = data.allItems[type][(data.allItems[type].length) - 1].id + 1;
      } else {
        ID = 0;
      }
      
      // se crea un nuevo item segun sea income o expense
      if(type === "exp"){
        newItem = new Expense(ID, des, val);
      }else if(type === "inc"){
        newItem = new Income(ID, des, val);
      }

      // agrega el intem creado a la estructura de datos
      data.allItems[type].push(newItem);
      // se retorna el nuevo elemento
      return newItem;
    },
    testing : function(){
      console.log(data);
    }
  }

}());

// CONTROLADOR UI
var UIController = (function(){

  // Objeto con strings del DOM para facilitar el cambio de nombre de clases o ID's, si se llegara a necesitar en un futuro.
  var DOMstrings = {
    inputType : '.add__type' ,
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
  }

  return {
    getInput : function(){
      return {
        //se reemplazan los parametros con los strings del DOM corresp
        type : document.querySelector(DOMstrings.inputType).value, //puede ser "inc" o "exp"
        description : document.querySelector(DOMstrings.inputDescription).value,
        value : document.querySelector(DOMstrings.inputValue).value
      }
    },
    addListItem: function(obj, type){

      var html, newHtml, element;

      // crear un string HTML con texto marcado
      if(type === 'inc'){
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ;
      }else if(type === 'exp'){
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ;
      }
     
      // reemplazar dicho texto con los datos del item
      newHtml = html.replace('%id%' , obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      //agregar el item a la UI (Insertar el HTML en el DOM)
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields : function(){
      var fields, fieldsArr;
      
      // en fields se almacena una lista con los campos que se quieren limpiar
      fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

      // un pequeno truco para convertir una lista a un arreglo
      // como slice es una funcion, se puede llamar al metodo call() en ella
      // y luego se setea la variable this a fields, haciendo que slice piense que le pasamos un array (pero en realidad no) y que retorne un array
      fieldsArr = Array.prototype.slice.call(fields);

      // Limpia cada uno de los campos almacenados en el arreglo
      fieldsArr.forEach(function(current, index, array){
        current.value = "";
      });

      //Una vez limpiados los campos, vuelve a seleccionar el primer campo para seguir agregando items
      fieldsArr[0].focus();
    },

    getDOMstrings : function(){
      return DOMstrings;
    }
  }

}());

// CONTROLADOR GLOBAL 
var controller = (function(budgetCtrl, UICtrl){

  // se agrupan los event listeners en una funcion para ordenar un poco mas el codigo (ya que se encontraban dispersados)
  var setupEventListeners = function(){
    
    //Obtiene el objeto DOMstrings del CONTROLADOR UI
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
  
    document.addEventListener('keypress', function(event){
      if (event.keyCode === 13 || event.which === 13 ) {
        ctrlAddItem();
      }
    }) 
  };


  var ctrlAddItem = function(){
    var input, newItem;
    // 1. Obtener los datos de los campos de la UI
    input = UICtrl.getInput();
    console.log(input);

    // 2. Agregar el item al BUDGET CONTROLLER
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    
    // 3. Agregar el item a la UI
    UICtrl.addListItem(newItem, input.type);

    // 4. Limpiar los campos
    UICtrl.clearFields();
    // 4. Calcular el presupuesto(BUDGET)

    // 5. Mostrar presupuesto(BUDGET) en la UI
  };

  return {
    init : function(){
      console.log("la aplicacion ha inicializado");
      setupEventListeners();
    }
  }

}(budgetController, UIController));

controller.init();