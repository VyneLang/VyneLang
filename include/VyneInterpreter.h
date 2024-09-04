// VyneInterpreter.h
#ifndef VYNEINTERPRETER_H
#define VYNEINTERPRETER_H

#include "ASTNodes.h"
#include <unordered_map>
#include <string>
#include <variant>

class VyneInterpreter {
public:
    VyneInterpreter();
    void interpret(const std::unique_ptr<ASTNode>& rootNode);

private:
    std::unordered_map<std::string, std::variant<int, double, std::string>> variables;

    std::variant<int, double, std::string> evaluateExpression(const std::unique_ptr<ASTExpression>& expression);
    void executeStatement(const std::unique_ptr<ASTStatement>& statement);
};

#endif
