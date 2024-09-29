import pino from 'pino';

const customLevels = { gem: 70 }

export const logger = pino({
    level: 'trace',
    customLevels,
    useOnlyCustomLevels: false,
    transport: {
    target: 'pino/file',
    options: {
      name: 'iota-liuidate-bot',
      destination: 'logs/out.log',
      mkdir: true
    }
  }
});
