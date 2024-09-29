import { ethers } from 'ethers';
import { logger } from './logger';

const monitorEvent = async (monitoringTarget: [string, string, string, any]) => {
  const [rpcUrl, contractAddress, eventName, abi] = monitoringTarget;

  const provider = new ethers.JsonRpcProvider(rpcUrl);  
  const contract = new ethers.Contract(contractAddress, abi, provider);
  logger.info(`${eventName}イベントの監視を開始します。コントラクトアドレス: ${contractAddress}`);

  contract.on(eventName, (...args) => {
    const event = args[args.length - 1];
    const info = {
      eventName: eventName,
      contract: event.emitter.target,
      tx_hash: event.log.transactionHash,
    };
    logger.info(`イベント検出: ${JSON.stringify(info)}`);
  });
};

const monitoringTarget = JSON.parse(process.argv[2]);
monitorEvent(monitoringTarget).catch((error) => {
  logger.error(`モニタープロセスでエラーが発生しました: ${error.toString()}`);
  process.exit(1);
});
