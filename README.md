# AI Architecture Specifications 🏗️🤖

> Empowering AI coding assistants to build better software through constrained architectures and explicit context

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![AI-Friendly](https://img.shields.io/badge/AI-Friendly-blue.svg)](docs/ai-usage.md)

## 🎯 The Problem

AI coding assistants are incredibly powerful, but they often produce inconsistent code that doesn't follow your team's patterns. Why? Because they lack two critical things:
- **Constraints**: Without clear boundaries, AI explores too many solution paths
- **Context**: Without explicit knowledge of your conventions, AI makes assumptions

This leads to frustration: constant corrections, inconsistent patterns, and code that "works" but doesn't fit your architecture.

## 💡 The Solution

AI Architecture Specifications provides a structured way to guide AI coding assistants into their "comfort zone" - where the solution space is constrained and context is explicit. By defining clear architectural patterns, coding conventions, and task templates, we help AI assistants generate code that matches your team's standards from the start.

Based on the [Constraint-Context matrix](https://blog.thepete.net/blog/2025/05/22/why-your-ai-coding-assistant-keeps-doing-it-wrong-and-how-to-fix-it/) principle, this system moves AI tasks from "open-ended with implicit knowledge" to "constrained with provided context" - where AI excels.

## 🚀 Quick Start

1. **Choose an architecture** from our catalog:
   ```json
   {
     "name": "my-api-project",
     "version": "1.0.0",
     "components": {
       "api": {
         "architecture": "controller-service-repository",
         "framework": "express",
         "language": "typescript",
         "dataAccess": "prisma"
       }
     }
   }
   ```

2. **Point your AI assistant** to this repo:
   ```
   I'm using the controller-service-repository architecture from 
   https://github.com/[org]/ai-architecture-specs
   
   Create a user management API following this specification.
   ```

3. **Watch AI generate consistent, well-architected code** that follows your patterns!

## 🏛️ Available Architectures

| Architecture | Description | Languages | Frameworks | Data Access | Status |
|--------------|-------------|-----------|------------|-------------|---------|
| Controller-Service-Repository | Clean separation of HTTP handling, business logic, and data access | TypeScript, JavaScript | Express, Fastify | Prisma, TypeORM, Knex | ✅ Stable |
| Clean Architecture | Domain-centric with clear boundaries | TypeScript | - | - | 📋 Planned |
| MVC | Model-View-Controller pattern | TypeScript, Python | - | - | 📋 Planned |
| Event-Driven | Message-based microservices | TypeScript | - | - | 📋 Planned |

## 📦 What's Included

Each architecture specification provides:

- **📐 Layer Definitions**: Clear responsibilities and boundaries for each architectural layer
- **🧩 Minimal Templates**: Structure and interfaces with placeholders, not full examples
- **📜 Rules & Conventions**: Explicit patterns, practices, and anti-patterns to avoid
- **🧠 AI Guidance**: Memories, preferred libraries, and context hints for AI assistants
- **📝 Task Decomposition**: Step-by-step templates for complex operations
- **📚 Documentation Links**: Internal ADRs and external library references

## 🎨 Core Principles

1. **Constrain, Don't Dictate**: Provide structure while allowing creativity within boundaries
2. **Explicit Over Implicit**: Make all conventions and patterns visible to AI
3. **Composition Over Duplication**: Reuse layers and patterns across architectures
4. **AI-First Design**: Optimize for the Constraint-Context matrix comfort zone
5. **Minimal Templates**: Focus on structure and interfaces, not full implementations
6. **Progressive Enhancement**: Start simple, add complexity as needed

## 🤝 Contributing

We welcome contributions! Whether you want to:
- Add a new architecture pattern
- Enhance existing specifications
- Improve documentation
- Share your team's conventions

Check out our [Contributing Guide](CONTRIBUTING.md) to get started.

### 🌟 Good First Issues

- Add examples for common use cases
- Translate architectures to new languages/frameworks
- Improve AI guidance sections
- Add task decomposition templates

## 📊 Success Stories

> "After implementing these specifications, our AI-generated code went from 'needs major revision' to 'ready for review' 80% of the time." - *Engineering Team Lead*

> "The task templates are game-changers. Complex features that took hours of back-and-forth with AI now work on the first try." - *Senior Developer*

## 🗺️ Roadmap

- [x] Core schema and manifest structure
- [x] Controller-Service-Repository pattern (TypeScript/JavaScript)
- [x] Layer composition system
- [x] AI guidance with memories and conventions
- [x] Task decomposition templates
- [x] Multiple data access library support (Prisma, TypeORM, Knex)
- [ ] Clean Architecture pattern
- [ ] Validation CLI tool
- [ ] VS Code extension
- [ ] Architecture generator
- [ ] Multi-language support expansion
- [ ] Additional framework support (NestJS, Koa)

## 📖 Documentation

- [Getting Started](docs/getting-started.md)
- [Architecture Authoring Guide](docs/authoring.md)
- [AI Usage Best Practices](docs/ai-usage.md)
- [Schema Reference](docs/schema.md)
- [FAQ](docs/faq.md)

## 🤔 Why This Matters

As AI becomes a larger part of software development, the gap between "AI-generated" and "production-ready" code needs to shrink. This project aims to bridge that gap by giving AI the context and constraints it needs to write code that meets professional standards from the start.

## 📄 License

MIT © [Your Organization]

---

<p align="center">
  <b>Ready to make your AI coding assistant work better?</b><br>
  Star ⭐ this repo and start using architecture specifications today!
</p>

<p align="center">
  <a href="https://github.com/[org]/ai-architecture-specs/issues/new">Report Issue</a> •
  <a href="https://github.com/[org]/ai-architecture-specs/discussions">Join Discussion</a> •
  <a href="docs/examples.md">View Examples</a>
</p>