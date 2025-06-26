# Architecture Generation Prompt Template

This template helps create new architecture specifications for the AI Architecture Specification System. It focuses on high-level strategic decisions to quickly generate comprehensive, AI-optimized architecture specifications.

## Configuration Variables

Replace these variables when using this template:

- `{{ARCHITECTURE_DESCRIPTION=}}` - Simple queues with scheduling and concurrency options.
- `{{NUM_QUESTIONS}}` - Number of discovery questions to ask (minimum 1, maximum 1)

## Prompt Template

---

**System Context:**
You are helping create a new architecture specification for the AI Architecture Specification System. This system helps AI assistants generate consistent, well-architected code by providing constraints and context based on the Constraint-Context Matrix principle.

**Architecture Description:**
{{ARCHITECTURE_DESCRIPTION}}

**Your Task:**
I need you to create a complete architecture specification that follows the existing ArchitectureSpec TypeScript schema. You should leverage the existing controller-service-repository pattern as a reference and build upon the established patterns in this system.

**Discovery Questions:**
Please ask me {{NUM_QUESTIONS}} high-level questions to understand the key strategic decisions for this architecture. Focus on:

1. **Layer/Component Structure**: What are the main layers or components that should be separated?
2. **Technology Choices**: What are the preferred libraries, frameworks, or tools for common tasks?
3. **Data Flow Patterns**: How should data and dependencies flow between components?
4. **Key Constraints**: What are the primary architectural constraints or rules to enforce?
5. **Common Operations**: What are the most frequent tasks that need step-by-step guidance?

Keep questions strategic and high-level - avoid implementation details that can be derived from the architectural decisions.

**After Questions:**
Once you have my answers, create a complete architecture specification that includes:

### Required Components:

1. **Basic Information**
   - Unique ID (kebab-case)
   - Name and description
   - Base architecture configuration (layers, dependency flow, error handling)

2. **Layer Specifications**
   - Purpose and responsibilities for each layer
   - Restrictions (what each layer must NOT do)
   - Dependencies (what each layer can/cannot import)
   - Interface specifications where applicable

3. **Templates**
   - File name patterns for each layer
   - Minimal code templates with {{ResourceName}} placeholders
   - Framework-specific variants if needed
   - Data access variants for different ORMs/databases

4. **Rules and Conventions**
   - Required rules (with severity levels)
   - Forbidden patterns
   - Naming and structural conventions

5. **AI Guidance System**
   - **Memories**: Always-available context about the codebase
   - **Conventions**: Explicit coding standards and practices
   - **Preferred Libraries**: Clear library choices for common tasks
   - **Anti-patterns**: What AI assistants should avoid
   - **Example Paths**: References to good examples in the codebase

6. **Task Templates**
   - Step-by-step breakdowns for common operations
   - Validation criteria for each step
   - Required context for task completion

### Reference Materials:
- Use the existing controller-service-repository specification as a template
- Follow the ArchitectureSpec TypeScript interface exactly
- Leverage existing layer patterns where possible
- Build upon the AI guidance system approach

### Output Format:
Provide the complete architecture specification as a properly formatted TypeScript object that can be saved as `{architecture-id}.ts` in the `/src/architectures/` directory.

### Validation Checklist:
After generating the specification, verify:
- [ ] All required ArchitectureSpec properties are included
- [ ] Layer dependencies are logically consistent
- [ ] Templates include proper placeholders and constraints
- [ ] AI guidance provides specific, actionable context
- [ ] Task templates break down complex operations into manageable steps
- [ ] Architecture integrates well with existing system patterns

**Integration Note:**
Remember to add the new architecture to `manifest.json` with appropriate compatibility information and layer references.

---

## Usage Instructions

1. **Copy this template** and replace the configuration variables
2. **Use with AI assistant** to generate the architecture specification
3. **Review the output** against the validation checklist
4. **Save the specification** as `{architecture-id}.ts` in `/src/architectures/`
5. **Update manifest.json** to include the new architecture
6. **Test the specification** by using it to generate sample code

## Example Architecture Descriptions

- "Clean Architecture with ports and adapters for domain-driven design"
- "Event-driven microservices with CQRS and event sourcing"
- "Hexagonal architecture with dependency inversion for testability"
- "Layered MVC with repository pattern for web applications"
- "Onion architecture with separate application and domain layers"

## Question Examples

**Good High-Level Questions:**
- "What are the 3-5 main layers this architecture should separate?"
- "What are your preferred libraries for validation, ORM, and HTTP framework?"
- "Should dependency flow be unidirectional or bidirectional?"
- "What are 2-3 common anti-patterns this architecture should prevent?"
- "What's the most common complex task that needs step-by-step guidance?"

**Avoid Low-Level Questions:**
- "How should error handling work in the service layer?"
- "What specific validation rules should be applied?"
- "How should database connections be managed?"

The goal is to gather strategic architectural decisions quickly so the AI can generate a comprehensive specification based on established patterns and schemas.