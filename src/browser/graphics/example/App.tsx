import { useReplicant } from '../../hooks/useReplicant';
import type { CSSProperties } from 'react';

const styles: Record<string, CSSProperties> = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    boxSizing: 'border-box',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
    gap: '60px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
    opacity: 0.8,
  },
  valueBox: {
    fontSize: '64px',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '10px 20px',
    borderRadius: '8px',
    minWidth: '200px',
  },
  stopwatchBox: {
      fontSize: '80px',
      fontWeight: 'bold',
      fontFamily: '"Roboto Mono", monospace',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: '10px 30px',
      borderRadius: '8px',
  }
};

export function ExampleGraphic() {
  const [alert] = useReplicant('alert');
  const [stopwatch] = useReplicant('stopwatch');
  
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div style={styles.container}>
      {/* 上部: テロップ表示 */}
      <div style={styles.section}>
        <div style={styles.label}>テロップ表示</div>
        <div style={styles.valueBox}>
          {alert || '(待機中)'}
        </div>
      </div>

      {/* 下部: ストップウォッチ */}
      <div style={styles.section}>
        <div style={styles.label}>ストップウォッチ</div>
        <div style={styles.stopwatchBox}>
          {stopwatch ? formatTime(stopwatch.time) : '00:00'}
        </div>
      </div>
    </div>
  );
}
