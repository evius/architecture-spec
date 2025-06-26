import { QueueConsumer, ProcessingContext, ProcessingResult } from '../types/queue.types';
import { {{QueueName}}Message } from '../types/{{queueName}}.types';
import { JobHandler } from '../job-handler/job-handler';

export class {{QueueName}}Consumer implements QueueConsumer<{{QueueName}}Message> {
  constructor(
    private jobHandler: JobHandler,
    private config: {{QueueName}}Config
  ) {}

  async process{{QueueName}}Message(
    message: {{QueueName}}Message,
    context: ProcessingContext
  ): Promise<ProcessingResult> {
    try {
      // Business logic for processing {{queueName}} messages
      const result = await this.handle{{QueueName}}Logic(message);
      
      return {
        success: true,
        result,
        metadata: {
          processingTime: context.processingTime,
          attempts: context.attempts,
        },
      };
    } catch (error) {
      return this.jobHandler.handleProcessingError(error, context);
    }
  }

  async setup{{QueueName}}Consumer(): Promise<void> {
    // Configure queue consumer with specific settings
    await this.jobHandler.setupConsumer('{{queueName}}', {
      concurrency: this.config.concurrency || 1,
      retryAttempts: this.config.retryAttempts || 3,
      retryDelay: this.config.retryDelay || 1000,
      processor: this.process{{QueueName}}Message.bind(this),
    });
  }

  private async handle{{QueueName}}Logic(message: {{QueueName}}Message): Promise<any> {
    // Implement specific business logic here
    throw new Error('Implement {{queueName}} processing logic');
  }
}