import { useTranslation } from 'react-i18next';

export default function Home({ onNew, onImport }) {
  const { t, i18n } = useTranslation();
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

      <button className="home-btn" onClick={onNew}>
        {t("newConfig")}
      </button>
      <button className="home-btn" onClick={onImport}>
        {t("importConfig")}
      </button>
    </div>
  )
}