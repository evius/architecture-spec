import type { LayerSpec } from '../../types/architecture.js';

export const controllerLayerSpec: LayerSpec = {
  name: 'controller',
  purpose: 'Handle HTTP requests/responses, validation, and routing',

  responsibilities: [
    'Parse and validate request data',
    'Call appropriate service methods',
    'Transform service responses to HTTP responses',
    'Handle HTTP-specific errors (404, 401, etc.)',
    'Manage request/response lifecycle',
    'Apply middleware for cross-cutting concerns',
  ],

  restrictions: [
    'Must NOT contain business logic',
    'Must NOT directly access repositories or databases',
    'Must NOT handle business rule validation',
    'Must NOT manage transactions',
    'Must NOT contain complex data transformations',
  ],

  dependencies: {
    canImport: ['service', 'dto', 'validation', 'middleware'],
    cannotImport: ['repository', 'model', 'database', 'orm'],
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
        pattern: 'get{Resource}ById',
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
      {
        pattern: 'update{Resource}',
        parameters: '(req: Request, res: Response, next: NextFunction)',
        returnType: 'Promise<void>',
        async: true,
      },
      {
        pattern: 'delete{Resource}',
        parameters: '(req: Request, res: Response, next: NextFunction)',
        returnType: 'Promise<void>',
        async: true,
      },
    ],
  },

  conventions: {
    errorHandling: {
      pattern: 'try-catch-next',
      description: 'All controller methods should use try-catch blocks and pass errors to next()',
      example: `
        try {
          // controller logic
        } catch (error) {
          next(error);
        }
      `,
    },

    validation: {
      pattern: 'validate-first',
      description: 'Validate request data before passing to service layer',
      example: `
        const validatedData = validate{{ResourceName}}Input(req.body);
        const result = await this.service.create(validatedData);
      `,
    },

    responseFormat: {
      pattern: 'consistent-responses',
      description: 'Use consistent response formats across all endpoints',
      example: `
        res.status(200).json({ data: result });
        res.status(201).json({ data: created, message: 'Created successfully' });
        res.status(404).json({ error: 'Resource not found' });
      `,
    },
  },

  aiHints: [
    'Controllers are thin - they only orchestrate, not implement',
    'Use dependency injection for services',
    'Apply validation middleware or validate in method',
    'Return appropriate HTTP status codes',
    'Handle async errors with try-catch or async middleware',
    'Use TypeScript types for request/response objects',
  ],
};
