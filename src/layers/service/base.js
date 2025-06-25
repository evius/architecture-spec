export const serviceLayerSpec = {
    name: 'service',
    purpose: 'Implement business logic and orchestrate operations',
    responsibilities: [
        'Implement business rules and validation',
        'Orchestrate multiple repository calls',
        'Transform between entities and DTOs',
        'Handle business-level errors',
        'Manage transactions across repositories',
        'Implement caching strategies',
        'Coordinate with external services',
    ],
    restrictions: [
        'Must NOT handle HTTP concerns',
        'Must NOT contain SQL or database-specific code',
        'Must NOT depend on request/response objects',
        'Must NOT handle routing or middleware',
        'Must NOT directly return database entities',
    ],
    dependencies: {
        canImport: ['repository', 'model', 'dto', 'utils', 'external-services'],
        cannotImport: ['controller', 'http', 'express', 'request', 'response'],
    },
    interface: {
        methods: [
            {
                pattern: 'findById',
                parameters: '(id: string)',
                returnType: 'Promise<{Resource}DTO | null>',
                async: true,
            },
            {
                pattern: 'findAll',
                parameters: '(filters?: {Resource}Filters)',
                returnType: 'Promise<{Resource}DTO[]>',
                async: true,
            },
            {
                pattern: 'create',
                parameters: '(data: Create{Resource}DTO)',
                returnType: 'Promise<{Resource}DTO>',
                async: true,
            },
            {
                pattern: 'update',
                parameters: '(id: string, data: Update{Resource}DTO)',
                returnType: 'Promise<{Resource}DTO | null>',
                async: true,
            },
            {
                pattern: 'delete',
                parameters: '(id: string)',
                returnType: 'Promise<boolean>',
                async: true,
            },
        ],
    },
    conventions: {
        dtosOnly: {
            pattern: 'return-dtos',
            description: 'Services must return DTOs, never domain entities',
            example: `
        const entity = await this.repository.findById(id);
        return entity ? this.toDTO(entity) : null;
      `,
        },
        businessValidation: {
            pattern: 'validate-business-rules',
            description: 'Validate business rules before persistence',
            example: `
        if (await this.isDuplicateName(data.name)) {
          throw new BusinessError('Name already exists');
        }
      `,
        },
        transactionManagement: {
            pattern: 'service-transactions',
            description: 'Services manage transaction boundaries',
            example: `
        return this.unitOfWork.transaction(async (repos) => {
          const order = await repos.orders.create(orderData);
          await repos.inventory.decreaseStock(items);
          return this.toDTO(order);
        });
      `,
        },
    },
    aiHints: [
        "Services contain the 'why' of business logic",
        'Use repository interfaces, not concrete implementations',
        'Transform entities to DTOs before returning',
        'Throw business-specific exceptions for domain errors',
        'Services can call other services when needed',
        'Keep services focused on a single aggregate/domain',
        'Use dependency injection for all dependencies',
    ],
};
//# sourceMappingURL=base.js.map