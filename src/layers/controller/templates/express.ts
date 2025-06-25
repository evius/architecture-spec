import { Request, Response, NextFunction } from 'express';
import { {{ResourceName}}Service } from '../services/{{resourceName}}.service';
import { validate{{ResourceName}}Input, validate{{ResourceName}}Update } from '../validation/{{resourceName}}.validation';

export class {{ResourceName}}Controller {
  constructor(private {{resourceName}}Service: {{ResourceName}}Service) {}

  async get{{ResourceName}}List(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query; // Apply validation/transformation as needed
      const results = await this.{{resourceName}}Service.findAll(filters);
      
      res.json({
        data: results,
        count: results.length
      });
    } catch (error) {
      next(error);
    }
  }

  async get{{ResourceName}}ById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.{{resourceName}}Service.findById(id);
      
      if (!result) {
        res.status(404).json({ error: '{{ResourceName}} not found' });
        return;
      }
      
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async create{{ResourceName}}(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = validate{{ResourceName}}Input(req.body);
      const result = await this.{{resourceName}}Service.create(validatedData);
      
      res.status(201).json({
        data: result,
        message: '{{ResourceName}} created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async update{{ResourceName}}(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = validate{{ResourceName}}Update(req.body);
      const result = await this.{{resourceName}}Service.update(id, validatedData);
      
      if (!result) {
        res.status(404).json({ error: '{{ResourceName}} not found' });
        return;
      }
      
      res.json({
        data: result,
        message: '{{ResourceName}} updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async delete{{ResourceName}}(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.{{resourceName}}Service.delete(id);
      
      if (!success) {
        res.status(404).json({ error: '{{ResourceName}} not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

// Route registration helper
export function register{{ResourceName}}Routes(router: any, controller: {{ResourceName}}Controller): void {
  router.get('/{{resourceNamePlural}}', controller.get{{ResourceName}}List.bind(controller));
  router.get('/{{resourceNamePlural}}/:id', controller.get{{ResourceName}}ById.bind(controller));
  router.post('/{{resourceNamePlural}}', controller.create{{ResourceName}}.bind(controller));
  router.put('/{{resourceNamePlural}}/:id', controller.update{{ResourceName}}.bind(controller));
  router.delete('/{{resourceNamePlural}}/:id', controller.delete{{ResourceName}}.bind(controller));
}