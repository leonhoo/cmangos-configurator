import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const ConfigurationSelect = ({onChange, defaultValue}) => {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState(defaultValue?.label || t('pleaseSelect'));
  const [selectedValue, setSelectedValue] = useState(defaultValue?.value || '');
  const selectRef = useRef(null);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    setSelected(t('pleaseSelect'));
  }, [i18n.language]);

  const options = [
    { value: "mangosd", label: "mangosd.conf" },
    { value: "realmd", label: "realmd.conf" },
    { value: "ahbot", label: "ahbot.conf" },
    { value: "anticheat", label: "anticheat.conf" },
  ];

  const handleSelect = (item) => {
    setSelected(item.label);
    setSelectedValue(item.value);
    setOpen(false);

    if (onChange) {
      onChange(item);
    }
  };

  return (
    <div
      className="macos-select"
      ref={selectRef}
      style={{
        position: 'relative',
        width: '260px',
        userSelect: 'none',
      }}
    >
      {/* 选择框触发器 */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        style={{
          width: '100%',
          padding: '9px 14px',
          fontSize: '13px',
          color: '#000',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',
          borderColor: open ? '#007aff' : 'rgba(0, 0, 0, 0.12)',
          boxShadow: open ? '0 0 0 3px rgba(0, 122, 255, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        {selected}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: '4px solid #888',
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
          }}
        />
      </div>

      {/* 弹出面板 */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          width: '100%',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
          transform: open ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          zIndex: 999,
        }}
      >
        {options.map((item, index) => (
          <div
            key={item.value}
            onClick={() => handleSelect(item)}
            style={{
              padding: '10px 14px',
              fontSize: '13px',
              color: '#111',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
              borderTop: index > 0 ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
              background: selected === item.label ? '#f0f0f5' : 'transparent',
              fontWeight: selected === item.label ? 500 : 400,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#007aff';
              e.target.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = selected === item.label ? '#f0f0f5' : 'transparent';
              e.target.style.color = '#111';
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfigurationSelect;