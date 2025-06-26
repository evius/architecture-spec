import type { LayerSpec } from '../../types/architecture.js';

export const jobHandlerLayer: LayerSpec = {
  name: 'job-handler',
  purpose: 'Centralized job processing utilities and scheduling',
  responsibilities: [
    'Provide common job processing patterns (retry, exponential backoff)',
    'Handle job scheduling and delayed execution',
    'Manage job lifecycle and state transitions',
    'Provide job processing utilities and helpers',
    'Handle cross-cutting concerns (logging, metrics, error handling)',
  ],
  restrictions: [
    'Must NOT contain queue-specific business logic',
    'Must NOT manage queue infrastructure',
    'Must NOT depend on specific consumer implementations',
  ],
  dependencies: {
    canImport: ['utils', 'config', 'logging', 'monitoring'],
    cannotImport: ['consumer', 'queue-manager'],
  },
  interface: {
    methods: [
      {
        pattern: 'scheduleJob',
        parameters: '(jobData: JobData, schedule: ScheduleOptions)',
        returnType: 'Promise<JobId>',
        async: true,
      },
      {
        pattern: 'retryWithBackoff',
        parameters: '(job: Job, strategy: RetryStrategy)',
        returnType: 'Promise<void>',
        async: true,
      },
    ],
  },
  aiHints: [
    'Job handlers are stateless utilities created once and reused',
    'Use dependency injection for backend-specific implementations',
    'Centralize retry logic and error handling patterns here',
  ],
};
