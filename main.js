// index.js
const fs = require('fs');
const readline = require('readline');
const { tokenize } = require('./lexer');
const { parse } = require('./parser');
const { interpret } = require('./interpreter');

function runVyneCode(sourceCode) {
    const tokens = tokenize(sourceCode);
    const ast = parse(tokens);
    interpret(ast);
}

function repl() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>>> '
    });

    console.log("Vyne version 0.2.8-rc-3.");
    console.log("(C) 2024 Miguel V.");
    console.log("Press CTRL+C to quit.\n")
    rl.prompt();

    rl.on('line', (line) => {
        try {
            runVyneCode(line);
        } catch (e) {
            console.error(`Error: ${e.message}`);
        }
        rl.prompt();
    }).on('close', () => {
        console.log('Exiting REPL');
        process.exit(0);
    });
}

function runFromFile(filename) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err.message}`);
            process.exit(1);
        }
        try {
            runVyneCode(data);
        } catch (e) {
            console.error(`Error: ${e.message}`);
            process.exit(1);
        }
    });
}

const args = process.argv.slice(2);

if (args.length > 0) {
    runFromFile(args[0]);
} else {
    repl();
}
