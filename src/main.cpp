#include <iostream>
#include <fstream>
#include <memory>
#include "VyneLexer.h"
#include "VyneParser.h"
#include "VyneInterpreter.h"
#include "VyneCompiler.h"

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage: vyne <source_file> [--compile]" << std::endl;
        return 1;
    }

    std::string filename = argv[1];
    bool compileMode = (argc == 3 && std::string(argv[2]) == "--compile");

    // Read the source file
    std::ifstream sourceFile(filename);
    if (!sourceFile.is_open()) {
        std::cerr << "Error: Could not open source file " << filename << std::endl;
        return 1;
    }

    std::string sourceCode((std::istreambuf_iterator<char>(sourceFile)),
                            std::istreambuf_iterator<char>());

    // 1. Lexical Analysis (Tokenization)
    VyneLexer lexer(sourceCode);
    auto tokens = lexer.tokenize();

    // 2. Parsing (Generate AST)
    VyneParser parser(tokens);
    auto ast = parser.parse();

    if (!ast) {
        std::cerr << "Error: Parsing failed." << std::endl;
        return 1;
    }

    if (compileMode) {
        // 3a. Compilation (Generate executable)
        VyneCompiler compiler;
        compiler.compile(ast);
        std::cout << "Compilation successful!" << std::endl;
    } else {
        // 3b. Interpretation (Execute AST)
        VyneInterpreter interpreter;
        interpreter.interpret(ast);
        std::cout << "Interpretation successful!" << std::endl;
    }

    return 0;
}
