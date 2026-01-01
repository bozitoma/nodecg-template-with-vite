import type { NodeCG } from './nodecg';

export default (nodecg: NodeCG) => {
  const log = new nodecg.Logger('extension');
  log.info('=====Extension is running=====');

  // Alert Text Replicant
  const alertRep = nodecg.Replicant('alert');
  alertRep.on('change', (newValue) => {
    log.info('alert text changed:', newValue);
  });

  // Stopwatch Replicant
  const stopwatchRep = nodecg.Replicant('stopwatch', {
    defaultValue: { time: 0, isRunning: false },
  });

  let intervalId: NodeJS.Timeout | null = null;
  let startTime = 0;
  let elapsedTime = 0;

  // ストップウォッチを開始
  nodecg.listenFor('startStopwatch', () => {
    const currentValue = stopwatchRep.value ?? { time: 0, isRunning: false };
    if (currentValue.isRunning) return;

    startTime = Date.now() - elapsedTime;
    stopwatchRep.value = { ...currentValue, isRunning: true };

    intervalId = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      const current = stopwatchRep.value ?? { time: 0, isRunning: false };
      stopwatchRep.value = { ...current, time: elapsedTime };
    }, 10); // 10ms間隔で更新

    log.info('Stopwatch started');
  });

  // ストップウォッチを停止
  nodecg.listenFor('stopStopwatch', () => {
    const currentValue = stopwatchRep.value ?? { time: 0, isRunning: false };
    if (!currentValue.isRunning) return;

    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    stopwatchRep.value = { ...currentValue, isRunning: false };
    log.info('Stopwatch stopped');
  });

  // ストップウォッチをリセット
  nodecg.listenFor('resetStopwatch', () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    startTime = 0;
    elapsedTime = 0;
    stopwatchRep.value = { time: 0, isRunning: false };
    log.info('Stopwatch reset');
  });

  // ストップウォッチの時間を設定
  nodecg.listenFor('setTime', (data) => {
    const currentValue = stopwatchRep.value ?? { time: 0, isRunning: false };
    if (currentValue.isRunning) return;

    stopwatchRep.value = { ...currentValue, time: data };
    elapsedTime = data;
    log.info('Stopwatch time set:', data);
  });
};
