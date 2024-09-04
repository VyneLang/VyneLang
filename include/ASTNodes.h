// ASTNodes.h
#ifndef ASTNODES_H
#define ASTNODES_H

#include <memory>
#include <string>
#include <vector>

class ASTNode {
public:
    virtual ~ASTNode() = default;
};

class ASTExpression : public ASTNode {};
class ASTStatement : public ASTNode {};
class ASTFunction : public ASTNode {
public:
    std::string name;
    std::vector<std::unique_ptr<ASTNode>> parameters;
    std::unique_ptr<ASTNode> returnType;
    std::vector<std::unique_ptr<ASTStatement>> body;
};

// Example of a variable declaration
class ASTVarDecl : public ASTStatement {
public:
    std::string name;
    std::unique_ptr<ASTNode> type;
    std::unique_ptr<ASTExpression> initializer;
};

// Example of a function call
class ASTFunctionCall : public ASTExpression {
public:
    std::string functionName;
    std::vector<std::unique_ptr<ASTExpression>> arguments;
};

#endif
