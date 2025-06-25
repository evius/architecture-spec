// Schema for AI Agent Code Architecture Specifications

// Main project configuration that lives in each project
export interface ProjectConfig {
  project: string;
  components: {
    [componentName: string]: ComponentConfig;
  };
}

export interface ComponentConfig {
  language: 'nodejs' | 'typescript' | 'python' | 'java';
  framework: string;
  architecture: string; // References architecture ID in central repo
  architectureOptions?: {
    [optionKey: string]: string;
  };
  dataAccess?: string;
  naming?: NamingConventions;
  fileStructure?: FileStructureConfig;
}

export interface NamingConventions {
  controllers?: string; // e.g., "{resource}Controller"
  services?: string; // e.g., "{resource}Service"
  repositories?: string; // e.g., "{resource}Repository"
  models?: string; // e.g., "{resource}Model"
  interfaces?: string; // e.g., "I{resource}"
}

export interface FileStructureConfig {
  root: string; // e.g., "src"
  pattern: 'domain-grouped' | 'layer-grouped' | 'feature-grouped';
  // domain-grouped: /users/user.controller.ts, /users/user.service.ts
  // layer-grouped: /controllers/user.controller.ts, /services/user.service.ts
  // feature-grouped: /features/users/...
}

// Architecture specification that lives in central repository
export interface ArchitectureSpec {
  id: string;
  name: string;
  description: string;
  base: BaseArchitecture;
  options?: ArchitectureOptions;
  layers: LayerSpec[];
  templates: Templates;
  rules: ArchitectureRules;
  style?: StyleGuideReference;
  aiGuidance: AIGuidance;
  taskTemplates?: TaskTemplate[];
}

export interface BaseArchitecture {
  layers: string[]; // e.g., ["controller", "service", "repository"]
  dependencyFlow: 'unidirectional' | 'bidirectional';
  errorHandling: 'per-layer' | 'centralized-middleware' | 'hybrid';
}

export interface ArchitectureOptions {
  [optionKey: string]: {
    choices: string[];
    default: string;
    description: string;
  };
}

export interface LayerSpec {
  name: string;
  purpose: string;
  responsibilities: string[];
  restrictions: string[]; // What this layer must NOT do
  dependencies: {
    canImport: string[]; // Which layers this can import from
    cannotImport: string[]; // Explicit restrictions
  };
  interface?: InterfaceSpec;
  conventions?: {
    [key: string]: {
      pattern: string;
      description: string;
      example?: string;
    };
  };
  aiHints?: string[];
}

export interface InterfaceSpec {
  // Defines the contract/interface between layers
  methods?: MethodPattern[];
  returnTypes?: string;
  errorHandling?: string;
}

export interface MethodPattern {
  pattern: string; // e.g., "get{Resource}ById"
  parameters: string;
  returnType: string;
  async: boolean;
}

export interface Templates {
  [layerName: string]: LayerTemplate;
}

export interface LayerTemplate {
  fileNamePattern: string; // e.g., "{resource}.controller.ts"
  template: string; // The actual template content with placeholders
  contextHints?: string[]; // Hints about where to find examples or patterns
  constraints?: string[]; // Explicit constraints for this layer
  imports?: ImportTemplate[];
  dataAccessVariants?: {
    [dataAccessType: string]: string; // Different templates per ORM/database
  };
}

export interface ImportTemplate {
  condition?: string; // When to include this import
  statement: string;
}

export interface ArchitectureRules {
  required: Rule[];
  forbidden: Rule[];
  conventions: Convention[];
}

export interface Rule {
  id?: string;
  layer: string;
  rule: string;
  severity: 'error' | 'warning' | 'info';
  category?: string;
}

export interface Convention {
  aspect: 'naming' | 'structure' | 'patterns' | 'dependencies';
  description: string;
  examples?: string[];
}

export interface StyleGuideReference {
  language: string;
  guide: 'airbnb' | 'standard' | 'google' | 'custom';
  customRules?: string[]; // Additional rules or overrides
  lintConfig?: string; // Reference to .eslintrc or similar
}

// Example usage for validation
export type ArchitectureRepository = {
  [architectureId: string]: ArchitectureSpec;
};

// AI Guidance - helps move tasks into the AI's "comfort zone"
export interface AIGuidance {
  memories: string[]; // Always-available context for AI agents
  conventions: string[]; // Coding conventions to follow
  preferredLibraries: {
    [useCase: string]: string; // e.g., "caching": "redis", "validation": "joi"
  };
  antiPatterns: string[]; // Common mistakes to avoid
  examplePaths?: {
    [pattern: string]: string; // e.g., "error-handling": "/src/users/user.controller.ts"
  };
}

// Task decomposition templates for common operations
export interface TaskTemplate {
  id: string;
  taskType: string; // e.g., "add-crud-endpoint", "add-caching-layer"
  description: string;
  steps: TaskStep[];
  constraints: string[]; // Additional constraints for this task type
  requiredContext: string[]; // What context the AI needs
}

export interface TaskStep {
  order: number;
  description: string;
  layer: string; // Which layer this step affects
  template?: string; // Optional template for this step
  validation?: string; // How to verify this step is complete
}
