import { ChildProcess } from 'child_process';
import { logger } from './logger';

class ProcessManager {
  private childProcesses: ChildProcess[] = [];

  addChildProcess(process: ChildProcess) {
    this.childProcesses.push(process);
  }

  removeChildProcess(process: ChildProcess) {
    const index = this.childProcesses.indexOf(process);
    if (index > -1) {
      this.childProcesses.splice(index, 1);
    }
  }

  terminateAllChildProcesses() {
    logger.info('全ての子プロセスを終了します');
    this.childProcesses.forEach(child => {
      child.kill();
    });
  }
}

export const processManager = new ProcessManager();
