import { {{ResourceName}} } from '../models/{{resourceName}}.model';

export interface {{ResourceName}}Repository {
  // Basic CRUD operations
  findById(id: string): Promise<{{ResourceName}} | null>;
  findAll(options?: FindOptions<{{ResourceName}}>): Promise<{{ResourceName}}[]>;
  findOne(criteria: Partial<{{ResourceName}}>): Promise<{{ResourceName}} | null>;
  create(data: Partial<{{ResourceName}}>): Promise<{{ResourceName}}>;
  update(id: string, data: Partial<{{ResourceName}}>): Promise<{{ResourceName}} | null>;
  delete(id: string): Promise<boolean>;
  
  // Utility methods
  exists(criteria: Partial<{{ResourceName}}>): Promise<boolean>;
  count(criteria?: Partial<{{ResourceName}}>): Promise<number>;
  
  // Add domain-specific query methods as needed
  // Examples:
  // findByEmail(email: string): Promise<{{ResourceName}} | null>;
  // findActive(): Promise<{{ResourceName}}[]>;
  // findByStatus(status: string): Promise<{{ResourceName}}[]>;
}

// Query options interface
export interface FindOptions<T> {
  where?: Partial<T>;
  orderBy?: {
    [K in keyof T]?: 'asc' | 'desc';
  };
  limit?: number;
  offset?: number;
  include?: string[];
}

// Base repository implementation hints
export abstract class Base{{ResourceName}}Repository implements {{ResourceName}}Repository {
  abstract findById(id: string): Promise<{{ResourceName}} | null>;
  abstract findAll(options?: FindOptions<{{ResourceName}}>): Promise<{{ResourceName}}[]>;
  abstract findOne(criteria: Partial<{{ResourceName}}>): Promise<{{ResourceName}} | null>;
  abstract create(data: Partial<{{ResourceName}}>): Promise<{{ResourceName}}>;
  abstract update(id: string, data: Partial<{{ResourceName}}>): Promise<{{ResourceName}} | null>;
  abstract delete(id: string): Promise<boolean>;
  
  async exists(criteria: Partial<{{ResourceName}}>): Promise<boolean> {
    const result = await this.findOne(criteria);
    return result !== null;
  }
  
  abstract count(criteria?: Partial<{{ResourceName}}>): Promise<number>;
}