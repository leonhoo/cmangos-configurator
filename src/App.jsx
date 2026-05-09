import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { open, save } from '@tauri-apps/plugin-dialog';

import Home from './components/Home';
import ConfigList from './components/ConfigList';
import EditModal from './components/EditModal';
import LogPanel from './components/LogPanel';
import {
  loadConfig,
  mergeImported,
  transformToGroupObject,
  parseImportedConfig,
  exportConfig,
} from './utils/config';
import { Logger } from './utils/logger';
import './utils/language';

export default function App() {
  const { t, i18n } = useTranslation();
  const [showHome, setShowHome] = useState(true);
  const [config, setConfig] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [showLog, setShowLog] = useState(false);
  const [searchKey, setSearchKey] = useState('');

  useEffect(() => {
    if (!showHome) loadCurrentConfig();
  }, [i18n.language]);

  const loadCurrentConfig = async () => {
    let cfg = await loadConfig(i18n.language);
    if (config && config.length > 0) {
      cfg = transformToGroupObject(cfg, config); // 保留当前修改的值
    }
    setConfig(cfg);
  };

  const handleNew = async () => {
    await loadCurrentConfig();
    setShowHome(false);
    Logger.info('logDefaultLoaded');
  };

  const handleImport = async () => {
    try {
      const selected = await open({ filters: [{ name: 'Conf', extensions: ['conf'] }] });
      if (!selected) return;
      const text = await readTextFile(selected);
      const imported = parseImportedConfig(text);
      const original = await loadConfig(i18n.language);
      const merged = mergeImported(original, imported);
      setConfig(merged);
      setShowHome(false);
      Logger.info('logImported');
    } catch (e) {
      Logger.error('logImportFail');
    }
  };

  const handleSave = async () => {
    try {
      const path = await save({ filters: [{ name: 'Conf', extensions: ['conf'] }] });
      if (!path) return;
      await writeTextFile(path, exportConfig(config));
      Logger.info('logSaved');
    } catch (e) {
      Logger.error('logSaveFail');
    }
  };

  const flatItems = config.flatMap(g => g.items);
  const filtered = flatItems.filter(it => {
    if (!searchKey) return true;
    const kw = searchKey.toLowerCase();
    return it.key.toLowerCase().includes(kw)
      || it.value.toLowerCase().includes(kw)
      || it.desc.toLowerCase().includes(kw)
      || (it.group || '').toLowerCase().includes(kw);
  });

  const handleOpenModal = (item) => setEditItem({ ...item });

  const confirmEdit = (updated) => {
    console.log(11111);

    let copy = JSON.parse(JSON.stringify(config));
    copy.forEach(g => {
      const it = g.items.find(x => x.key === updated.key);
      if (it && it.value !== updated.value) {
        Logger.info('logModified', { key: updated.key, old: it.value, new: updated.value });
        it.value = updated.value;
      }
    });

    setConfig(copy);
    setEditItem(null);
  };

  return (
    <div className="mac-window">
      {!showHome && (
        <div className="menu-bar">
          <button className="menu-btn" onClick={handleImport}>{t('import')}</button>
          <button className="menu-btn" onClick={handleSave}>{t('saveAs')}</button>

          <input
            className="search-input"
            placeholder={t('search')}
            value={searchKey}
            onChange={e => setSearchKey(e.target.value)}
          />

          <button className={`menu-btn ${showLog ? 'active' : ''}`} onClick={() => setShowLog(!showLog)}>
            {t('log')}
          </button>

          <button className="menu-btn" onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')}>
            {i18n.language === 'zh' ? 'EN' : '中'}
          </button>

        </div>
      )}

      {showHome ? (
        <Home onNew={handleNew} onImport={handleImport} />
      ) : (
        <ConfigList config={config} filtered={filtered} onItemClick={handleOpenModal} />
      )}

      {showLog && <LogPanel />}

      <EditModal
        item={editItem}
        onClose={() => setEditItem(null)}
        onConfirm={confirmEdit}
      />
    </div>
  );
}