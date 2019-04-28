/*
This is a helper file containg all the logic use in postfix and prefix convertor and evaluator
stacker class ::  is a stack maker
checker :: is for checking the expression is postfix or prefix
precedencer :: is for checking the precedence of the expression
*/


class stacker
{
    constructor(size=100)
    {
        this.size = size;
        this.items = [];
        this.top = -1; // we can also is -> this.items.length
    }

// Getters for stack below

    get lastIndex()
    {
        // this return the index of last item
        return this.top;
    }

    get stackLen()
    {
        return this.items.length;
    }

    get leftSize()
    {
        return this.size-this.stackLen;
    }

    get peek()
    {
        if(this.isEmpty() == true)
            {
                return console.log("stack is empty");
            }
        else
            {
                return console.log(this.items[this.top]), this.items[this.top];
            }
    }

// Setters for stack below
    getItem(index)
    {
        if(index > this.top || index < 0)
            {
                return console.log("Wrong Index")
            }
        else
            {
                return this.items[index], console.log(this.items[index]);
            }
    }
    isFull()
    {
        if(this.top==this.size-1)
            {
                return true;
            }
        else
        {
            return false;
        }
    }

    isEmpty()
    {
        if(this.top < 0)
            {
                return true;
            }
        else
            {
                return false;
            }
    }

    push(element)
    {
        if(this.isFull() == true)
            {
                return console.log("Stack is Full Now");
            }
        else
            {
                this.top++;
                this.items[this.top] = element;
                return true;
            }
        
    }

    pop()
    {
        var data;
        if(this.isEmpty() == true)
            {
                return false;
            }
        else
            {
                // data = this.items[this.top];
                // this.items[this.top] = undefined;
                // or we can use 
                data = this.items.splice(this.top, 1); // this will return an array with single element more efficient
                this.top--;
                return data[0];
            }
    }

    traverse()
    {
        return this.items;
    }


}

// INFIX TO POSTFIX

function precidencer(item)
{
    /*
    precedence are :
            * > ^ > / > % > + > - > ) > ( > any operand
    */
    var operators = ['','(',')','-','+','%','/','*','^'];

    for(var j = 0; j < operators.length; j++)
        {
            if(item == operators[j])
                {
                    return j;
                }
        }
    
        return 0;
}

// Infix to postfix conversion
function infixToPostfix(expression, tab = 0)
{
    var postfixExpression = "", current;
    var table = {
        exp: [],
        stak: [],
        conexp: [],
    };
    // step 1: put a ')' at the end of expression
    expression += ')';

    // creating a stack
    var infixStack = new stacker();

    // step 2: push '(' to stack
    infixStack.push('(');

    // traversing whole expression now
    for(var i = 0; i < expression.length; i++ )
        {
            current = expression[i];
            if(precidencer(current) == 1)
                {
                    infixStack.push('(');
                }

            else if(precidencer(current) == 0) 
                {
                    postfixExpression += current;
                }

            else if(precidencer(current) == 2)
                {
                    while(infixStack.peek != '(')
                        {
                            postfixExpression += infixStack.pop();
                        }
                    if(infixStack.peek == '(')
                        {
                            infixStack.pop();
                        }
                }
            else if(precidencer(current) > 2)
                {
                    if(precidencer(current) >= precidencer(infixStack.peek))
                        {
                            infixStack.push(current);
                            
                        }
                    else
                        {
                            while(infixStack.peek != '(')
                                {
                                    postfixExpression += infixStack.pop();
                                }
                            infixStack.push(current);
                            
                        }
                }
            
            if(tab==1)
                {
                    table.exp[i] = current;
                    table.stak[i] = infixStack.traverse().join("");
                    table.conexp[i] = postfixExpression;
                }
        }
    
        return {postfixExpression:postfixExpression, table: table};
}

// reverser

function reverser(expression)
{
    var newExpression = expression.split("");
    
    for(var i = 0; i < expression.length; i++)
    {
        if(newExpression[i] == ')')
            {
                newExpression[i] = '(';
            }
        else if(newExpression[i] == '(')
            {
                newExpression[i] = ')';
            }
    }

    return newExpression.reverse().join("");
}
function infixToPrefix(expression, tab=0)
{
    expression = infixToPostfix(reverser(expression), tab);
    return {prefixExpression:reverser(expression['postfixExpression']), table:expression['table']};
}

function postfixEval(expression)
{
    expression += ' )';
    expression = expression.split(" ");
    var stak = new stacker(),table = {
        char:[],s:[],
    };

    for(let i = 0; i < expression.length; i++)
    {
        let A, B;
        if (precidencer(expression[i]) < 1)
        {
            stak.push(expression[i]);
        }
        else if(precidencer(expression[i]) >2)
        {
            A = stak.pop(), B = stak.pop();
            stak.push(eval(B+expression[i]+A).toString());
        }
        table.char[i] = expression[i];
        table.s[i]=stak.traverse().toString();
    }
    table.char.pop();
    table.s.pop();
    return table;
}

function prefixEval(expression)
{
    expression = expression.split(" ");
    var prestack = new stacker(), table = {char:[], s:[],};

    for(let i = expression.length-1; i > -1; i--)
    {
        let A, B;
        if(precidencer(expression[i]) < 1)
        {
            prestack.push(expression[i]);
        }
        else if(precidencer(expression[i]) > 2)
        {
            A = prestack.pop(), B = prestack.pop();
            prestack.push(eval(A+expression[i]+B).toString());
        }

        table.char[i] = expression[i];
        table.s[i] = prestack.traverse().toString();
    }
    table.char = table.char.reverse();
    table.s = table.s.reverse();
    return table;
}

function checker(expression)
{
    if(precidencer(expression[0]) > 2)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}
