
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

  var calculateTotal = function(type){
    var sum = 0;

    data.allItems[type].forEach(function(curr){
      sum += curr.value;
    });

    data.totals[type] = sum;
  }
  // estructura de datos para almacenar ingresos y datos
  var data = {
    allItems: {
      exp : [],
      inc : []
    },
    totals : {
      exp : 0 ,
      inc : 0,
    },
    budget: 0,
    percentage: -1
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

    deleteItem : function (type, id){
      var ids, index;

      ids = data.allItems[type].map(function(current){
        return current.id;
      });

      index = ids.indexOf(id);

      if(index !== -1){
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget : function(){
      // calcular total de gastos y ingresos
      calculateTotal('exp');
      calculateTotal('inc');

      // calcular el presupuesto: ingresos - gastos
      data.budget = data.totals.inc - data.totals.exp;
      
      if(data.totals.inc > 0){
        // calcular el porcentaje de gastos
        // solo cuando haya alguin ingreso, de lo contrario el porcentaje seria infinito
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
      
    },

    getBudget : function(){
      return {
        budget : data.budget,
        totalInc : data.totals.inc,
        totalExp : data.totals.exp,
        percentage : data.percentage 
      }
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
    expensesContainer: '.expenses__list',
    budgetLabel : '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container'
  }

  return {
    getInput : function(){
      return {
        //se reemplazan los parametros con los strings del DOM corresp
        type : document.querySelector(DOMstrings.inputType).value, //puede ser "inc" o "exp"
        description : document.querySelector(DOMstrings.inputDescription).value,
        value : parseFloat(document.querySelector(DOMstrings.inputValue).value)  
      }
    },

    addListItem: function(obj, type){

      var html, newHtml, element;

      // crear un string HTML con texto marcado
      if(type === 'inc'){
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ;
      }else if(type === 'exp'){
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ;
      }
     
      // reemplazar dicho texto con los datos del item
      newHtml = html.replace('%id%' , obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      //agregar el item a la UI (Insertar el HTML en el DOM)
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem : function(selectorID){
      var el ;//elemento
      el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
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
    
    displayBudget : function (obj){
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
      
      if(obj.percentage > 0){
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---"
      }
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
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

  };

  var updateBudget = function(){
    var budget;
    // 1. Calcular el presupuesto(BUDGET)
    budgetCtrl.calculateBudget();
    
    // 2. Retornar el presupuesto
    budget = budgetCtrl.getBudget();

    // 3. Mostrar presupuesto(BUDGET) en la UI
    UICtrl.displayBudget(budget);
  };

  var ctrlAddItem = function(){
    var input, newItem;
    // 1. Obtener los datos de los campos de la UI
    input = UICtrl.getInput();

    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      // 2. Agregar el item al BUDGET CONTROLLER
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      
      // 3. Agregar el item a la UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Limpiar los campos
      UICtrl.clearFields();

      // 5. Calcular y actualizar budget 
      updateBudget();
    };
  };

  var ctrlDeleteItem = function(event){
    var itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    console.log(itemID);

    if(itemID){
      splitID = itemID.split("-");
      
      type = splitID[0];
      ID = parseInt(splitID[1]); 

      // 1. Eliminar el item de la estuctura de datos
      budgetCtrl.deleteItem(type, ID);
      // 2. Eliminar el item de la UI
      UICtrl.deleteListItem(itemID);
      // 3. Actualizar y mostrar el nuevo presupuesto
      updateBudget();
    }
  };

  return {
    init : function(){
      console.log("la aplicacion ha inicializado");
      UICtrl.displayBudget({
        budget : 0,
        totalInc : 0,
        totalExp : 0,
        percentage : 0 
      });
      setupEventListeners();
    }
  }

}(budgetController, UIController));

controller.init();