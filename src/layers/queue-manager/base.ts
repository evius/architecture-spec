import type { LayerSpec } from '../../types/architecture.js';

export const queueManagerLayer: LayerSpec = {
  name: 'queue-manager',
  purpose: 'Manage queue infrastructure, configuration, and monitoring',
  responsibilities: [
    'Create and configure different queue types',
    'Monitor queue health and performance',
    'Handle queue lifecycle (start, stop, pause, resume)',
    'Manage queue persistence and cleanup',
    'Provide queue metrics and diagnostics',
  ],
  restrictions: [
    'Must NOT contain business logic for message processing',
    'Must NOT depend on specific consumer implementations',
    'Must NOT handle individual message processing',
  ],
  dependencies: {
    canImport: ['config', 'monitoring', 'database', 'utils'],
    cannotImport: ['consumer', 'job-handler'],
  },
  interface: {
    methods: [
      {
        pattern: 'createQueue',
        parameters: '(name: string, config: QueueConfig)',
        returnType: 'Promise<Queue>',
        async: true,
      },
      {
        pattern: 'getQueueMetrics',
        parameters: '(queueName: string)',
        returnType: 'Promise<QueueMetrics>',
        async: true,
      },
    ],
  },
  conventions: {
    configuration: {
      pattern: 'Queue configurations should be declarative',
      description: 'Use configuration objects rather than procedural setup',
      example: '{ concurrency: 5, retryAttempts: 3, delayType: "exponential" }',
    },
  },
};
