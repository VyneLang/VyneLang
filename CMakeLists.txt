# Minimum CMake version required
cmake_minimum_required(VERSION 3.10)

# Project name and version
project(Vyne LANGUAGES CXX VERSION 1.0)

# Set the C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Define the source files
set(SOURCES
    src/VyneLexer.cpp
    src/VyneParser.cpp
    src/VyneInterpreter.cpp
    src/VyneCompiler.cpp
    src/main.cpp
)

# Define the include directories
include_directories(include)

# Add an executable target
add_executable(vyne ${SOURCES})

# Optionally link LLVM if you decide to use it for the compiler
find_package(LLVM REQUIRED CONFIG)
if (LLVM_FOUND)
    include_directories(${LLVM_INCLUDE_DIRS})
    target_link_libraries(vyne ${LLVM_LIBS})
    message(STATUS "LLVM libraries found and linked.")
endif()

# Optionally add unit testing support (if needed)
option(ENABLE_TESTING "Enable unit testing" ON)
if (ENABLE_TESTING)
    enable_testing()
    add_subdirectory(tests)
endif()

# Set compile options
target_compile_options(vyne PRIVATE -Wall -Wextra -Werror)

# Print final messages
message(STATUS "Vyne project configuration complete.")
message(STATUS "C++ Standard: ${CMAKE_CXX_STANDARD}")
message(STATUS "Build type: ${CMAKE_BUILD_TYPE}")
