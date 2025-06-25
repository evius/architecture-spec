# AI Agent Architecture Specification System - Context Document

## Project Overview
A centralized GitHub repository containing specifications, templates, and patterns for AI agents to generate consistent, well-architected code across multiple languages and frameworks. The system is designed based on the Constraint-Context matrix principle, helping AI agents work within their "comfort zone" by providing constrained solution spaces and explicit context.

## Core Concept
- **Goal**: Constrain AI agents to follow agreed-upon architectural patterns and coding styles while maintaining flexibility within individual code units
- **Approach**: Architecture specifications with minimal templates that provide structure without over-constraining implementation details, plus AI-specific guidance to maximize success
- **Distribution**: Public GitHub repository that AI agents can read directly
- **Philosophy**: Move AI coding tasks into the "constrained solution space with provided context" quadrant for best results

## Key Design Decisions

### 1. Configuration Structure
- Each project contains a `project-config.json` that references architectures from the central repo
- Architectures are referenced by ID (e.g., "controller-service-repository")
- Configuration supports multiple components with different languages/frameworks
- Data access libraries (ORMs) are configured at the component level

### 2. Architecture Specifications
- Single architecture with configurable options (avoiding architecture proliferation)
- Options include: service patterns (class/functional), error handling strategies
- Each architecture defines:
  - Layer responsibilities and restrictions
  - Dependency rules between layers
  - Minimal templates with placeholders
  - Rules and conventions

### 3. Repository Structure
```
/src                    # All source code and specifications
  /architectures        # Architecture specifications
  /layers               # Reusable layer definitions
    /controller
      /base.ts          # Layer spec
      /templates        # Framework-specific templates
    /service
    /repository
  /rules                # Shared and specific rules
  /styles               # Language-specific style guides
  /types                # TypeScript type definitions
/manifest.json          # Discovery and compatibility index
```

### 4. Layer Reusability
- Layers (controller, service, repository) are defined separately
- Architectures compose layers rather than redefining them
- Templates are organized by layer and framework for maximum reuse

### 5. Templates vs Examples
- Use minimal templates with placeholders ({{ResourceName}})
- Focus on structure, interfaces, and boundaries
- Avoid full examples - AI agents already know coding patterns
- Constrain architecture and style, not implementation details
- Include context hints and constraints in templates
- Point to existing code examples for patterns

### 6. AI Guidance System
- **Memories**: Always-available context about the codebase
- **Conventions**: Explicit coding standards and practices
- **Preferred Libraries**: Clear library choices for common tasks
- **Anti-patterns**: What the AI should avoid
- **Example Paths**: Where to find good examples in the codebase
- **Task Templates**: Step-by-step breakdowns for common operations

### 7. Documentation Integration
- Internal docs (ADRs, design docs) linked from layers
- External docs (library references) for additional context
- Helps AI agents self-serve context rather than guessing

## Key Components

### ProjectConfig Schema
- Defines what lives in each project
- References central architectures
- Configures component-specific settings

### ArchitectureSpec Schema
- Complete architecture definition
- Includes base patterns, options, layers, templates, and rules
- Supports data access variants (different templates per ORM)
- **NEW**: AI guidance section with memories, conventions, preferred libraries
- **NEW**: Task decomposition templates for common operations

### Repository Manifest
- Index of available architectures, layers, and templates
- Compatibility matrix
- Enables discovery and validation
- **NEW**: Documentation links for each layer

### AI-Specific Enhancements
Based on the Constraint-Context matrix:
- **Constraining solution space**: Templates, rules, task decomposition
- **Providing context**: Memories, documentation links, example paths
- **Task templates**: Break complex tasks into constrained steps
- **Context hints**: Point AI to relevant examples and patterns

## Implementation Strategy
1. Start with Node.js/Express and controller-service-repository pattern
2. Build complete example with TypeScript schemas
3. Create manifest for discovery
4. Test with AI agents before expanding

## Next Session Topics
- Implementing the first complete architecture
- Creating validation tools
- Building the manifest system
- Testing AI agent integration
- Expanding to additional patterns and languages

## Key Files Created
1. `architecture-schema.ts` - Complete TypeScript schema definitions
2. `controller-service-repository-example.ts` - Concrete architecture example
3. `manifest.ts` - Repository manifest structure

## Design Principles
- Minimize configuration while maximizing consistency
- Provide structure without constraining creativity
- Make it easy for both AI agents and developers to use
- Support gradual adoption and extension
- **Work with AI strengths**: Constrain solution space, provide explicit context
- **Avoid AI weaknesses**: Reduce implicit knowledge requirements
- **Enable task decomposition**: Support breaking complex tasks into smaller, constrained steps
