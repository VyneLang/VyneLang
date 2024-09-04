// VyneParser.h
#ifndef VYNEPARSER_H
#define VYNEPARSER_H

#include "VyneLexer.h"
#include <memory>
#include <vector>

class ASTNode {};

class VyneParser {
public:
    VyneParser(const std::vector<Token>& tokens);
    std::unique_ptr<ASTNode> parse();

private:
    std::vector<Token> tokens;
    size_t currentIndex;

    std::unique_ptr<ASTNode> parseExpression();
    std::unique_ptr<ASTNode> parseStatement();
    std::unique_ptr<ASTNode> parseFunction();
    std::unique_ptr<ASTNode> parseType();
};

#endif
