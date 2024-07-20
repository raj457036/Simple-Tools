/*
This is a helper file containg all the logic use in postfix and prefix convertor and evaluator
stacker class ::  is a stack maker
checker :: is for checking the expression is postfix or prefix
precedencer :: is for checking the precedence of the expression
*/

class stacker {
  constructor(size = 100) {
    this.size = size;
    this.items = [];
    this.top = -1; // we can also is -> this.items.length
  }

  // Getters for stack below

  get lastIndex() {
    // this return the index of last item
    return this.top;
  }

  get stackLen() {
    return this.items.length;
  }

  get leftSize() {
    return this.size - this.stackLen;
  }

  get peek() {
    if (this.isEmpty() == true) {
      return null;
    } else {
      return this.items[this.top];
    }
  }

  // Setters for stack below
  getItem(index) {
    if (index > this.top || index < 0) {
      return null;
    } else {
      return this.items[index];
    }
  }
  isFull() {
    if (this.top == this.size - 1) {
      return true;
    } else {
      return false;
    }
  }

  isEmpty() {
    if (this.top < 0) {
      return true;
    } else {
      return false;
    }
  }

  push(element) {
    if (this.isFull() == true) {
      return console.log("Stack is Full Now");
    } else {
      this.top++;
      this.items[this.top] = element;
      return true;
    }
  }

  pop() {
    var data;
    if (this.isEmpty() == true) {
      return false;
    } else {
      // data = this.items[this.top];
      // this.items[this.top] = undefined;
      // or we can use
      data = this.items.splice(this.top, 1); // this will return an array with single element more efficient
      this.top--;
      return data[0];
    }
  }

  traverse() {
    return this.items;
  }
}

// INFIX TO POSTFIX

const preference = {
  "-": 0,
  "+": 0,
  "%": 1,
  "/": 1,
  "*": 1,
  "^": 2,
  ")": 3,
  "(": 3,
};

function precidencer(item) {
  var operators = ["", "(", ")", "-", "+", "%", "/", "*", "^"];

  for (var j = 0; j < operators.length; j++) {
    if (item == operators[j]) {
      return j;
    }
  }

  return 0;
}

const isAnOperator = (s) => preference[s] !== undefined;
const isAParen = (s) => preference[s] === 3;

// Infix to postfix conversion
function infixToPostfix(expression, tab = 0, prefixMode = false) {
  const infixExp = [...expression.split(""), ")"];
  const postfixExp = [];

  const stack = ["("];

  const table = {
    exp: [],
    stack: [],
    conexp: [],
  };

  table.exp.push("");
  table.stack.push(stack.join(" "));
  table.conexp.push(postfixExp.join(""));

  for (let char of infixExp) {
    if (!isAnOperator(char) && char !== "(" && char !== ")") {
      postfixExp.push(char);
    } else if (char === "(") {
      stack.push(char);
    } else if (char === ")") {
      let peek = stack[stack.length - 1];
      while (stack.length > 0 && peek !== "(") {
        postfixExp.push(stack.pop());
        peek = stack[stack.length - 1];
      }
      stack.pop(); // Remove the '('
    } else if (isAnOperator(char)) {
      let pref = preference[char];
      let peek = stack[stack.length - 1];

      // Update condition to handle right-associativity
      const condition = () =>
        prefixMode
          ? pref < preference[peek]
          : pref <= preference[peek] && char !== "^";

      while (stack.length > 0 && condition()) {
        if (peek === "(") {
          break;
        }
        postfixExp.push(stack.pop());
        peek = stack[stack.length - 1];
      }
      stack.push(char);
    }
    if (tab === 1) {
      table.exp.push(char);
      table.stack.push(stack.join(" "));
      table.conexp.push(postfixExp.join(" "));
    }
  }

  while (stack.length > 0) {
    postfixExp.push(stack.pop());
  }

  return {
    postfixExpression: postfixExp.join(" "),
    table: table,
  };
}

// reverser

function reverser(expression) {
  var _temp = expression.split("");

  for (var i = 0; i < expression.length; i++) {
    if (_temp[i] === ")") {
      _temp[i] = "(";
    } else if (_temp[i] === "(") {
      _temp[i] = ")";
    }
  }

  return _temp.reverse().join("");
}

function infixToPrefix(expression, tab = 0) {
  const postfixResult = infixToPostfix(reverser(expression), tab, true);
  const postfixExp = postfixResult.postfixExpression;
  const prefixExp = reverser(postfixExp);
  return {
    prefixExpression: prefixExp,
    table: postfixResult.table,
  };
}

function isNumbers(expression) {
  return !/[^\d\s+\-*/^()]/.test(expression); // Allow only digits and valid operators
}

function postfixEval(expression) {
  expression = expression.trim();

  if (expression.length > 1 && !expression.includes(" ")) {
    alert("Please add 'space' between elements");
    return;
  }

  const postfixExp = [...expression.split(" "), ")"];

  const table = {
    char: [],
    s: [],
  };

  const stack = [];
  let finalResult = 0;

  for (const char of postfixExp) {
    if (char === ")") break;

    if (!isAnOperator(char)) {
      stack.push(char);
    } else {
      const a = stack.pop();
      const b = stack.pop();

      let result = `(${b} ${char} ${a})`;
      stack.push(result);
    }

    finalResult = stack[stack.length - 1];
    table.char.push(char);
    table.s.push(stack.join(" "));
  }

  let _tresult = `${finalResult}`;

  try {
    _tresult += ` = ${eval(finalResult.replace(/\^/g, "**"))}`;
  } catch (error) {
    _tresult += " = Error";
  }

  table.s[table.s.length - 1] = _tresult;
  return table;
}

function prefixEval(expression) {
  expression = expression.trim();
  const isNumber = isNumbers(expression);
  if (expression.length > 1 && !expression.includes(" ")) {
    alert("Please add 'space' between elements");
    return;
  }

  // Reverse the prefix expression for evaluation
  const prefixExp = expression.split(" ").reverse();
  const stack = [];
  const table = {
    char: [],
    s: [],
  };

  for (const char of prefixExp) {
    if (!isAnOperator(char)) {
      // Push numbers to stack as is
      stack.push(char);
    } else {
      // Pop two operands for the operator
      const a = stack.pop();
      const b = stack.pop();

      // Create the expression with current operator
      let result = `(${b} ${char} ${a})`;
      // Push the result back to stack
      stack.push(result);
    }

    // Update the table for debugging
    table.char.push(char);
    table.s.push(stack.join(" "));
  }

  const finalResult = stack[stack.length - 1];
  let _tresult = `${finalResult}`;

  // Evaluate the final result
  if (isNumber) {
    // Replace '^' with '**' for JavaScript evaluation
    _tresult += ` = ${eval(finalResult.replace(/\^/g, "**"))}`;
  }

  _tresult = _tresult.replace("**", "^");
  table.s[table.s.length - 1] = _tresult;
  return table;
}

function checker(expression) {
  if (precidencer(expression[0]) > 2) {
    return 1;
  } else {
    return 0;
  }
}
