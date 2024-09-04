// VyneLexer.h
#ifndef VYNELEXER_H
#define VYNELEXER_H

#include <string>
#include <vector>
#include <unordered_map>

enum class TokenType {
    Identifier, Keyword, Number, String, Operator, Punctuation, EndOfFile
};

struct Token {
    TokenType type;
    std::string value;
    int line;
    int column;
};

class VyneLexer {
public:
    VyneLexer(const std::string& source);
    std::vector<Token> tokenize();

private:
    std::string source;
    size_t currentIndex;
    int line;
    int column;

    char currentChar();
    void advance();
    Token nextToken();
    Token identifier();
    Token number();
    Token stringLiteral();
    void skipWhitespace();
};

#endif
