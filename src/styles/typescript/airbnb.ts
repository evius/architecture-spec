import type { StyleGuide } from '../../types/style.js';

export const airbnbTypeScriptStyle: StyleGuide = {
  name: 'Airbnb TypeScript Style Guide',
  language: 'typescript',
  description:
    'TypeScript style guide based on Airbnb JavaScript style guide with TypeScript-specific rules',

  rules: {
    // Naming Conventions
    naming: {
      files: 'kebab-case (e.g., user-service.ts)',
      classes: 'PascalCase (e.g., UserService)',
      interfaces: "PascalCase, no 'I' prefix (e.g., User, not IUser)",
      types: 'PascalCase (e.g., UserResponse)',
      functions: 'camelCase (e.g., getUserById)',
      constants: 'UPPER_SNAKE_CASE for true constants, camelCase for others',
      privateMembers: "Leading underscore discouraged, use 'private' keyword",
    },

    // Type Annotations
    types: {
      explicitReturnTypes: 'Required for public methods and exported functions',
      implicitAny: 'Forbidden - all parameters must have types',
      any: "Avoid 'any' - use 'unknown' or specific types",
      assertions: 'Avoid type assertions - prefer type guards',
      nonNullAssertion: "Avoid '!' - handle null/undefined explicitly",
    },

    // Code Organization
    imports: {
      order: [
        "Node built-ins (e.g., 'path', 'fs')",
        'External dependencies',
        'Internal dependencies (absolute paths)',
        'Relative imports (../)',
        "Type imports (using 'import type')",
      ],
      grouping: 'Separate groups with blank lines',
      typeImports: "Use 'import type' for type-only imports",
    },

    // Functions and Methods
    functions: {
      arrowFunctions: 'Prefer for callbacks and functional components',
      regularFunctions: 'Use for methods and standalone functions',
      asyncAwait: 'Prefer over promises and callbacks',
      parameters: 'Max 3 parameters - use options object for more',
    },

    // Classes
    classes: {
      memberOrdering: [
        'Static properties',
        'Static methods',
        'Instance properties',
        'Constructor',
        'Public methods',
        'Protected methods',
        'Private methods',
      ],
      accessModifiers: 'Explicit for all members',
      readonlyModifier: "Use for properties that shouldn't change",
    },

    // Error Handling
    errorHandling: {
      customErrors: 'Extend Error class for custom errors',
      errorTypes: 'Use specific error types, not generic Error',
      tryReturns: "Don't return inside try blocks if finally exists",
    },

    // Comments and Documentation
    documentation: {
      jsDoc: 'Required for all public APIs',
      inlineComments: "Explain 'why', not 'what'",
      todoComments: 'Include ticket number: // TODO(JIRA-123): ...',
    },
  },

  codeExamples: {
    goodNaming: `
// Good
export class UserService {
  private userRepository: UserRepository;
  
  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}

// Bad
export interface IUserService {
  get_user(ID: string): any;
}
    `,

    typeUsage: `
// Good
function processUser(user: User): UserDTO {
  return transformToDTO(user);
}

// Bad
function processUser(user: any): any {
  return user;
}
    `,

    errorHandling: `
// Good
export class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(\`\${resource} with id \${id} not found\`);
    this.name = 'NotFoundError';
  }
}

// Usage
if (!user) {
  throw new NotFoundError('User', userId);
}
    `,
  },

  linterConfig: {
    extends: ['airbnb-base', 'airbnb-typescript/base'],
    plugins: ['@typescript-eslint'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false,
          },
        },
      ],
      'max-len': [
        'error',
        {
          code: 100,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
    },
  },
};
