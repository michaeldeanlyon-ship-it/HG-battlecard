import { useState } from 'react';
import StatGrid from './StatGrid.jsx';

const toLines = (arr) => (arr || []).join('\n');
const fromLines = (text) => text.split('\n').map((s) => s.trim()).filter(Boolean);

export default function ProfilePanel({ doc, lists, isAdmin, onSave }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <ProfileEditor
        doc={doc}
        lists={lists}
        onCancel={() => setEditing(false)}
        onSave={onSave}
        onSaved={() => setEditing(false)}
      />
    );
  }

  return (
    <>
      {isAdmin && (
        <div className="panel-head">
          <button className="btn ghost" onClick={() => setEditing(true)}>Edit</button>
        </div>
      )}

      <StatGrid stats={doc.stats} />

      {lists.map((list) => (
        <div className="section" key={list.key}>
          <p className="section-title">
            <span className={`dot ${list.dot}`} />
            {list.title}
          </p>
          <ul>
            {(doc[list.key] || []).map((item, i) => (
              <li className={list.li} key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}

      <div className="section">
        <p className="section-title">Say it like this</p>
        <p className="quote">{doc.quote}</p>
      </div>
    </>
  );
}

function ProfileEditor({ doc, lists, onCancel, onSave, onSaved }) {
  const [stats, setStats] = useState(doc.stats || []);
  const [text, setText]   = useState(() =>
    Object.fromEntries(lists.map((l) => [l.key, toLines(doc[l.key])])),
  );
  const [quote, setQuote] = useState(doc.quote || '');
  const [error, setError] = useState('');
  const [busy, setBusy]   = useState(false);

  function updateStat(index, field, value) {
    setStats(stats.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  async function handleSave() {
    setBusy(true);
    setError('');
    const patch = {
      stats: stats.filter((s) => s.label.trim() || s.value.trim()),
      quote,
    };
    lists.forEach((l) => { patch[l.key] = fromLines(text[l.key]); });

    try {
      await onSave(patch);
      onSaved();
    } catch {
      setError('Save failed — you may not have edit access. Nothing was changed.');
      setBusy(false);
    }
  }

  return (
    <>
      <div className="edit-group">
        <p className="section-title">Stats</p>
        {stats.map((s, i) => (
          <div className="stat-row" key={i}>
            <input
              className="input"
              value={s.label}
              placeholder="Label"
              onChange={(e) => updateStat(i, 'label', e.target.value)}
            />
            <input
              className="input"
              value={s.value}
              placeholder="Value"
              onChange={(e) => updateStat(i, 'value', e.target.value)}
            />
            <button
              className="icon-btn"
              title="Remove stat"
              onClick={() => setStats(stats.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </div>
        ))}
        <button
          className="btn ghost"
          onClick={() => setStats([...stats, { label: '', value: '' }])}
        >
          Add stat
        </button>
      </div>

      {lists.map((list) => (
        <div className="edit-group" key={list.key}>
          <p className="section-title">{list.title}</p>
          <p className="edit-hint">One item per line.</p>
          <textarea
            className="textarea"
            rows={7}
            value={text[list.key]}
            onChange={(e) => setText({ ...text, [list.key]: e.target.value })}
          />
        </div>
      ))}

      <div className="edit-group">
        <p className="section-title">Say it like this</p>
        <textarea
          className="textarea"
          rows={4}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
        />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="edit-actions">
        <button className="btn" onClick={handleSave} disabled={busy}>
          {busy ? 'Saving…' : 'Save'}
        </button>
        <button className="btn ghost" onClick={onCancel} disabled={busy}>Cancel</button>
      </div>
    </>
  );
}
