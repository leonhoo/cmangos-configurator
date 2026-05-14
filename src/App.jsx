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
import backSvg from './assets/back.svg';
import importSvg from './assets/import.svg';
import saveAsSvg from './assets/saveas.svg';
import logSvg from './assets/log.svg';

export default function App() {
  const { t, i18n } = useTranslation();
  const [showHome, setShowHome] = useState(true);
  const [config, setConfig] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [showLog, setShowLog] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [configType, setConfigType] = useState('mangosd');

  useEffect(() => {
    if (!showHome) loadCurrentConfig(configType, true);
  }, [i18n.language]);

  const loadCurrentConfig = async (newLoadType, reload = false) => {
    let cfg = await loadConfig(i18n.language, newLoadType);
    if (config && config.length > 0 && reload) {
      cfg = transformToGroupObject(cfg, config); // 保留当前修改的值
    }
    setConfig(cfg);
    return cfg;
  };

  const handleNew = async (conf) => {
    setConfigType(conf);
    await loadCurrentConfig(conf);
    setShowHome(false);
    Logger.info('logDefaultLoaded', { type: conf });
  };

  const handleBackHome = () => {
    setShowHome(true);
    setConfig([]);
    setSearchKey('');
  }

  const handleImport = async (conf) => {
    try {
      console.log(conf);

      setConfigType(conf);
      let a = ava.text.loa;
      const selected = await open({ filters: [{ name: conf + '.conf', extensions: ['conf'] }] });
      if (!selected) return;
      const text = await readTextFile(selected);
      const imported = parseImportedConfig(text);
      const original = await loadCurrentConfig(conf);
      const merged = mergeImported(original, imported);
      setConfig(merged);
      setShowHome(false);
      Logger.info('logImported', { type: conf });
    } catch (e) {
      console.log("Import failed: ", e);
      Logger.error('logImportFail', { type: conf }, e);
    }
  };

  const handleSave = async () => {
    try {
      const path = await save({ filters: [{ name: configType + '.conf', extensions: ['conf'] }] });
      if (!path) return;

      await writeTextFile(path, exportConfig(config));
      Logger.info('logSaved', { type: configType });
    } catch (e) {
      Logger.error('logSaveFail', { type: configType }, e);
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
    let copy = JSON.parse(JSON.stringify(config));
    copy.forEach(g => {
      const it = g.items.find(x => x.key === updated.key);
      if (it && it.value !== updated.value) {
        Logger.info('logModified', { type: configType, key: updated.key, old: it.value, new: updated.value });
        it.value = updated.value;
      }
    });

    setConfig(copy);
    setEditItem(null);
  };

  return (
    <div className="main-window">
      {!showHome && (
        <div className="menu-bar">
          <button className="icon-btn" onClick={handleBackHome}><img src={backSvg} alt="Back" title={t('back')} /></button>
          <button className="menu-btn" onClick={() => handleImport(configType)}><img src={importSvg} alt="Import" title={t('import')} /></button>
          <button className="menu-btn" onClick={handleSave}><img src={saveAsSvg} alt={t('saveAs')} title={t('saveAs')} /></button>

          <input
            className="search-input"
            placeholder={t('search')}
            value={searchKey}
            onChange={e => setSearchKey(e.target.value)}
          />

          <button className={`menu-btn ${showLog ? 'active' : ''}`} onClick={() => setShowLog(!showLog)} title={t('log')}>
            <img src={logSvg} alt={t('log')} />
          </button>

          <button className="menu-btn" onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')} title={i18n.language === 'zh' ? 'Change to CN' : '切换成英文'}>
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