export class Interpreter {
    private env: { [key: string]: { value: number | string, mutable: boolean } };

    constructor() {
        this.env = {};
    }

    public interpret(ast: ASTNode): number | string | void {
        if (Array.isArray(ast)) {
            switch (ast[0]) {
                case 'ASSIGN':
                    const varName = ast[1] as string;
                    const value = this.evaluate(ast[2]);
                    const mutable = ast[3] as boolean;
                    if (varName in this.env && !this.env[varName].mutable) {
                        throw new Error(`Variable '${varName}' is not mutable`);
                    }
                    this.env[varName] = { value, mutable };
                    return value;
                case 'IF':
                    const condition = this.evaluate(ast[1]);
                    if (condition) {
                        return this.evaluate(ast[2]);
                    } else if (ast[3]) {
                        return this.evaluate(ast[3]);
                    }
                    break;
                case 'WRITEF':
                    const formatString = ast[1] as string;
                    const args = ast.slice(2).map(arg => this.evaluate(arg));
                    console.log(this.formatString(formatString, ...args));
                    break;
                case 'NUMBER':
                    return ast[1] as number;
                case 'IDENTIFIER':
                    const id = ast[1] as string;
                    if (id in this.env) {
                        return this.env[id].value;
                    } else {
                        throw new Error(`Variable '${id}' not defined`);
                    }
                case 'OPERATOR':
                    // Implement arithmetic operators here
                    break;
            }
        }
    }

    private evaluate(node: ASTNode): number | string {
        return this.interpret(node) as number | string;
    }

    private formatString(format: string, ...args: Array<number | string>): string {
        let i = 0;
        return format.replace(/%[d]/g, () => args[i++].toString());
    }
}
