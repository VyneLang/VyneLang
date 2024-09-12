// parser.js
function parse(tokens) {
    let index = 0;

    function parseExpression() {
        const token = tokens[index];
        if (token === '{') {
            index++;
            const body = [];
            while (tokens[index] !== '}') {
                body.push(parseStatement());
            }
            index++;
            return { type: 'Block', body };
        } else if (token === 'scoop') {
            index++;
            if (tokens[index] === '{') {
                index++;
                const body = [];
                while (tokens[index] !== '}') {
                    body.push(parseStatement());
                }
                index++;
                return { type: 'ScoopBlock', body };
            }
            throw new Error(`Expected '{' after 'scoop'`);
        } else if (token === 'function') {
            index++;
            const name = tokens[index++];
            const params = [];
            while (tokens[index] !== '{') {
                params.push(tokens[index++]);
            }
            index++;
            const body = [];
            while (tokens[index] !== '}') {
                body.push(parseStatement());
            }
            index++;
            return { type: 'FunctionDeclaration', name, params, body };
        } else if (token === 'let') {
            index++;
            const name = tokens[index++];
            if (tokens[index] === '=') {
                index++;
                const value = parseExpression();
                return { type: 'VariableDeclaration', name, value };
            }
            throw new Error(`Expected '=' after variable name`);
        } else if (token === 'if') {
            index++;
            const condition = parseExpression();
            const thenBranch = parseStatement();
            let elseBranch = null;
            if (tokens[index] === 'else') {
                index++;
                elseBranch = parseStatement();
            }
            return { type: 'IfStatement', condition, thenBranch, elseBranch };
        } else if (token === 'show.text') {
            index++;
            const args = [];
            while (tokens[index] !== ')') {
                args.push(parseExpression());
            }
            index++;
            return { type: 'FunctionCall', name: 'show.text', args };
        } else if (/^\d+$/.test(token)) {
            index++;
            return { type: 'NumberLiteral', value: parseInt(token, 10) };
        } else if (/^"(?:[^"\\]|\\.)*"$/.test(token)) {
            index++;
            return { type: 'StringLiteral', value: token.slice(1, -1) }; // Remove surrounding quotes
        } else if (/^[A-Za-z_]\w*$/.test(token)) {
            index++;
            if (tokens[index] === '(') {
                index++;
                const args = [];
                while (tokens[index] !== ')') {
                    args.push(parseExpression());
                }
                index++;
                return { type: 'FunctionCall', name: token, args };
            }
            return { type: 'Identifier', name: token };
        } else {
            throw new Error(`Unexpected token: ${token}`);
        }
    }

    function parseStatement() {
        const expr = parseExpression();
        if (tokens[index] === ';') {
            index++;
        }
        return expr;
    }

    const body = [];
    while (index < tokens.length) {
        body.push(parseStatement());
    }
    return { type: 'Program', body };
}

module.exports = { parse };
