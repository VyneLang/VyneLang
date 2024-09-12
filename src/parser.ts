import { TOKENS } from './lexer';

type ASTNode = ['ASSIGN', string, ASTNode, boolean] |
               ['IF', ASTNode, ASTNode, ASTNode?] |
               ['WRITEF', string, ...ASTNode[]] |
               ['NUMBER', number] |
               ['IDENTIFIER', string] |
               ['OPERATOR', string];

export class Parser {
    private tokens: Array<[string, string]>;
    private currentPos: number;
    private currentToken: [string, string] | null;

    constructor(tokens: Array<[string, string]>) {
        this.tokens = tokens;
        this.currentPos = -1;
        this.currentToken = null;
        this.advance();
    }

    private advance() {
        this.currentPos += 1;
        this.currentToken = this.currentPos < this.tokens.length ? this.tokens[this.currentPos] : null;
    }

    private expr(): ASTNode {
        if (this.currentToken && this.currentToken[0] === 'NUMBER') {
            const value = parseFloat(this.currentToken[1]);
            this.advance();
            return ['NUMBER', value];
        } else if (this.currentToken && this.currentToken[0] === 'IDENTIFIER') {
            const id = this.currentToken[1];
            this.advance();
            return ['IDENTIFIER', id];
        }
        throw new Error('Unexpected token');
    }

    private parseArguments(): Array<ASTNode> {
        const args: Array<ASTNode> = [];
        while (this.currentToken && this.currentToken[1] !== ')') {
            args.push(this.expr());
            if (this.currentToken && this.currentToken[1] === ',') {
                this.advance();
            }
        }
        return args;
    }

    public parse(): ASTNode {
        return this.statement();
    }

    private statement(): ASTNode {
        if (this.currentToken && this.currentToken[0] === 'KEYWORD') {
            switch (this.currentToken[1]) {
                case 'let':
                case 'mut':
                    this.advance();
                    const varName = (this.currentToken as [string, string])[1];
                    this.advance();
                    if (this.currentToken && this.currentToken[1] === '=') {
                        this.advance();
                        const expr = this.expr();
                        const isMutable = this.currentToken && this.currentToken[1] === 'mut';
                        return ['ASSIGN', varName, expr, isMutable];
                    }
                    break;
                case 'writef':
                    this.advance();
                    if (this.currentToken && this.currentToken[1] === '(') {
                        this.advance();
                        const formatString = this.currentToken as [string, string];
                        this.advance();
                        const args = this.parseArguments();
                        if (this.currentToken && this.currentToken[1] === ')') {
                            this.advance();
                            return ['WRITEF', formatString[1], ...args];
                        }
                    }
                    break;
                case 'if':
                    this.advance();
                    const condition = this.expr();
                    if (this.currentToken && this.currentToken[1] === '{') {
                        this.advance();
                        const trueBlock = this.expr();
                        this.advance();
                        if (this.currentToken && this.currentToken[0] === 'KEYWORD' && this.currentToken[1] === 'else') {
                            this.advance();
                            if (this.currentToken && this.currentToken[1] === '{') {
                                this.advance();
                                const falseBlock = this.expr();
                                this.advance();
                                return ['IF', condition, trueBlock, falseBlock];
                            }
                        }
                        return ['IF', condition, trueBlock];
                    }
                    break;
            }
        }
        return this.expr();
    }
}
