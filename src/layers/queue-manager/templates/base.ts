import { Queue, QueueConfig, QueueMetrics } from '../types/queue.types';
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
      onError: error => this.monitoring.recordQueueError(name, error),
    });

    this.queues.set(name, queue);
    return queue;
  }

  async getQueueMetrics(queueName: string): Promise<QueueMetrics> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
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
}
