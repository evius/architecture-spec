import { Knex } from 'knex';
import { {{ResourceName}}Repository, FindOptions } from './{{resourceName}}.repository.interface';
import { {{ResourceName}} } from '../models/{{resourceName}}.model';

export class Knex{{ResourceName}}Repository implements {{ResourceName}}Repository {
  constructor(
    private knex: Knex,
    private tableName: string = '{{resourceName}}s'
  ) {}

  async findById(id: string): Promise<{{ResourceName}} | null> {
    const record = await this.knex(this.tableName)
      .where({ id })
      .first();
    
    return record ? this.toDomainModel(record) : null;
  }

  async findAll(options?: FindOptions<{{ResourceName}}>): Promise<{{ResourceName}}[]> {
    let query = this.knex(this.tableName);
    
    // Apply query options
    query = this.applyQueryOptions(query, options);
    
    const records = await query;
    return records.map(record => this.toDomainModel(record));
  }

  async findOne(criteria: Partial<{{ResourceName}}>): Promise<{{ResourceName}} | null> {
    const record = await this.knex(this.tableName)
      .where(criteria)
      .first();
    
    return record ? this.toDomainModel(record) : null;
  }

  async create(data: Partial<{{ResourceName}}>): Promise<{{ResourceName}}> {
    const [id] = await this.knex(this.tableName)
      .insert(data)
      .returning('id');
    
    // For databases that don't support RETURNING, fetch the created record
    const created = await this.findById(typeof id === 'object' ? id.id : id);
    
    if (!created) {
      throw new Error('Failed to create {{resourceName}}');
    }
    
    return created;
  }

  async update(id: string, data: Partial<{{ResourceName}}>): Promise<{{ResourceName}} | null> {
    const affected = await this.knex(this.tableName)
      .where({ id })
      .update(data);
    
    if (affected === 0) {
      return null;
    }
    
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const affected = await this.knex(this.tableName)
      .where({ id })
      .delete();
    
    return affected > 0;
  }

  async exists(criteria: Partial<{{ResourceName}}>): Promise<boolean> {
    const result = await this.knex(this.tableName)
      .where(criteria)
      .count('* as count')
      .first();
    
    return parseInt(result?.count || '0') > 0;
  }

  async count(criteria?: Partial<{{ResourceName}}>): Promise<number> {
    let query = this.knex(this.tableName)
      .count('* as count');
    
    if (criteria) {
      query = query.where(criteria);
    }
    
    const result = await query.first();
    return parseInt(result?.count || '0');
  }

  // Helper methods
  private toDomainModel(record: any): {{ResourceName}} {
    // Map database record to domain model
    return {
      id: record.id,
      // Map all fields from database record to domain model
      // Handle any data transformations needed
      // Convert snake_case to camelCase if necessary
      createdAt: record.created_at || record.createdAt,
      updatedAt: record.updated_at || record.updatedAt
    } as {{ResourceName}};
  }

  private applyQueryOptions(
    query: Knex.QueryBuilder,
    options?: FindOptions<{{ResourceName}}>
  ): Knex.QueryBuilder {
    // Apply where conditions
    if (options?.where) {
      query = query.where(options.where);
    }
    
    // Apply ordering
    if (options?.orderBy) {
      Object.entries(options.orderBy).forEach(([column, direction]) => {
        query = query.orderBy(column, direction);
      });
    }
    
    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.offset(options.offset);
    }
    
    // Apply relations (joins)
    if (options?.include && options.include.length > 0) {
      options.include.forEach(relation => {
        // Example: leftJoin for relations
        // Adjust based on your schema and naming conventions
        query = query.leftJoin(
          relation,
          `${this.tableName}.${relation}_id`,
          `${relation}.id`
        );
      });
    }
    
    return query;
  }

  // Transaction support
  async transaction<T>(
    callback: (trx: Knex.Transaction) => Promise<T>
  ): Promise<T> {
    return this.knex.transaction(callback);
  }
}