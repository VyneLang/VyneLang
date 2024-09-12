// src/repl.ts

import * as readline from 'readline';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { Interpreter } from './interpreter';
import * as fs from 'fs';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const interpreter = new Interpreter();

const runCode = (code: string) => {
    const lexer = new Lexer(code);
    const tokens = lexer.generateTokens();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    interpreter.interpret(ast);
};

const runFile = (filePath: string) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err.message}`);
            return;
        }
        runCode(data);
    });
};

const interactiveMode = () => {
    console.log("Vyne v2-beta interpreter");
    rl.setPrompt('>>> ');
    rl.prompt();
    rl.on('line', (line) => {
        if (line.trim() === 'exit') {
            rl.close();
            return;
        }
        runCode(line);
        rl.prompt();
    }).on('close', () => {
        console.log('Exiting...');
    });
};

const args = process.argv.slice(2);
if (args.length > 0) {
    runFile(args[0]);
} else {
    interactiveMode();
}
