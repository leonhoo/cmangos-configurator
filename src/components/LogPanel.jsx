import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Logger } from '../utils/logger';

export default function LogPanel() {
  const [logs, setLogs] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs([...Logger.all()]);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // 清空日志
  const handleClear = () => {
    Logger.clear();
    setLogs([]);
  };

  return (
    <div className="log-panel-container">
      {/* 右上角清空按钮 */}
      <div className="log-header">
        <button className="log-clear-btn" onClick={handleClear} title={t('logClear')}>
          ×
        </button>
      </div>

      {/* 日志列表 */}
      <div className="log-list">
        {logs.map((log, i) => (
          <div key={i} style={{ color: (log.errorMessage != null) ? '#ff453a' : '#fff' }}>
            [{log.time}] {t(log.msg, log.params)} {log.errorMessage ? ` - ${log.errorMessage}` : ''}
          </div>
        ))}
      </div>
    </div>
  );
}