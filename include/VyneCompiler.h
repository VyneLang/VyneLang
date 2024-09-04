// VyneCompiler.h
#ifndef VYNECOMPILER_H
#define VYNECOMPILER_H

#include "ASTNodes.h"
#include <llvm/IR/IRBuilder.h>
#include <llvm/IR/Module.h>
#include <llvm/IR/LLVMContext.h>

class VyneCompiler {
public:
    VyneCompiler();
    void compile(const std::unique_ptr<ASTNode>& rootNode);

private:
    llvm::LLVMContext context;
    llvm::IRBuilder<> builder;
    std::unique_ptr<llvm::Module> module;

    llvm::Value* compileExpression(const std::unique_ptr<ASTExpression>& expression);
    void compileStatement(const std::unique_ptr<ASTStatement>& statement);
};

#endif
