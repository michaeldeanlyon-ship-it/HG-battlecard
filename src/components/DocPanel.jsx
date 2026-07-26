import { useState } from 'react';

export default function DocPanel({ doc, isAdmin, onSave }) {
  const [editing, setEditing] = useState(false);
  const [html, setHtml]       = useState(doc.html || '');
  const [error, setError]     = useState('');
  const [busy, setBusy]       = useState(false);

  function startEditing() {
    setHtml(doc.html || '');
    setError('');
    setEditing(true);
  }

  async function handleSave() {
    setBusy(true);
    setError('');
    try {
      await onSave({ html });
      setEditing(false);
    } catch {
      setError('Save failed — you may not have edit access. Nothing was changed.');
    }
    setBusy(false);
  }

  if (editing) {
    return (
      <>
        <div className="edit-group">
          <p className="section-title">Content</p>
          <p className="edit-hint">
            Raw HTML. Use &lt;h2&gt; for sections, &lt;h3&gt; for sub-headings, and
            &lt;span class="req"&gt;Required&lt;/span&gt; for the amber Required badge.
          </p>
          <textarea
            className="textarea mono"
            rows={26}
            value={html}
            onChange={(e) => setHtml(e.target.value)}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="edit-actions">
          <button className="btn" onClick={handleSave} disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </button>
          <button className="btn ghost" onClick={() => setEditing(false)} disabled={busy}>
            Cancel
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {isAdmin && (
        <div className="panel-head">
          <button className="btn ghost" onClick={startEditing}>Edit</button>
        </div>
      )}
      <div className="doc doc-scroll" dangerouslySetInnerHTML={{ __html: doc.html || '' }} />
    </>
  );
}
