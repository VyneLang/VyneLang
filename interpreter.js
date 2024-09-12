// interpreter.js
function interpret(ast) {
    const globalEnv = new Map();
    let currentEnv = globalEnv;

    function evalBlock(block, localEnv) {
        const oldEnv = currentEnv;
        currentEnv = localEnv;
        block.body.forEach(statement => {
            evalStatement(statement, currentEnv);
        });
        currentEnv = oldEnv;
    }

    function evalStatement(statement, localEnv) {
        switch (statement.type) {
            case 'VariableDeclaration':
                localEnv.set(statement.name, evalExpression(statement.value, localEnv));
                break;
            case 'FunctionDeclaration':
                localEnv.set(statement.name, {
                    type: 'Function',
                    params: statement.params,
                    body: statement.body
                });
                break;
            case 'IfStatement':
                if (evalExpression(statement.condition, localEnv)) {
                    evalStatement(statement.thenBranch, localEnv);
                } else if (statement.elseBranch) {
                    evalStatement(statement.elseBranch, localEnv);
                }
                break;
            case 'Block':
                evalBlock(statement, new Map(localEnv));
                break;
            case 'ScoopBlock':
                evalBlock(statement, new Map(localEnv));
                break;
            default:
                evalExpression(statement, localEnv);
                break;
        }
    }

    function evalExpression(expr, localEnv) {
        switch (expr.type) {
            case 'NumberLiteral':
                return expr.value;
            case 'Identifier':
                if (localEnv.has(expr.name)) {
                    return localEnv.get(expr.name);
                }
                throw new Error(`Undefined variable: ${expr.name}`);
            case 'FunctionCall':
                if (expr.name === 'show.text') {
                    const args = expr.args.map(arg => evalExpression(arg, localEnv));
                    console.log(...args);
                    break;
                }
                const func = localEnv.get(expr.name) || globalEnv.get(expr.name);
                if (!func || func.type !== 'Function') {
                    throw new Error(`Undefined function: ${expr.name}`);
                }
                const args = expr.args.map(arg => evalExpression(arg, localEnv));
                const funcEnv = new Map(localEnv);
                func.params.forEach((param, index) => {
                    funcEnv.set(param, args[index]);
                });
                const savedEnv = currentEnv;
                currentEnv = funcEnv;
                evalBlock({ body: func.body }, funcEnv);
                currentEnv = savedEnv;
                break;
            default:
                throw new Error(`Unknown expression type: ${expr.type}`);
        }
    }

    evalBlock(ast, globalEnv);
}

module.exports = { interpret };
