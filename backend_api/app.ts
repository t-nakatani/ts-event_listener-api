import express, { Request, Response } from 'express';
import { logger } from './logger';
import { registerEvent } from './eventRegister';
import { processManager } from './processManager';

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: "API is running" });
});

app.post('/events', async (req: Request, res: Response) => {
  try {
    const result = await registerEvent(req.body);
    res.status(200).send(result);
  } catch (error: any) {
    logger.error('イベント登録中にエラーが発生しました', { error: error.toString() });
    res.status(500).send('Internal Server Error');
  }
});

// 親プロセスの終了時に全ての子プロセスを終了させる
process.on('exit', () => {
  logger.info('親プロセス終了、全ての子プロセスを終了します');
  processManager.terminateAllChildProcesses();
});

// 予期せぬエラーの処理
process.on('uncaughtException', (error: Error) => {
  logger.error('予期せぬエラーが発生しました', { error: error.toString() });
  processManager.terminateAllChildProcesses();
  process.exit(1);
});

process.on('SIGINT', () => {
  logger.info('SIGINTを受信しました。プロセスを終了します');
  processManager.terminateAllChildProcesses();
  process.exit(0);
});

const PORT = 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
