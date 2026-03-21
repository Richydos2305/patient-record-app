import { describe, it, expect } from 'vitest';
import logger from '../logger';

describe('logger', () => {
  it('creates a logger instance without throwing', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('logs without throwing', () => {
    expect(() => logger.info('test info message')).not.toThrow();
    expect(() => logger.warn('test warn message')).not.toThrow();
    expect(() => logger.debug('test debug message')).not.toThrow();
  });
});
