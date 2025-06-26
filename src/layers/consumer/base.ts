import type { LayerSpec } from '../../types/architecture.js';

export const consumerLayer: LayerSpec = {
  name: 'consumer',
  purpose: 'Process queue messages and manage queue setup',
  responsibilities: [
    'Define message processing logic for specific queues',
    'Configure queue settings (concurrency, retry, delays)',
    'Set up queue-to-consumer mappings',
    'Handle consumer-specific error handling and logging',
  ],
  restrictions: [
    'Must NOT directly manage queue infrastructure',
    'Must NOT handle cross-queue orchestration',
    'Must NOT implement scheduling logic',
  ],
  dependencies: {
    canImport: ['job-handler', 'queue-manager', 'models', 'utils'],
    cannotImport: ['database-direct', 'other-consumers'],
  },
  interface: {
    methods: [
      {
        pattern: 'process{QueueName}Message',
        parameters: '(message: T, context: ProcessingContext)',
        returnType: 'Promise<ProcessingResult>',
        async: true,
      },
      {
        pattern: 'setup{QueueName}Consumer',
        parameters: '(config: QueueConfig)',
        returnType: 'Promise<QueueConsumer>',
        async: true,
      },
    ],
  },
  conventions: {
    naming: {
      pattern: '{QueueName}Consumer',
      description: 'Consumer classes should be named after the queue they process',
      example: 'EmailQueueConsumer, NotificationQueueConsumer',
    },
    processing: {
      pattern: 'process{MessageType}',
      description: 'Processing methods should be named after message type',
      example: 'processEmailMessage, processNotificationMessage',
    },
  },
};
