import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import ConfigurationSelect from './ConfigurationSelect';

export default function Home({ onNew, onImport }) {
  const { t, i18n } = useTranslation();
  // 默认选中 mangosd
  const [selectedConf, setSelectedConf] = useState("");
  const [btnEnabled, setBtnEnabled] = useState(false);
 
  useEffect(() => { 
    if (selectedConf.value) {
      setBtnEnabled(true);
    } else {
      setBtnEnabled(false);
    }
  }, [selectedConf]);

  return (
    <div className="home-container">
      {/* 右上角语言按钮 */}
      <div className="home-lang-btn">
        <button
          className="menu-btn"
          onClick={() => i18n.changeLanguage(i18n.language === "zh" ? "en" : "zh")}
        >
          {i18n.language === "zh" ? "EN" : "中"}
        </button>
      </div>

      {/* 中间：下拉框 + 启动按钮 */}
      <div className="home-center-box">
        <ConfigurationSelect onChange={setSelectedConf} />

        {/* 开始编辑按钮 */}
        <button className="home-start-btn" disabled={!btnEnabled} onClick={() => onNew(selectedConf.value)}>
          {t("newConfig")}
        </button>

        {/* 开始编辑按钮 */}
        <button className="home-start-btn" disabled={!btnEnabled} onClick={() => onImport(selectedConf.value)}>
          {t("importConfig")}
        </button>
      </div>
    </div>
  )
}