export const repositoryLayerSpec = {
    name: 'repository',
    purpose: 'Abstract data access and persistence',
    responsibilities: [
        'CRUD operations on entities',
        'Database-specific query logic',
        'Data mapping between database and entities',
        'Transaction handling',
        'Query optimization and performance',
        'Database connection management',
        'Implement repository interfaces',
    ],
    restrictions: [
        'Must NOT contain business logic',
        'Must NOT handle HTTP concerns',
        'Must NOT call services',
        'Must NOT handle authentication/authorization',
        'Must NOT transform to DTOs',
    ],
    dependencies: {
        canImport: ['model', 'database', 'orm', 'query-builder'],
        cannotImport: ['controller', 'service', 'http', 'dto', 'validation'],
    },
    interface: {
        methods: [
            {
                pattern: 'findById',
                parameters: '(id: string)',
                returnType: 'Promise<{Resource} | null>',
                async: true,
            },
            {
                pattern: 'findAll',
                parameters: '(options?: FindOptions)',
                returnType: 'Promise<{Resource}[]>',
                async: true,
            },
            {
                pattern: 'findOne',
                parameters: '(criteria: Partial<{Resource}>)',
                returnType: 'Promise<{Resource} | null>',
                async: true,
            },
            {
                pattern: 'create',
                parameters: '(data: Partial<{Resource}>)',
                returnType: 'Promise<{Resource}>',
                async: true,
            },
            {
                pattern: 'update',
                parameters: '(id: string, data: Partial<{Resource}>)',
                returnType: 'Promise<{Resource} | null>',
                async: true,
            },
            {
                pattern: 'delete',
                parameters: '(id: string)',
                returnType: 'Promise<boolean>',
                async: true,
            },
            {
                pattern: 'exists',
                parameters: '(criteria: Partial<{Resource}>)',
                returnType: 'Promise<boolean>',
                async: true,
            },
        ],
    },
    conventions: {
        returnEntities: {
            pattern: 'return-domain-entities',
            description: 'Repositories return domain entities, not raw database records',
            example: `
        const record = await this.db.findOne({ id });
        return record ? this.toDomainEntity(record) : null;
      `,
        },
        interfaceFirst: {
            pattern: 'define-interface',
            description: 'Always define repository interface before implementation',
            example: `
        export interface UserRepository {
          findById(id: string): Promise<User | null>;
          // ... other methods
        }
      `,
        },
        queryMethods: {
            pattern: 'specific-queries',
            description: 'Create specific query methods for complex finds',
            example: `
        findActiveUsersByRole(role: string): Promise<User[]> {
          return this.db.find({ role, status: 'active' });
        }
      `,
        },
    },
    aiHints: [
        "Repositories handle the 'how' of data persistence",
        'Return domain entities, not database-specific objects',
        'Use repository pattern to abstract ORM/database',
        'Keep repositories focused on a single aggregate',
        'Implement both interface and concrete class',
        'Handle database errors and convert to domain errors',
        'Use query builders for complex queries',
        'Optimize queries (e.g., select specific fields, joins)',
    ],
};
//# sourceMappingURL=base.js.map