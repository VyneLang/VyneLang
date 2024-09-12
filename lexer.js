// lexer.js
function tokenize(input) {
    const regex = /(?:\/\/[^\n]*\n)|(?:\s*(=>|{|}|function|let|if|else|scoop|show\.text|[A-Za-z_]\w*|\d+|"(?:[^"\\]|\\.)*"|[()]+|\S)\s*)/g;
    const tokens = [];
    let match;
    while (match = regex.exec(input)) {
        // Skip comments
        if (match[0].startsWith('//')) {
            continue;
        }
        tokens.push(match[1]);
    }
    return tokens;
}

module.exports = { tokenize };
