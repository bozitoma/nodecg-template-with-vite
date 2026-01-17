import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { useReplicant } from '../../hooks/useReplicant';

const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: 'transparent',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '48px',
    fontWeight: 800,
    letterSpacing: '-0.05em',
    margin: '0 0 60px 0',
    color: '#ffffff',
    textAlign: 'center',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
    maxWidth: '500px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: '24px',
    fontSize: '20px',
    fontWeight: 600,
    color: '#ededed',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  displayBox: {
    padding: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    marginBottom: '24px',
    textAlign: 'center',
  },
  displayText: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
    wordBreak: 'break-all',
    minHeight: '1.2em',
  },
  timeText: {
    fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", "Source Code Pro", monospace',
    fontSize: '56px',
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: '-2px',
    lineHeight: 1,
    margin: '10px 0',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    color: '#888888',
    marginBottom: '8px',
    fontWeight: 500,
  },
  inputGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '24px',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '6px',
    color: 'white',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: 600,
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    opacity: 1,
    flex: 1,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
  },
  buttonDanger: {
    backgroundColor: 'rgba(255, 50, 50, 0.1)',
    border: '1px solid rgba(255, 50, 50, 0.3)',
    color: '#ff4444',
  },
  controls: {
    display: 'flex',
    gap: '10px',
    marginBottom: '24px',
  },
  borderTop: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '20px',
    marginTop: '20px',
  }
};

export function ExampleDashboard() {
  const [alert, setAlert] = useReplicant('alert');
  const [stopwatch] = useReplicant('stopwatch');
  const [inputText, setInputText] = useState('');
  const [timeInput, setTimeInput] = useState('');

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && alert !== undefined) {
      setInputText(alert);
      initialized.current = true;
    }
  }, [alert]);

  const handleSetTime = (time: number) => {
    nodecg.sendMessage('setTime', time * 1000);
    setTimeInput('');
  };

  const handleShowAlert = () => {
    const message = inputText || '';
    setAlert(message);
    setInputText('');
  };

  return (
    <div style={styles.container}>
      <header>
        <h1 style={styles.title}>ダッシュボード</h1>
      </header>

      <div style={styles.grid}>
        {/* テロップ操作カード */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <span style={{opacity: 0.7}}>📣</span> テロップ更新
          </h2>

          <div style={styles.displayBox}>
            <span style={styles.label}>現在の表示</span>
            <p style={styles.displayText}>{alert || '( 未設定 )'}</p>
          </div>

          <div style={{marginTop: '24px'}}>
             <span style={styles.label}>新しいテキスト</span>
            <div style={styles.inputGroup}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="テキストを入力..."
                style={styles.input}
                onKeyPress={(e) => e.key === 'Enter' && handleShowAlert()}
              />
              <button
                onClick={handleShowAlert}
                style={{...styles.button, flex: 'none'}}
              >
                更新
              </button>
            </div>
          </div>
        </div>

        {/* ストップウォッチ操作カード */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <span style={{opacity: 0.7}}>⏱</span> ストップウォッチ
          </h2>

          <div style={styles.displayBox}>
            <p style={styles.timeText}>
              {stopwatch ? (
                (() => {
                   const totalSeconds = Math.floor(stopwatch.time / 1000);
                   const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
                   const ss = String(totalSeconds % 60).padStart(2, '0');
                   return `${mm}:${ss}`;
                })()
              ) : '00:00'}
            </p>
            <span style={{
              ...styles.label, 
              color: stopwatch?.isRunning ? '#4ade80' : '#888',
              marginBottom: 0
            }}>
               {stopwatch?.isRunning ? '● 計測中' : '❚❚ 停止中'}
            </span>
          </div>

          <div style={styles.controls}>
             <button
               onClick={() => nodecg.sendMessage('startStopwatch')}
               disabled={stopwatch?.isRunning}
               style={{
                 ...styles.button,
                 opacity: stopwatch?.isRunning ? 0.5 : 1,
                 cursor: stopwatch?.isRunning ? 'not-allowed' : 'pointer'
               }}
             >
               開始
             </button>
             <button
               onClick={() => nodecg.sendMessage('stopStopwatch')}
               disabled={!stopwatch?.isRunning}
               style={{
                 ...styles.button,
                 ...styles.buttonSecondary,
                 opacity: !stopwatch?.isRunning ? 0.5 : 1,
                 cursor: !stopwatch?.isRunning ? 'not-allowed' : 'pointer'
               }}
             >
               停止
             </button>
             <button
               onClick={() => nodecg.sendMessage('resetStopwatch')}
               style={{
                 ...styles.button,
                 ...styles.buttonDanger
               }}
             >
               クリア
             </button>
          </div>

          <div style={styles.borderTop}>
            <span style={styles.label}>時間指定セット</span>
            <div style={styles.inputGroup}>
              <input
                type="number"
                min={0}
                value={timeInput}
                onChange={(e) => parseInt(e.target.value) >= 0 && setTimeInput(e.target.value)}
                placeholder="秒..."
                style={styles.input}
              />
              <button
                onClick={() => {
                  const t = parseInt(timeInput);
                  if(!isNaN(t)) { handleSetTime(t); }
                }}
                disabled={stopwatch?.isRunning}
                style={{
                  ...styles.button,
                  ...styles.buttonSecondary,
                  opacity: stopwatch?.isRunning ? 0.5 : 1,
                  cursor: stopwatch?.isRunning ? 'not-allowed' : 'pointer'
                }}
              >
                セット
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
