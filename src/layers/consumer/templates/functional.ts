import { ProcessingContext, ProcessingResult } from '../types/queue.types';
import { {{QueueName}}Message } from '../types/{{queueName}}.types';
import { createJobHandler } from '../job-handler/job-handler';

// Create processing function for {{queueName}} messages
export const process{{QueueName}}Message = async (
  message: {{QueueName}}Message,
  context: ProcessingContext
): Promise<ProcessingResult> => {
  try {
    // Business logic for processing {{queueName}} messages
    const result = await handle{{QueueName}}Logic(message);
    
    return {
      success: true,
      result,
      metadata: {
        processingTime: context.processingTime,
        attempts: context.attempts,
      },
    };
  } catch (error) {
    const jobHandler = createJobHandler();
    return jobHandler.handleProcessingError(error, context);
  }
};

// Setup consumer with configuration
export const setup{{QueueName}}Consumer = async (
  config: {{QueueName}}Config
): Promise<void> => {
  const jobHandler = createJobHandler();
  
  await jobHandler.setupConsumer('{{queueName}}', {
    concurrency: config.concurrency || 1,
    retryAttempts: config.retryAttempts || 3,
    retryDelay: config.retryDelay || 1000,
    processor: process{{QueueName}}Message,
  });
};

// Business logic handler
const handle{{QueueName}}Logic = async (
  message: {{QueueName}}Message
): Promise<any> => {
  // Implement specific business logic here
  throw new Error('Implement {{queueName}} processing logic');
};

// Export consumer interface for consistency
export const {{queueName}}Consumer = {
  process: process{{QueueName}}Message,
  setup: setup{{QueueName}}Consumer,
};