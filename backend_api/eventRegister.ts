import { spawn } from 'child_process';
import { logger } from './logger';
import { processManager } from './processManager';
import dotenv from 'dotenv';

dotenv.config();

export async function registerEvent(eventData: any) {
  logger.info('イベント登録開始', { rpc_url: eventData.rpc_url, contract_address: eventData.contract_address, event_name: eventData.event_name });

  const args = [
    JSON.stringify([eventData.rpc_url, eventData.contract_address, eventData.event_name, eventData.abi])
  ];
  const monitoringProcess = spawn('ts-node', ['-r', 'newrelic', 'backend_api/monitoring.ts', ...args], {
    env: {
      ...process.env,
      NEW_RELIC_APP_NAME: 'monitoring_chain',
      NEW_RELIC_LICENSE_KEY: process.env.NEWRELIC_KEY
    }
  });

  processManager.addChildProcess(monitoringProcess);

  monitoringProcess.stdout.on('data', (data) => {
    logger.info(`モニタリングプロセス出力: ${data.toString()}`);
  });

  monitoringProcess.stderr.on('data', (data) => {
    logger.error(`モニタリングプロセスエラー: ${data.toString()}`);
  });

  monitoringProcess.on('close', (code) => {
    logger.info(`モニタリングプロセス終了: ${code}`);
    // 終了した子プロセスを削除
    processManager.removeChildProcess(monitoringProcess);
  });

  return `イベントが正常に登録されました: ${JSON.stringify(eventData)}`;
}
