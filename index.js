document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('bodmasForm').addEventListener('submit', function (event) {
        event.preventDefault();

        let expression = document.getElementById('expression').value.trim();
        let result = solveBodmas(expression);
        displayResult(result);
    });
});

function solveBodmas(expression) {
    try {
        let sanitizedExpression = sanitizeExpression(expression);
        let parsedExpression = parseExpression(sanitizedExpression);
        let result = evaluate(parsedExpression);
        return result;
    } catch (error) {
        console.error('Error:', error.message);
        return 'Invalid Expression';
    }
}

function sanitizeExpression(expression) {
    // Remove all spaces
    return expression.replace(/\s/g, '');
}

function parseExpression(expression) {
    // Use regex to split expression into parts
    let parts = [];
    let current = '';

    for (let char of expression) {
        if (char === '(' || char === ')' || char === '+' || char === '-' || char === '*' || char === '/') {
            if (current !== '') {
                parts.push(current);
                current = '';
            }
            parts.push(char);
        } else {
            current += char;
        }
    }

    if (current !== '') {
        parts.push(current);
    }

    return parts;
}

function evaluate(expression) {
    // Evaluate the expression based on BODMAS rules
    let result = evaluateParentheses(expression);
    result = evaluateMultiplicationAndDivision(result);
    result = evaluateAdditionAndSubtraction(result);
    return result;
}

function evaluateParentheses(expression) {
    // Evaluate expressions inside parentheses first
    let stack = [];
    let result = [];
    for (let token of expression) {
        if (token === ')') {
            let temp = [];
            while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                temp.unshift(stack.pop());
            }
            stack.pop(); // pop '('
            stack.push(String(evaluate(temp)));
        } else {
            stack.push(token);
        }
    }
    while (stack.length > 0) {
        result.unshift(stack.pop());
    }
    return result;
}

function evaluateMultiplicationAndDivision(expression) {
    // Evaluate multiplication and division from left to right
    let result = [];
    let i = 0;
    while (i < expression.length) {
        if (expression[i] === '*') {
            let left = parseFloat(result.pop());
            let right = parseFloat(expression[i + 1]);
            result.push(left * right);
            i += 2; // Skip next number
        } else if (expression[i] === '/') {
            let left = parseFloat(result.pop());
            let right = parseFloat(expression[i + 1]);
            result.push(left / right);
            i += 2; // Skip next number
        } else {
            result.push(expression[i]);
            i++;
        }
    }
    return result;
}

function evaluateAdditionAndSubtraction(expression) {
    // Evaluate addition and subtraction from left to right
    let result = parseFloat(expression[0]);
    for (let i = 1; i < expression.length; i += 2) {
        let operator = expression[i];
        let operand = parseFloat(expression[i + 1]);
        if (operator === '+') {
            result += operand;
        } else if (operator === '-') {
            result -= operand;
        }
    }
    return result;
}

function displayResult(result) {
    let resultDiv = document.getElementById('bodmasResult');
    if (resultDiv) {
        resultDiv.textContent = `Result: ${result}`;
    } else {
        console.error('Element with ID "bodmasResult" not found.');
    }
}
