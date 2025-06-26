# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **AI Architecture Specifications** system that helps AI coding assistants generate consistent, well-architected code. The project implements the "Constraint-Context matrix" principle - providing structured architectural patterns and constraints to guide AI into their "comfort zone" where they perform best.

## Development Commands

```bash
# Build and development
npm run build        # Compile TypeScript to /dist
npm run dev         # Watch mode compilation  
npm run typecheck   # Type checking without emit
npm run lint        # Run ESLint
npm run format      # Run Prettier

# Project requires Node.js >= 18.0.0
```

## Architecture and Structure

### Core Concept
The project uses a **Constraint-Context Matrix** approach:
- **Constraints**: Clear architectural patterns, layer responsibilities, and dependencies
- **Context**: Memories, conventions, preferred libraries, anti-patterns, examples

### Main Architecture Pattern
Currently implements **Controller-Service-Repository** pattern:
- `src/architectures/controller-service-repository/` - Complete architecture specification
- `src/layers/` - Reusable layer definitions (controller, service, repository)
- `manifest.json` - Central index of architectures and layer compatibility

### Layer Structure
Each layer in `src/layers/` contains:
- `spec.json` - Layer definition with responsibilities, restrictions, dependencies
- `templates/` - Minimal code templates with placeholders like `{{ResourceName}}`
- Framework variants (Express, Fastify) and ORM support (Prisma, TypeORM, Knex)

### Key Files
- `manifest.json` - Registry of all architectures and layers
- `src/types/` - TypeScript definitions for the specification system
- `src/rules/` - Shared architectural rules across patterns
- `src/styles/` - Language-specific style guides

## Working with Architecture Specifications

When modifying specifications:
1. **Update manifest.json** when adding new architectures or layers
2. **Follow the schema** defined in `src/types/`
3. **Maintain layer isolation** - each layer should be independently usable
4. **Use minimal templates** - focus on structure and interfaces, not implementation details
5. **Test layer compatibility** - ensure layers work together as specified in manifest

## Architecture Specification Format

Each architecture spec includes:
- **Memories**: Context about the codebase and project
- **Conventions**: Coding standards and patterns
- **Preferred Libraries**: Recommended tools for common tasks
- **Anti-patterns**: What to avoid
- **Example Paths**: Reference implementations
- **Task Templates**: Step-by-step guides for common operations

## Meta-Architecture Considerations

This project is itself a tool for AI assistants, so when working on it:
- Consider how changes affect AI guidance quality
- Maintain the constraint-context balance in specifications
- Test that templates generate production-ready code
- Ensure layer dependencies remain unidirectional
- Keep templates minimal but complete enough for AI understanding