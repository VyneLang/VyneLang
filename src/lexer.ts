export const TOKENS = {
    KEYWORDS: ['let', 'fn', 'return', 'if', 'else', 'writef', 'mut'],
    OPERATORS: ['+', '-', '*', '/', '=', '==', '!=', '<', '>', '<=', '>='],
    DELIMITERS: ['(', ')', '{', '}', ',', ';'],
    WHITESPACE: [' ', '\n', '\t'],
    LITERALS: '0123456789',
    IDENTIFIERS: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
};

export class Lexer {
    private sourceCode: string;
    private tokens: Array<[string, string]>;
    private currentChar: string | null;
    private currentPos: number;

    constructor(sourceCode: string) {
        this.sourceCode = sourceCode;
        this.tokens = [];
        this.currentChar = null;
        this.currentPos = -1;
        this.advance();
    }

    private advance() {
        this.currentPos += 1;
        this.currentChar = this.currentPos < this.sourceCode.length ? this.sourceCode[this.currentPos] : null;
    }

    public generateTokens(): Array<[string, string]> {
        while (this.currentChar !== null) {
            if (TOKENS.WHITESPACE.includes(this.currentChar)) {
                this.advance();
            } else if (TOKENS.OPERATORS.includes(this.currentChar)) {
                this.tokens.push(['OPERATOR', this.currentChar]);
                this.advance();
            } else if (TOKENS.DELIMITERS.includes(this.currentChar)) {
                this.tokens.push(['DELIMITER', this.currentChar]);
                this.advance();
            } else if (this.currentChar.match(/\d/)) {
                this.tokens.push(this.generateNumber());
            } else if (this.currentChar.match(/[a-zA-Z_]/)) {
                this.tokens.push(this.generateIdentifier());
            } else {
                throw new Error(`Illegal character '${this.currentChar}'`);
            }
        }
        return this.tokens;
    }

    private generateNumber(): [string, string] {
        let numberStr = '';
        while (this.currentChar !== null && this.currentChar.match(/\d/)) {
            numberStr += this.currentChar;
            this.advance();
        }
        return ['NUMBER', numberStr];
    }

    private generateIdentifier(): [string, string] {
        let idStr = '';
        while (this.currentChar !== null && (this.currentChar.match(/[a-zA-Z0-9_]/))) {
            idStr += this.currentChar;
            this.advance();
        }
        if (TOKENS.KEYWORDS.includes(idStr)) {
            return ['KEYWORD', idStr];
        }
        return ['IDENTIFIER', idStr];
    }
}
