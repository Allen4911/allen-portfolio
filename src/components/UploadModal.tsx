import { useState } from 'react';
import { useLang } from '../contexts/LangContext';
import './UploadModal.css';

export default function UploadModal({ file, defaultMeta, queueCount, onConfirm, onCancel }) {
  const { t } = useLang();
  const [title, setTitle] = useState(defaultMeta.title || file.name.replace(/\.md$/, ''));
  const [date, setDate] = useState(defaultMeta.date || new Date().toISOString().slice(0, 10));
  const [tags, setTags] = useState(defaultMeta.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [summary, setSummary] = useState(defaultMeta.summary || '');

  const addTag = (raw) => {
    const tag = raw.trim().replace(/,$/, '');
    if (tag && !tags.includes(tag)) setTags((prev) => [...prev, tag]);
    setTagInput('');
  };

  const onTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const handleConfirm = () => {
    if (tagInput.trim()) addTag(tagInput);
    onConfirm({
      title: title.trim() || file.name.replace(/\.md$/, ''),
      date,
      tags: tagInput.trim()
        ? [...tags, ...(tags.includes(tagInput.trim()) ? [] : [tagInput.trim()])]
        : tags,
      summary: summary.trim(),
    });
  };

  return (
    <div className="umodal-overlay" onClick={onCancel}>
      <div className="umodal" onClick={(e) => e.stopPropagation()}>
        <div className="umodal-header">
          <span className="umodal-filename">{file.name}</span>
          {queueCount > 1 && (
            <span className="umodal-queue">{t.study.modalQueue(queueCount)}</span>
          )}
        </div>

        <h3 className="umodal-title">{t.study.modalTitle}</h3>

        <div className="umodal-field">
          <label className="umodal-label">{t.study.modalFieldTitle}</label>
          <input
            className="umodal-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.study.modalFieldTitle}
            autoFocus
          />
        </div>

        <div className="umodal-field">
          <label className="umodal-label">
            {t.study.modalFieldDate}
            <span className="umodal-auto-badge">{t.study.modalAutoDate}</span>
          </label>
          <input
            className="umodal-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="umodal-field">
          <label className="umodal-label">{t.study.modalFieldTags}</label>
          <div className="umodal-tags-box">
            {tags.map((tag) => (
              <span key={tag} className="umodal-tag">
                {tag}
                <button
                  type="button"
                  className="umodal-tag-remove"
                  onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              className="umodal-tag-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onTagKeyDown}
              onBlur={() => tagInput.trim() && addTag(tagInput)}
              placeholder={tags.length === 0 ? t.study.modalTagPlaceholder : ''}
            />
          </div>
          <p className="umodal-hint">{t.study.modalTagHint}</p>
        </div>

        <div className="umodal-field">
          <label className="umodal-label">{t.study.modalFieldSummary}</label>
          <textarea
            className="umodal-textarea"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            placeholder={t.study.modalSummaryPlaceholder}
          />
        </div>

        <div className="umodal-actions">
          <button className="umodal-cancel" onClick={onCancel}>
            {t.study.modalCancel}
          </button>
          <button className="umodal-confirm" onClick={handleConfirm}>
            {t.study.modalConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}
