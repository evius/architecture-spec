export const sharedRules = [
    // Dependency Rules
    {
        id: 'no-circular-dependencies',
        layer: '*',
        rule: 'No circular dependencies between modules or layers',
        severity: 'error',
        category: 'dependency',
    },
    {
        id: 'dependency-direction',
        layer: '*',
        rule: 'Dependencies must flow in one direction: Controller → Service → Repository',
        severity: 'error',
        category: 'dependency',
    },
    {
        id: 'interface-dependencies',
        layer: '*',
        rule: 'Depend on interfaces/abstractions, not concrete implementations',
        severity: 'warning',
        category: 'dependency',
    },
    // Error Handling Rules
    {
        id: 'explicit-error-handling',
        layer: '*',
        rule: 'All async operations must have explicit error handling',
        severity: 'error',
        category: 'error-handling',
    },
    {
        id: 'custom-error-types',
        layer: '*',
        rule: 'Use custom error types for different error scenarios',
        severity: 'warning',
        category: 'error-handling',
    },
    {
        id: 'no-catch-all',
        layer: '*',
        rule: 'Avoid catch-all error handlers that hide specific errors',
        severity: 'warning',
        category: 'error-handling',
    },
    // Security Rules
    {
        id: 'no-hardcoded-secrets',
        layer: '*',
        rule: 'Never hardcode secrets, API keys, or passwords',
        severity: 'error',
        category: 'security',
    },
    {
        id: 'input-validation',
        layer: 'controller',
        rule: 'Validate all input data before processing',
        severity: 'error',
        category: 'security',
    },
    {
        id: 'sql-injection-prevention',
        layer: 'repository',
        rule: 'Use parameterized queries or ORM methods to prevent SQL injection',
        severity: 'error',
        category: 'security',
    },
    // Testing Rules
    {
        id: 'unit-test-coverage',
        layer: 'service',
        rule: 'Service layer must have at least 80% test coverage',
        severity: 'warning',
        category: 'testing',
    },
    {
        id: 'mock-external-dependencies',
        layer: '*',
        rule: 'Mock all external dependencies in unit tests',
        severity: 'warning',
        category: 'testing',
    },
    // Code Quality Rules
    {
        id: 'no-magic-numbers',
        layer: '*',
        rule: 'Use named constants instead of magic numbers',
        severity: 'warning',
        category: 'code-quality',
    },
    {
        id: 'single-responsibility',
        layer: '*',
        rule: 'Each class/function should have a single, well-defined responsibility',
        severity: 'warning',
        category: 'code-quality',
    },
    {
        id: 'max-file-length',
        layer: '*',
        rule: 'Files should not exceed 300 lines of code',
        severity: 'warning',
        category: 'code-quality',
    },
    // Documentation Rules
    {
        id: 'public-api-documentation',
        layer: '*',
        rule: 'All public methods and classes must have JSDoc comments',
        severity: 'warning',
        category: 'documentation',
    },
    {
        id: 'complex-logic-comments',
        layer: '*',
        rule: 'Complex business logic must have explanatory comments',
        severity: 'info',
        category: 'documentation',
    },
];
// Layer-specific rule overrides
export const layerRules = {
    controller: [
        {
            id: 'http-status-codes',
            layer: 'controller',
            rule: 'Use appropriate HTTP status codes for responses',
            severity: 'error',
            category: 'http',
        },
        {
            id: 'no-business-logic',
            layer: 'controller',
            rule: 'Controllers must not contain business logic',
            severity: 'error',
            category: 'separation-of-concerns',
        },
    ],
    service: [
        {
            id: 'transaction-boundaries',
            layer: 'service',
            rule: 'Services define transaction boundaries',
            severity: 'error',
            category: 'data-integrity',
        },
        {
            id: 'dto-returns',
            layer: 'service',
            rule: 'Services must return DTOs, not domain entities',
            severity: 'error',
            category: 'data-transfer',
        },
    ],
    repository: [
        {
            id: 'no-business-logic',
            layer: 'repository',
            rule: 'Repositories must not contain business logic',
            severity: 'error',
            category: 'separation-of-concerns',
        },
        {
            id: 'entity-returns',
            layer: 'repository',
            rule: 'Repositories return domain entities, not raw database records',
            severity: 'error',
            category: 'data-transfer',
        },
    ],
};
//# sourceMappingURL=shared-rules.js.map