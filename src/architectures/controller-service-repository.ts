import type { ArchitectureSpec } from '../types/architecture.js';

export const controllerServiceRepositorySpec: ArchitectureSpec = {
  id: 'controller-service-repository',
  name: 'Controller-Service-Repository Pattern',
  description: 'Clean separation of HTTP handling, business logic, and data access',

  base: {
    layers: ['controller', 'service', 'repository'],
    dependencyFlow: 'unidirectional',
    errorHandling: 'per-layer',
  },

  options: {
    servicePattern: {
      choices: ['class', 'functional'],
      default: 'class',
      description: 'How services are structured',
    },
    repositoryReturns: {
      choices: ['entity', 'dto', 'either'],
      default: 'entity',
      description: 'What repositories return - entities, DTOs, or either based on method',
    },
  },

  layers: [
    {
      name: 'controller',
      purpose: 'Handle HTTP requests/responses, validation, and routing',
      responsibilities: [
        'Parse and validate request data',
        'Call appropriate service methods',
        'Transform service responses to HTTP responses',
        'Handle HTTP-specific errors (404, 401, etc.)',
      ],
      restrictions: [
        'Must NOT contain business logic',
        'Must NOT directly access repositories or databases',
        'Must NOT handle business rule validation',
      ],
      dependencies: {
        canImport: ['service', 'dto', 'validation'],
        cannotImport: ['repository', 'model', 'database'],
      },
      interface: {
        methods: [
          {
            pattern: 'get{Resource}',
            parameters: '(req: Request, res: Response, next: NextFunction)',
            returnType: 'Promise<void>',
            async: true,
          },
          {
            pattern: 'create{Resource}',
            parameters: '(req: Request, res: Response, next: NextFunction)',
            returnType: 'Promise<void>',
            async: true,
          },
        ],
      },
    },
    {
      name: 'service',
      purpose: 'Implement business logic and orchestrate operations',
      responsibilities: [
        'Implement business rules and validation',
        'Orchestrate multiple repository calls',
        'Transform between entities and DTOs',
        'Handle business-level errors',
      ],
      restrictions: [
        'Must NOT handle HTTP concerns',
        'Must NOT contain SQL or database-specific code',
        'Must NOT depend on request/response objects',
      ],
      dependencies: {
        canImport: ['repository', 'model', 'dto'],
        cannotImport: ['controller', 'http', 'express'],
      },
    },
    {
      name: 'repository',
      purpose: 'Abstract data access and persistence',
      responsibilities: [
        'CRUD operations on entities',
        'Database-specific query logic',
        'Data mapping between database and entities',
        'Transaction handling',
      ],
      restrictions: [
        'Must NOT contain business logic',
        'Must NOT handle HTTP concerns',
        'Must NOT call services',
      ],
      dependencies: {
        canImport: ['model', 'database'],
        cannotImport: ['controller', 'service', 'http'],
      },
    },
  ],

  templates: {
    controller: {
      fileNamePattern: '{resource}.controller.ts',
      template: `import { Request, Response, NextFunction } from 'express';
import { {{ResourceName}}Service } from '../services/{{resourceName}}.service';
import { validate{{ResourceName}}Input } from '../validation/{{resourceName}}.validation';

export class {{ResourceName}}Controller {
  constructor(private {{resourceName}}Service: {{ResourceName}}Service) {}

  async get{{ResourceName}}ById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.{{resourceName}}Service.findById(id);
      
      if (!result) {
        res.status(404).json({ error: '{{ResourceName}} not found' });
        return;
      }
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async create{{ResourceName}}(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = validate{{ResourceName}}Input(req.body);
      const result = await this.{{resourceName}}Service.create(validatedData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}`,
      contextHints: [
        'Check /src/users/user.controller.ts for error handling patterns',
        'See /shared/middleware/validation.ts for validation middleware',
      ],
      constraints: [
        'Controllers must not contain business logic',
        'Always validate input data before passing to service',
        'Use middleware for cross-cutting concerns',
      ],
      imports: [
        {
          condition: 'always',
          statement: "import { Request, Response, NextFunction } from 'express';",
        },
      ],
    },

    service: {
      fileNamePattern: '{resource}.service.ts',
      template: `import { {{ResourceName}}Repository } from '../repositories/{{resourceName}}.repository';
import { Create{{ResourceName}}DTO, {{ResourceName}}DTO } from '../dto/{{resourceName}}.dto';
import { {{ResourceName}} } from '../models/{{resourceName}}.model';

export class {{ResourceName}}Service {
  constructor(private {{resourceName}}Repository: {{ResourceName}}Repository) {}

  async findById(id: string): Promise<{{ResourceName}}DTO | null> {
    const entity = await this.{{resourceName}}Repository.findById(id);
    return entity ? this.toDTO(entity) : null;
  }

  async create(data: Create{{ResourceName}}DTO): Promise<{{ResourceName}}DTO> {
    // Business logic validation here
    const entity = await this.{{resourceName}}Repository.create(data);
    return this.toDTO(entity);
  }

  private toDTO(entity: {{ResourceName}}): {{ResourceName}}DTO {
    // Transform entity to DTO
    return {
      id: entity.id,
      // ... map other fields
    };
  }
}`,
    },

    repository: {
      fileNamePattern: '{resource}.repository.ts',
      template: `import { {{ResourceName}} } from '../models/{{resourceName}}.model';

export interface {{ResourceName}}Repository {
  findById(id: string): Promise<{{ResourceName}} | null>;
  create(data: Partial<{{ResourceName}}>): Promise<{{ResourceName}}>;
  update(id: string, data: Partial<{{ResourceName}}>): Promise<{{ResourceName}} | null>;
  delete(id: string): Promise<boolean>;
}`,

      dataAccessVariants: {
        prisma: `import { PrismaClient } from '@prisma/client';
import { {{ResourceName}}Repository } from './{{resourceName}}.repository.interface';

export class Prisma{{ResourceName}}Repository implements {{ResourceName}}Repository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.{{resourceName}}.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.{{resourceName}}.create({ data });
  }
}`,

        typeorm: `import { Repository } from 'typeorm';
import { {{ResourceName}} } from '../models/{{resourceName}}.model';
import { {{ResourceName}}Repository } from './{{resourceName}}.repository.interface';

export class TypeOrm{{ResourceName}}Repository implements {{ResourceName}}Repository {
  constructor(private repository: Repository<{{ResourceName}}>) {}

  async findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<{{ResourceName}}>) {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }
}`,
      },
    },
  },

  rules: {
    required: [
      {
        layer: 'controller',
        rule: 'All endpoints must have error handling via try-catch or error middleware',
        severity: 'error',
      },
      {
        layer: 'service',
        rule: 'Services must not expose database entities directly; use DTOs',
        severity: 'error',
      },
      {
        layer: 'repository',
        rule: 'Repositories must return domain entities, not database records',
        severity: 'error',
      },
    ],
    forbidden: [
      {
        layer: 'controller',
        rule: 'Controllers must not import database libraries or ORM entities',
        severity: 'error',
      },
      {
        layer: 'service',
        rule: 'Services must not import Express or HTTP libraries',
        severity: 'error',
      },
    ],
    conventions: [
      {
        aspect: 'naming',
        description: 'Use consistent suffixes: Controller, Service, Repository',
        examples: ['UserController', 'UserService', 'UserRepository'],
      },
      {
        aspect: 'structure',
        description: 'Group files by feature/domain, not by layer',
        examples: ['/users/user.controller.ts', '/users/user.service.ts'],
      },
    ],
  },

  style: {
    language: 'typescript',
    guide: 'airbnb',
    customRules: [
      'Use explicit return types for all public methods',
      'Prefer interfaces over concrete types for dependencies',
      'Use dependency injection for better testability',
    ],
  },

  aiGuidance: {
    memories: [
      'This codebase uses dependency injection via constructor parameters',
      'All async operations must have proper error handling',
      'DTOs are used for API contracts, never expose domain entities directly',
      'Use existing validation utilities from /shared/validation',
      'Database transactions should be handled at the service layer',
    ],
    conventions: [
      'File names use kebab-case, class names use PascalCase',
      'Group related files by feature/domain, not by technical layer',
      'Every public method needs JSDoc comments',
      'Use async/await instead of promises or callbacks',
    ],
    preferredLibraries: {
      validation: 'joi',
      caching: 'redis with ioredis client',
      logging: 'winston',
      testing: 'jest with supertest for e2e',
      'date-handling': 'date-fns',
    },
    antiPatterns: [
      "Don't use 'any' type - always provide proper types",
      'Avoid nested ternary operators',
      "Don't mix business logic into controllers",
      'Never access the database directly from controllers',
      'Avoid circular dependencies between layers',
    ],
    examplePaths: {
      'error-handling': '/src/users/user.controller.ts',
      validation: '/src/products/validation/product.validation.ts',
      'repository-pattern': '/src/orders/order.repository.ts',
      'service-tests': '/src/users/__tests__/user.service.test.ts',
    },
  },

  taskTemplates: [
    {
      id: 'add-crud-endpoint',
      taskType: 'crud-implementation',
      description: 'Add a complete CRUD endpoint for a resource',
      steps: [
        {
          order: 1,
          description: 'Create the DTO interfaces for request/response',
          layer: 'dto',
          template: 'export interface Create{{ResourceName}}DTO { ... }',
          validation: 'DTOs should validate all required fields',
        },
        {
          order: 2,
          description: 'Create validation schemas using Joi',
          layer: 'validation',
          validation: 'Schema should match DTO structure',
        },
        {
          order: 3,
          description: 'Implement repository interface and data access',
          layer: 'repository',
          validation: 'All CRUD operations implemented',
        },
        {
          order: 4,
          description: 'Implement service layer with business logic',
          layer: 'service',
          validation: 'Service handles all business rules',
        },
        {
          order: 5,
          description: 'Create controller endpoints',
          layer: 'controller',
          validation: 'All HTTP methods properly handled',
        },
        {
          order: 6,
          description: 'Add unit tests for service layer',
          layer: 'service',
          validation: '80% code coverage minimum',
        },
      ],
      constraints: [
        'Follow RESTful conventions for routes',
        'Include proper OpenAPI documentation',
        'Implement pagination for list endpoints',
      ],
      requiredContext: [
        'Existing DTO patterns in the codebase',
        'Current validation approach',
        'Error handling middleware setup',
      ],
    },
  ],
};
