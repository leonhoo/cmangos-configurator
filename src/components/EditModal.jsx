import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function EditModal({ item, onClose, onConfirm }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({});

  // 只加载一份拷贝，修改只在本地生效
  useEffect(() => {
    if (item) setForm({ ...item });
  }, [item]);

  if (!item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>
          {t('editConfig')}
        </h3>
        <div className="modal-row">
          <span className="modal-label">{t('key')}</span>
          <span className="modal-key">{form.key}</span>
        </div>

        <div className="modal-row">
          <span className="modal-label">{t('value')}</span>
          <input
            autoFocus
            className="modal-input"
            value={form.value || ''}
            onChange={e => setForm({ ...form, value: e.target.value })}
          />
        </div>

        <div className="modal-row">
          <span className="modal-label">{t('description')}</span>
          <div className="modal-desc">{form.desc}</div>
        </div>

        <div className="modal-btns">
          <button className="btn-cancel" onClick={onClose}>{t('cancel')}</button>
          <button className="btn-confirm" onClick={() => onConfirm(form)}>{t('confirm')}</button>
        </div>
      </div>
    </div>
  );
}