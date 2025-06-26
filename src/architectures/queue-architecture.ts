import type { ArchitectureSpec } from '../types/architecture.js';

// Import layer definitions
import { consumerLayer } from '../layers/consumer/base.js';
import { queueManagerLayer } from '../layers/queue-manager/base.js';
import { jobHandlerLayer } from '../layers/job-handler/base.js';

export const queueArchitectureSpec: ArchitectureSpec = {
  id: 'queue-architecture',
  name: 'Queue Architecture with Scheduling',
  description: 'Simple queues with scheduling, concurrency options, and centralized job handling',

  base: {
    layers: ['consumer', 'queue-manager', 'job-handler'],
    dependencyFlow: 'unidirectional',
    errorHandling: 'per-layer',
  },

  options: {
    queueBackend: {
      choices: ['bullmq', 'pg-boss', 'aws-sqs', 'rabbitmq', 'memory'],
      default: 'bullmq',
      description: 'Queue implementation backend',
    },
    consumerPattern: {
      choices: ['class', 'functional'],
      default: 'class',
      description: 'How consumers are structured',
    },
    concurrencyModel: {
      choices: ['per-queue', 'global', 'hybrid'],
      default: 'per-queue',
      description: 'How concurrency is managed across queues',
    },
    persistenceLevel: {
      choices: ['memory', 'redis', 'postgres', 'database'],
      default: 'redis',
      description: 'How queue data and jobs are persisted',
    },
    errorHandling: {
      choices: ['per-consumer', 'centralized-handler', 'hybrid'],
      default: 'hybrid',
      description: 'How errors are handled across the queue system',
    },
  },

  // Compose architecture from external layer definitions
  layers: [consumerLayer, queueManagerLayer, jobHandlerLayer],

  templates: {
    consumer: {
      fileNamePattern: '{queueName}.consumer.ts',
      template: `import { QueueConsumer, ProcessingContext, ProcessingResult } from '../types/queue.types';
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
}`,
      contextHints: [
        'Check existing consumers for error handling patterns',
        'See queue configuration examples in config/',
        'Review job processing utilities in job-handler layer',
        'Backend-specific examples in templates/backends/',
      ],
      dataAccessVariants: {
        bullmq: `import { QueueConsumer, ProcessingContext, ProcessingResult } from '../types/queue.types';
import { {{QueueName}}Message } from '../types/{{queueName}}.types';
import { Worker } from 'bullmq';

export class {{QueueName}}BullMQConsumer implements QueueConsumer<{{QueueName}}Message> {
  private worker: Worker;

  constructor(private config: {{QueueName}}Config) {}

  async setup{{QueueName}}Consumer(): Promise<void> {
    this.worker = new Worker('{{queueName}}', async (job) => {
      const context: ProcessingContext = {
        jobId: job.id,
        queueName: '{{queueName}}',
        attempts: job.attemptsMade,
        processingTime: Date.now(),
      };
      return this.process{{QueueName}}Message(job.data, context);
    }, {
      connection: this.config.redis,
      concurrency: this.config.concurrency || 1,
    });
  }

  async process{{QueueName}}Message(
    message: {{QueueName}}Message,
    context: ProcessingContext
  ): Promise<ProcessingResult> {
    // Implementation
  }
}`,
        'pg-boss': `import { QueueConsumer, ProcessingContext, ProcessingResult } from '../types/queue.types';
import { {{QueueName}}Message } from '../types/{{queueName}}.types';
import PgBoss from 'pg-boss';

export class {{QueueName}}PgBossConsumer implements QueueConsumer<{{QueueName}}Message> {
  constructor(
    private boss: PgBoss,
    private config: {{QueueName}}Config
  ) {}

  async setup{{QueueName}}Consumer(): Promise<void> {
    await this.boss.work('{{queueName}}', 
      { teamSize: this.config.concurrency || 1 },
      async (job) => {
        const context: ProcessingContext = {
          jobId: job.id,
          queueName: '{{queueName}}',
          attempts: job.retryCount || 0,
          processingTime: Date.now(),
        };
        const result = await this.process{{QueueName}}Message(job.data, context);
        if (!result.success) {
          throw new Error(result.error || 'Processing failed');
        }
        return result.result;
      }
    );
  }

  async process{{QueueName}}Message(
    message: {{QueueName}}Message,
    context: ProcessingContext
  ): Promise<ProcessingResult> {
    // Implementation
  }
}`,
        'aws-sqs': `import { QueueConsumer, ProcessingContext, ProcessingResult } from '../types/queue.types';
import { {{QueueName}}Message } from '../types/{{queueName}}.types';
import { Consumer } from 'sqs-consumer';
import AWS from 'aws-sdk';

export class {{QueueName}}SQSConsumer implements QueueConsumer<{{QueueName}}Message> {
  private consumer: Consumer;
  private sqs: AWS.SQS;

  constructor(private config: {{QueueName}}Config) {
    this.sqs = new AWS.SQS(this.config.aws);
  }

  async setup{{QueueName}}Consumer(): Promise<void> {
    this.consumer = Consumer.create({
      queueUrl: this.config.queueUrl,
      handleMessage: async (message) => {
        const context: ProcessingContext = {
          jobId: message.MessageId,
          queueName: '{{queueName}}',
          attempts: Number(message.Attributes?.ApproximateReceiveCount || 1) - 1,
          processingTime: Date.now(),
        };
        const data = JSON.parse(message.Body || '{}');
        return this.process{{QueueName}}Message(data, context);
      },
      sqs: this.sqs,
      batchSize: this.config.concurrency || 1,
    });

    this.consumer.start();
  }

  async process{{QueueName}}Message(
    message: {{QueueName}}Message,
    context: ProcessingContext
  ): Promise<ProcessingResult> {
    // Implementation
  }
}`,
        rabbitmq: `import { QueueConsumer, ProcessingContext, ProcessingResult } from '../types/queue.types';
import { {{QueueName}}Message } from '../types/{{queueName}}.types';
import amqp from 'amqplib';

export class {{QueueName}}RabbitMQConsumer implements QueueConsumer<{{QueueName}}Message> {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private config: {{QueueName}}Config) {}

  async setup{{QueueName}}Consumer(): Promise<void> {
    this.connection = await amqp.connect(this.config.amqpUrl);
    this.channel = await this.connection.createChannel();
    
    await this.channel.assertQueue('{{queueName}}', {
      durable: true,
    });
    
    await this.channel.prefetch(this.config.concurrency || 1);
    
    await this.channel.consume('{{queueName}}', async (msg) => {
      if (!msg) return;
      
      const context: ProcessingContext = {
        jobId: msg.properties.messageId || 'unknown',
        queueName: '{{queueName}}',
        attempts: msg.fields.deliveryTag - 1,
        processingTime: Date.now(),
      };
      
      try {
        const data = JSON.parse(msg.content.toString());
        const result = await this.process{{QueueName}}Message(data, context);
        
        if (result.success) {
          this.channel.ack(msg);
        } else {
          this.channel.nack(msg, false, result.shouldRetry);
        }
      } catch (error) {
        this.channel.nack(msg, false, true);
      }
    });
  }

  async process{{QueueName}}Message(
    message: {{QueueName}}Message,
    context: ProcessingContext
  ): Promise<ProcessingResult> {
    // Implementation
  }
}`,
      },
      constraints: [
        'Consumers must implement the QueueConsumer interface',
        'All processing methods must be async and return ProcessingResult',
        'Error handling should delegate to JobHandler utilities',
      ],
      imports: [
        {
          condition: 'always',
          statement:
            "import { QueueConsumer, ProcessingContext, ProcessingResult } from '../types/queue.types';",
        },
        {
          condition: 'class',
          statement: "import { JobHandler } from '../job-handler/job-handler';",
        },
      ],
    },

    'consumer-functional': {
      fileNamePattern: '{queueName}.consumer.ts',
      template: `import { ProcessingContext, ProcessingResult } from '../types/queue.types';
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
};`,
      contextHints: [
        'Functional pattern uses pure functions and explicit dependencies',
        'Check functional patterns in /src/utils/functional',
        'Error handling uses functional composition',
      ],
      constraints: [
        'All functions must be pure and return consistent types',
        'Use function composition for complex operations',
        'Avoid mutable state in processing functions',
      ],
    },

    'queue-manager': {
      fileNamePattern: 'queue-manager.ts',
      template: `import { Queue, QueueConfig, QueueMetrics } from '../types/queue.types';
import { QueueBackend } from '../adapters/queue-backend';
import { MonitoringService } from '../services/monitoring.service';

export class QueueManager {
  private queues: Map<string, Queue> = new Map();
  
  constructor(
    private backend: QueueBackend,
    private monitoring: MonitoringService
  ) {}

  async createQueue(name: string, config: QueueConfig): Promise<Queue> {
    const queue = await this.backend.createQueue(name, {
      ...config,
      onReady: () => this.monitoring.recordQueueReady(name),
      onError: (error) => this.monitoring.recordQueueError(name, error),
    });

    this.queues.set(name, queue);
    return queue;
  }

  async getQueueMetrics(queueName: string): Promise<QueueMetrics> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(\`Queue \${queueName} not found\`);
    }

    return {
      name: queueName,
      waiting: await queue.getWaitingCount(),
      active: await queue.getActiveCount(),
      completed: await queue.getCompletedCount(),
      failed: await queue.getFailedCount(),
      delayed: await queue.getDelayedCount(),
    };
  }

  async pauseQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (queue) {
      await queue.pause();
      this.monitoring.recordQueuePaused(queueName);
    }
  }

  async resumeQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (queue) {
      await queue.resume();
      this.monitoring.recordQueueResumed(queueName);
    }
  }

  async getActiveQueues(): Promise<string[]> {
    return Array.from(this.queues.keys());
  }
}`,
      contextHints: [
        'Queue manager is infrastructure-focused',
        'Check monitoring patterns in /shared/monitoring',
        'Backend adapters handle queue-specific implementations',
      ],
      dataAccessVariants: {
        bullmq: `import { Queue, QueueMetrics } from 'bullmq';
import { QueueConfig } from '../types/queue.types';
import { MonitoringService } from '../services/monitoring.service';

export class BullMQQueueManager {
  private queues: Map<string, Queue> = new Map();
  
  constructor(
    private monitoring: MonitoringService,
    private redisConfig: any
  ) {}

  async createQueue(name: string, config: QueueConfig): Promise<Queue> {
    const queue = new Queue(name, {
      connection: this.redisConfig,
      defaultJobOptions: {
        attempts: config.retryAttempts || 3,
        backoff: {
          type: config.backoffType || 'exponential',
          delay: config.retryDelay || 2000,
        },
        removeOnComplete: config.removeOnComplete !== false,
        removeOnFail: config.removeOnFail !== false,
      },
    });

    this.queues.set(name, queue);
    return queue;
  }
}`,
        'pg-boss': `import PgBoss from 'pg-boss';
import { QueueConfig, QueueMetrics } from '../types/queue.types';
import { MonitoringService } from '../services/monitoring.service';

export class PgBossQueueManager {
  private boss: PgBoss;
  
  constructor(
    private monitoring: MonitoringService,
    connectionString: string
  ) {
    this.boss = new PgBoss(connectionString);
  }

  async start(): Promise<void> {
    await this.boss.start();
  }

  async createQueue(name: string, config: QueueConfig): Promise<void> {
    // pg-boss automatically creates queues on first use
    // Configure default options for the queue
    const queueOptions = {
      retryLimit: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
      retryBackoff: config.backoffType === 'exponential',
      expireInSeconds: config.jobExpiration || 3600,
    };
    
    // Store queue configuration for later use
    await this.boss.send('__queue_config__', { queue: name, options: queueOptions });
  }

  async getQueueMetrics(queueName: string): Promise<QueueMetrics> {
    const states = await this.boss.getQueueSize(queueName);
    
    return {
      name: queueName,
      waiting: states.created || 0,
      active: states.active || 0,
      completed: states.completed || 0,
      failed: states.failed || 0,
      delayed: states.retry || 0,
    };
  }
}`,
        'aws-sqs': `import AWS from 'aws-sdk';
import { QueueConfig, QueueMetrics } from '../types/queue.types';
import { MonitoringService } from '../services/monitoring.service';

export class SQSQueueManager {
  private sqs: AWS.SQS;
  private queueUrls: Map<string, string> = new Map();
  
  constructor(
    private monitoring: MonitoringService,
    awsConfig: AWS.SQS.ClientConfiguration
  ) {
    this.sqs = new AWS.SQS(awsConfig);
  }

  async createQueue(name: string, config: QueueConfig): Promise<string> {
    const params: AWS.SQS.CreateQueueRequest = {
      QueueName: name,
      Attributes: {
        VisibilityTimeout: String(config.visibilityTimeout || 30),
        MessageRetentionPeriod: String(config.messageRetention || 345600),
        ReceiveMessageWaitTimeSeconds: String(config.longPolling || 20),
      },
    };

    if (config.fifo) {
      params.QueueName = \`\${name}.fifo\`;
      params.Attributes!.FifoQueue = 'true';
    }

    const result = await this.sqs.createQueue(params).promise();
    const queueUrl = result.QueueUrl!;
    this.queueUrls.set(name, queueUrl);
    
    return queueUrl;
  }

  async getQueueMetrics(queueName: string): Promise<QueueMetrics> {
    const queueUrl = this.queueUrls.get(queueName);
    if (!queueUrl) throw new Error(\`Queue \${queueName} not found\`);

    const attributes = await this.sqs.getQueueAttributes({
      QueueUrl: queueUrl,
      AttributeNames: ['All'],
    }).promise();

    return {
      name: queueName,
      waiting: Number(attributes.Attributes?.ApproximateNumberOfMessages || 0),
      active: Number(attributes.Attributes?.ApproximateNumberOfMessagesNotVisible || 0),
      completed: 0, // SQS doesn't track completed messages
      failed: 0, // Use DLQ for failed messages
      delayed: Number(attributes.Attributes?.ApproximateNumberOfMessagesDelayed || 0),
    };
  }
}`,
        rabbitmq: `import amqp from 'amqplib';
import { QueueConfig, QueueMetrics } from '../types/queue.types';
import { MonitoringService } from '../services/monitoring.service';

export class RabbitMQQueueManager {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  
  constructor(
    private monitoring: MonitoringService,
    private connectionUrl: string
  ) {}

  async connect(): Promise<void> {
    this.connection = await amqp.connect(this.connectionUrl);
    this.channel = await this.connection.createChannel();
  }

  async createQueue(name: string, config: QueueConfig): Promise<void> {
    await this.channel.assertQueue(name, {
      durable: config.durable !== false,
      arguments: {
        'x-message-ttl': config.messageTTL || 3600000,
        'x-max-retries': config.retryAttempts || 3,
        'x-dead-letter-exchange': config.dlx || \`\${name}-dlx\`,
      },
    });

    // Set up dead letter exchange if needed
    if (config.enableDLQ !== false) {
      await this.channel.assertExchange(\`\${name}-dlx\`, 'direct', { durable: true });
      await this.channel.assertQueue(\`\${name}-dlq\`, { durable: true });
      await this.channel.bindQueue(\`\${name}-dlq\`, \`\${name}-dlx\`, name);
    }
  }

  async getQueueMetrics(queueName: string): Promise<QueueMetrics> {
    const queueInfo = await this.channel.checkQueue(queueName);
    
    return {
      name: queueName,
      waiting: queueInfo.messageCount,
      active: 0, // RabbitMQ doesn't distinguish active messages
      completed: 0, // Not tracked by RabbitMQ
      failed: 0, // Check DLQ for failed messages
      delayed: 0, // Use delayed message plugin if needed
    };
  }
}`,
      },
    },

    'job-handler': {
      fileNamePattern: 'job-handler.ts',
      template: `import { Job, JobData, ScheduleOptions, RetryStrategy, ProcessingContext } from '../types/queue.types';
import { Logger } from '../utils/logger';

export class JobHandler {
  constructor(
    private logger: Logger,
    private config: JobHandlerConfig
  ) {}

  async scheduleJob(jobData: JobData, schedule: ScheduleOptions): Promise<string> {
    const jobId = this.generateJobId();
    
    switch (schedule.type) {
      case 'immediate':
        await this.queueImmediate(jobId, jobData);
        break;
      case 'delayed':
        await this.queueDelayed(jobId, jobData, schedule.delay);
        break;
      case 'recurring':
        await this.queueRecurring(jobId, jobData, schedule.cron);
        break;
      default:
        throw new Error(\`Unsupported schedule type: \${schedule.type}\`);
    }

    this.logger.info('Job scheduled', { jobId, schedule });
    return jobId;
  }

  async retryWithBackoff(job: Job, strategy: RetryStrategy): Promise<void> {
    const delay = this.calculateBackoffDelay(job.attempts, strategy);
    
    await this.scheduleJob(job.data, {
      type: 'delayed',
      delay,
    });

    this.logger.info('Job scheduled for retry', {
      jobId: job.id,
      attempt: job.attempts + 1,
      delay,
    });
  }

  async handleProcessingError(error: Error, context: ProcessingContext): Promise<ProcessingResult> {
    this.logger.error('Job processing failed', {
      error: error.message,
      context,
    });

    return {
      success: false,
      error: error.message,
      shouldRetry: context.attempts < this.config.maxRetryAttempts,
      metadata: {
        failedAt: new Date().toISOString(),
        attempts: context.attempts,
      },
    };
  }

  async setupConsumer(queueName: string, consumerConfig: ConsumerConfig): Promise<void> {
    // Setup consumer with job handler utilities
    const processor = async (job: Job) => {
      const context: ProcessingContext = {
        jobId: job.id,
        queueName,
        attempts: job.attempts,
        processingTime: Date.now(),
      };

      return consumerConfig.processor(job.data, context);
    };

    // Configure with retry and error handling
    await this.configureConsumer(queueName, {
      ...consumerConfig,
      processor,
    });
  }

  private calculateBackoffDelay(attempts: number, strategy: RetryStrategy): number {
    switch (strategy.type) {
      case 'exponential':
        return Math.min(
          strategy.baseDelay * Math.pow(2, attempts),
          strategy.maxDelay || 60000
        );
      case 'linear':
        return strategy.baseDelay * attempts;
      case 'fixed':
        return strategy.baseDelay;
      default:
        return 1000;
    }
  }

  private generateJobId(): string {
    return \`job_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`;
  }

  private async queueImmediate(jobId: string, jobData: JobData): Promise<void> {
    // Implementation depends on queue backend
    throw new Error('Implement immediate queuing');
  }

  private async queueDelayed(jobId: string, jobData: JobData, delay: number): Promise<void> {
    // Implementation depends on queue backend
    throw new Error('Implement delayed queuing');
  }

  private async queueRecurring(jobId: string, jobData: JobData, cron: string): Promise<void> {
    // Implementation depends on queue backend
    throw new Error('Implement recurring queuing');
  }

  private async configureConsumer(queueName: string, config: ConsumerConfig): Promise<void> {
    // Implementation depends on queue backend
    throw new Error('Implement consumer configuration');
  }
}`,
      contextHints: [
        'Job handler provides centralized utilities',
        'See /shared/errors for error handling patterns',
        'Retry strategies should be configurable',
      ],
    },

    producer: {
      fileNamePattern: 'queue-producer.ts',
      template: `import { QueueManager } from '../queue-manager/queue-manager';
import { JobData } from '../types/queue.types';

// Producer utilities - simple functions for enqueueing messages
export class QueueProducer {
  constructor(private queueManager: QueueManager) {}

  async enqueue(queueName: string, data: JobData, options?: EnqueueOptions): Promise<string> {
    const queue = await this.queueManager.getQueue(queueName);
    
    return queue.add(data, {
      priority: options?.priority || 0,
      delay: options?.delay || 0,
      attempts: options?.attempts || 3,
      removeOnComplete: options?.removeOnComplete !== false,
      removeOnFail: options?.removeOnFail !== false,
    });
  }

  async enqueueBatch(queueName: string, jobs: Array<{ data: JobData; options?: EnqueueOptions }>): Promise<string[]> {
    const queue = await this.queueManager.getQueue(queueName);
    const jobIds: string[] = [];

    for (const job of jobs) {
      const jobId = await this.enqueue(queueName, job.data, job.options);
      jobIds.push(jobId);
    }

    return jobIds;
  }

  async scheduleRecurring(queueName: string, data: JobData, cronExpression: string): Promise<string> {
    const queue = await this.queueManager.getQueue(queueName);
    
    return queue.add(data, {
      repeat: { cron: cronExpression },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }
}

// Convenience functions for common queue operations
export async function produce(queueName: string, data: JobData, options?: EnqueueOptions): Promise<string> {
  // This would typically use a singleton QueueProducer instance
  const producer = getQueueProducer();
  return producer.enqueue(queueName, data, options);
}

export async function produceBatch(queueName: string, jobs: Array<{ data: JobData; options?: EnqueueOptions }>): Promise<string[]> {
  const producer = getQueueProducer();
  return producer.enqueueBatch(queueName, jobs);
}

function getQueueProducer(): QueueProducer {
  // Implementation would return singleton instance
  throw new Error('Implement queue producer singleton');
}`,
      dataAccessVariants: {
        bullmq: `import { Queue } from 'bullmq';
import { JobData, EnqueueOptions } from '../types/queue.types';

export async function produceBullMQ(
  queue: Queue,
  data: JobData,
  options?: EnqueueOptions
): Promise<string> {
  const job = await queue.add('job', data, {
    priority: options?.priority,
    delay: options?.delay,
    attempts: options?.attempts || 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: options?.removeOnComplete !== false,
    removeOnFail: options?.removeOnFail !== false,
  });
  
  return job.id!;
}`,
        'pg-boss': `import PgBoss from 'pg-boss';
import { JobData, EnqueueOptions } from '../types/queue.types';

export async function producePgBoss(
  boss: PgBoss,
  queueName: string,
  data: JobData,
  options?: EnqueueOptions
): Promise<string> {
  const jobId = await boss.send(queueName, data, {
    priority: options?.priority || 0,
    startAfter: options?.delay ? options.delay / 1000 : 0,
    retryLimit: options?.attempts || 3,
    retryDelay: 2,
    retryBackoff: true,
    expireInSeconds: options?.expireIn || 3600,
  });
  
  return jobId;
}

export async function scheduleRecurringPgBoss(
  boss: PgBoss,
  queueName: string,
  data: JobData,
  cronExpression: string
): Promise<string> {
  return boss.schedule(queueName, cronExpression, data);
}`,
        'aws-sqs': `import AWS from 'aws-sdk';
import { JobData, EnqueueOptions } from '../types/queue.types';
import { v4 as uuidv4 } from 'uuid';

export async function produceSQS(
  sqs: AWS.SQS,
  queueUrl: string,
  data: JobData,
  options?: EnqueueOptions
): Promise<string> {
  const messageId = uuidv4();
  
  const params: AWS.SQS.SendMessageRequest = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(data),
    MessageAttributes: {
      priority: {
        DataType: 'Number',
        StringValue: String(options?.priority || 0),
      },
    },
  };

  if (options?.delay) {
    params.DelaySeconds = Math.floor(options.delay / 1000);
  }

  const result = await sqs.sendMessage(params).promise();
  return result.MessageId || messageId;
}

export async function produceBatchSQS(
  sqs: AWS.SQS,
  queueUrl: string,
  jobs: Array<{ data: JobData; options?: EnqueueOptions }>
): Promise<string[]> {
  const entries = jobs.map((job, index) => ({
    Id: String(index),
    MessageBody: JSON.stringify(job.data),
    DelaySeconds: job.options?.delay ? Math.floor(job.options.delay / 1000) : undefined,
  }));

  const result = await sqs.sendMessageBatch({
    QueueUrl: queueUrl,
    Entries: entries,
  }).promise();

  return result.Successful?.map(s => s.MessageId!) || [];
}`,
        rabbitmq: `import amqp from 'amqplib';
import { JobData, EnqueueOptions } from '../types/queue.types';
import { v4 as uuidv4 } from 'uuid';

export async function produceRabbitMQ(
  channel: amqp.Channel,
  queueName: string,
  data: JobData,
  options?: EnqueueOptions
): Promise<string> {
  const messageId = uuidv4();
  
  const message = Buffer.from(JSON.stringify(data));
  const publishOptions: amqp.Options.Publish = {
    persistent: true,
    messageId,
    priority: options?.priority || 0,
  };

  if (options?.delay) {
    // Requires RabbitMQ delayed message plugin
    publishOptions.headers = {
      'x-delay': options.delay,
    };
  }

  channel.sendToQueue(queueName, message, publishOptions);
  
  return messageId;
}

export async function produceBatchRabbitMQ(
  channel: amqp.Channel,
  queueName: string,
  jobs: Array<{ data: JobData; options?: EnqueueOptions }>
): Promise<string[]> {
  const messageIds: string[] = [];
  
  for (const job of jobs) {
    const messageId = await produceRabbitMQ(channel, queueName, job.data, job.options);
    messageIds.push(messageId);
  }
  
  return messageIds;
}`,
      },
    },

    'producer-functional': {
      fileNamePattern: 'queue-producer.ts',
      template: `import { JobData, EnqueueOptions } from '../types/queue.types';
import { getQueueManager } from '../queue-manager/queue-manager';

// Enqueue a single message
export const produce = async (
  queueName: string,
  data: JobData,
  options?: EnqueueOptions
): Promise<string> => {
  const queueManager = getQueueManager();
  const queue = await queueManager.getQueue(queueName);
  
  return queue.add(data, {
    priority: options?.priority || 0,
    delay: options?.delay || 0,
    attempts: options?.attempts || 3,
    removeOnComplete: options?.removeOnComplete !== false,
    removeOnFail: options?.removeOnFail !== false,
  });
};

// Enqueue multiple messages
export const produceBatch = async (
  queueName: string,
  jobs: Array<{ data: JobData; options?: EnqueueOptions }>
): Promise<string[]> => {
  return Promise.all(
    jobs.map(job => produce(queueName, job.data, job.options))
  );
};

// Schedule recurring job
export const scheduleRecurring = async (
  queueName: string,
  data: JobData,
  cronExpression: string
): Promise<string> => {
  const queueManager = getQueueManager();
  const queue = await queueManager.getQueue(queueName);
  
  return queue.add(data, {
    repeat: { cron: cronExpression },
    removeOnComplete: true,
    removeOnFail: false,
  });
};

// Create producer with bound queue
export const createProducer = (queueName: string) => ({
  enqueue: (data: JobData, options?: EnqueueOptions) => 
    produce(queueName, data, options),
  enqueueBatch: (jobs: Array<{ data: JobData; options?: EnqueueOptions }>) => 
    produceBatch(queueName, jobs),
  scheduleRecurring: (data: JobData, cron: string) => 
    scheduleRecurring(queueName, data, cron),
});`,
      contextHints: [
        'Functional producers are simple utility functions',
        'Use partial application for queue-specific producers',
        'Compose producers for complex workflows',
      ],
    },
  },

  rules: {
    required: [
      {
        layer: 'consumer',
        rule: 'All consumers must implement error handling and return ProcessingResult',
        severity: 'error',
      },
      {
        layer: 'consumer',
        rule: 'Queue setup must specify concurrency and retry configuration',
        severity: 'error',
      },
      {
        layer: 'queue-manager',
        rule: 'All queue operations must be monitored and logged',
        severity: 'error',
      },
      {
        layer: 'job-handler',
        rule: 'Retry strategies must have maximum retry limits',
        severity: 'error',
      },
    ],
    forbidden: [
      {
        layer: 'consumer',
        rule: 'Consumers must not directly create or manage queue infrastructure',
        severity: 'error',
      },
      {
        layer: 'queue-manager',
        rule: 'Queue manager must not contain business logic for message processing',
        severity: 'error',
      },
      {
        layer: 'job-handler',
        rule: 'Job handlers must not depend on specific consumer implementations',
        severity: 'error',
      },
    ],
    conventions: [
      {
        aspect: 'naming',
        description: 'Use consistent suffixes: Consumer, Manager, Handler',
        examples: ['EmailConsumer', 'QueueManager', 'JobHandler'],
      },
      {
        aspect: 'structure',
        description: 'Group queue-related files by concern, not by queue type',
        examples: ['/consumers/email.consumer.ts', '/queue-manager/queue-manager.ts'],
      },
      {
        aspect: 'patterns',
        description: 'Use dependency injection for all queue components',
        examples: ['constructor(private queueManager: QueueManager)', 'createJobHandler(config)'],
      },
      {
        aspect: 'dependencies',
        description: 'Follow unidirectional dependency flow',
        examples: ['Consumer -> JobHandler', 'QueueManager -> Backend Adapter'],
      },
    ],
  },

  style: {
    language: 'typescript',
    guide: 'airbnb',
    customRules: [
      'Use explicit return types for all queue processing methods',
      'Prefer interfaces over concrete types for queue configurations',
      'Use dependency injection for queue components',
      'Always handle async operations with proper error handling',
    ],
  },

  aiGuidance: {
    memories: [
      'This queue architecture separates concerns: consumers process messages, queue-manager handles infrastructure, job-handler provides utilities',
      'Producers are simple utility functions, not a separate layer',
      'Each queue can have different concurrency settings configured per consumer',
      'Job handlers are centralized utilities created once and reused',
      'Queue management includes monitoring, metrics, and lifecycle management',
      'All queue operations should be properly logged and monitored',
      'BullMQ excels at high-throughput Redis-based queuing with advanced features',
      'pg-boss is ideal for PostgreSQL environments with built-in job scheduling',
      'AWS SQS provides managed queue infrastructure with high reliability',
      'RabbitMQ offers advanced routing and message patterns for complex workflows',
      'Supports both class-based and functional patterns via consumerPattern option',
      'Functional patterns use pure functions and explicit dependency injection',
      'Class patterns use constructor dependency injection and instance methods',
    ],
    conventions: [
      'Consumer classes should be named {QueueName}Consumer',
      'Processing methods should be named process{MessageType}',
      'Use async/await for all queue operations',
      'Always return ProcessingResult from consumer methods',
      'Configure queues declaratively using configuration objects',
      'Use dependency injection for all queue components',
    ],
    preferredLibraries: {
      'queue-backend': 'bullmq for Redis-based queues, pg-boss for PostgreSQL queues',
      bullmq: 'bullmq for Redis-based high-performance queues',
      'pg-boss': 'pg-boss for PostgreSQL-based reliable job queues',
      'aws-sqs': 'aws-sdk with sqs-consumer for SQS integration',
      rabbitmq: 'amqplib for RabbitMQ connections',
      scheduling: 'node-cron for cron expressions, or native scheduler per backend',
      monitoring: 'prometheus for metrics collection',
      logging: 'winston for structured logging',
      configuration: 'convict for configuration management',
      testing: 'jest with queue testing utilities',
    },
    antiPatterns: [
      'Do not put business logic in queue-manager or job-handler layers',
      'Avoid tightly coupling consumers to specific queue backends',
      'Do not create separate producer layers - use utility functions',
      'Avoid blocking operations in message processing',
      'Do not ignore error handling in queue processing',
      'Avoid hardcoding queue configurations',
      'Do not mix different queue backends in the same service',
      'Avoid using synchronous operations in queue processors',
    ],
    examplePaths: {
      'consumer-setup': '/src/consumers/email.consumer.ts',
      'queue-configuration': '/src/config/queue.config.ts',
      'job-scheduling': '/src/job-handler/job-handler.ts',
      monitoring: '/src/queue-manager/monitoring.ts',
      'bullmq-example': '/src/examples/bullmq-setup.ts',
      'pg-boss-example': '/src/examples/pg-boss-setup.ts',
      'sqs-example': '/src/examples/sqs-setup.ts',
      'rabbitmq-example': '/src/examples/rabbitmq-setup.ts',
    },
  },

  taskTemplates: [
    {
      id: 'add-new-queue',
      taskType: 'queue-implementation',
      description: 'Add a new queue with consumer and processing logic',
      steps: [
        {
          order: 1,
          description: 'Define message types and interfaces',
          layer: 'types',
          template: 'export interface {{QueueName}}Message { ... }',
          validation: 'Message types should be strongly typed',
        },
        {
          order: 2,
          description: 'Create consumer class with processing logic',
          layer: 'consumer',
          validation: 'Consumer implements QueueConsumer interface',
        },
        {
          order: 3,
          description: 'Configure queue settings and concurrency',
          layer: 'consumer',
          validation: 'Queue configuration includes retry and concurrency settings',
        },
        {
          order: 4,
          description: 'Set up producer utility functions if needed',
          layer: 'producer',
          validation: 'Producer functions are simple and reusable',
        },
        {
          order: 5,
          description: 'Add monitoring and metrics for the new queue',
          layer: 'queue-manager',
          validation: 'Queue metrics are properly tracked',
        },
        {
          order: 6,
          description: 'Write tests for consumer processing logic',
          layer: 'consumer',
          validation: 'Tests cover success, failure, and retry scenarios',
        },
        {
          order: 7,
          description: 'Verify queue integration with monitoring',
          layer: 'queue-manager',
          validation: 'Queue metrics are accessible via monitoring endpoints',
        },
      ],
      constraints: [
        'Queue names should be consistent and descriptive',
        'All queues must have proper error handling',
        'Consumer processing should be idempotent where possible',
        'Queue configurations must include monitoring',
        'Choose consumerPattern (class/functional) based on project style',
      ],
      requiredContext: [
        'Existing queue backend configuration',
        'Monitoring and logging setup',
        'Error handling patterns in the codebase',
        'Testing utilities for queue processing',
        'Preferred programming pattern (class vs functional)',
      ],
    },
    {
      id: 'add-scheduled-job',
      taskType: 'scheduling-implementation',
      description: 'Add a scheduled or recurring job',
      steps: [
        {
          order: 1,
          description: 'Define job data structure and schedule requirements',
          layer: 'types',
          validation: 'Job data and schedule options are properly typed',
        },
        {
          order: 2,
          description: 'Create or update consumer to handle scheduled messages',
          layer: 'consumer',
          validation: 'Consumer can process scheduled job messages',
        },
        {
          order: 3,
          description: 'Use JobHandler to set up scheduling logic',
          layer: 'job-handler',
          validation: 'Scheduling uses centralized JobHandler utilities',
        },
        {
          order: 4,
          description: 'Configure recurring job with appropriate cron expression',
          layer: 'job-handler',
          validation: 'Cron expression is validated and documented',
        },
        {
          order: 5,
          description: 'Add monitoring for scheduled job execution',
          layer: 'queue-manager',
          validation: 'Scheduled jobs are properly monitored and logged',
        },
      ],
      constraints: [
        'Scheduled jobs must be idempotent',
        'Use cron expressions for recurring schedules',
        'Include proper error handling for failed scheduled jobs',
        'Document schedule requirements and dependencies',
        'Consider timezone handling for scheduled jobs',
      ],
      requiredContext: [
        'Existing JobHandler configuration',
        'Cron expression validation utilities',
        'Job monitoring and alerting setup',
        'Timezone configuration if applicable',
      ],
    },
  ],
};
