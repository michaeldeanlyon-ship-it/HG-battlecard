import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase.js';
import useAuth from './hooks/useAuth.js';
import useBattlecard from './hooks/useBattlecard.js';
import LoginScreen from './components/LoginScreen.jsx';
import TabBar from './components/TabBar.jsx';
import ProfilePanel from './components/ProfilePanel.jsx';
import DocPanel from './components/DocPanel.jsx';

const COMPETITOR_LISTS = [
  { key: 'weak', title: "Where they're weak", dot: 'red',   li: 'weak' },
  { key: 'push', title: 'Push back with',     dot: 'green', li: 'push' },
];

const HIREGLOBAL_LISTS = [
  { key: 'strengths', title: 'Strengths to lead with', dot: 'green', li: 'push' },
  { key: 'watch',     title: 'Know before they ask',   dot: 'blue',  li: 'info' },
];

const DOC_IDS = ['objectionHandling', 'discovery'];

export default function App() {
  const { user, isAdmin, loading: authLoading } = useAuth();

  if (authLoading) return <div className="centered">Loading…</div>;
  if (!user) return <LoginScreen />;
  return <Battlecard user={user} isAdmin={isAdmin} />;
}

function Battlecard({ user, isAdmin }) {
  const { competitors, content, loading, saveCompetitor, saveContent } = useBattlecard();
  const [selected, setSelected] = useState(null);

  const tabs = [
    ...competitors.map((c) => ({ key: c.id, name: c.name, kind: 'competitor' })),
    ...(content.hireglobal
      ? [{ key: 'hireglobal', name: content.hireglobal.name, kind: 'own', accent: true }]
      : []),
    ...DOC_IDS.filter((id) => content[id]).map((id) => ({
      key: id,
      name: content[id].name,
      kind: 'doc',
    })),
  ];

  const active = tabs.some((t) => t.key === selected) ? selected : tabs[0]?.key;
  const activeTab = tabs.find((t) => t.key === active);

  return (
    <div className="wrap">
      <div className="topbar">
        <div>
          <p className="eyebrow">HireGlobal / call prep</p>
          <h1>Sales battlecard</h1>
        </div>
        <div className="topbar-user">
          <span className="topbar-email">{user.email}</span>
          <button className="linkbtn" onClick={() => signOut(auth)}>Sign out</button>
        </div>
      </div>

      <TabBar tabs={tabs} active={active} onSelect={setSelected} />

      <div className="panel">
        {loading ? (
          <p className="stat-label">Loading…</p>
        ) : !activeTab ? (
          <p className="stat-label">No content yet — run the seed script.</p>
        ) : activeTab.kind === 'competitor' ? (
          <ProfilePanel
            key={activeTab.key}
            doc={competitors.find((c) => c.id === activeTab.key)}
            lists={COMPETITOR_LISTS}
            isAdmin={isAdmin}
            onSave={(patch) => saveCompetitor(activeTab.key, patch)}
          />
        ) : activeTab.kind === 'own' ? (
          <ProfilePanel
            key={activeTab.key}
            doc={content.hireglobal}
            lists={HIREGLOBAL_LISTS}
            isAdmin={isAdmin}
            onSave={(patch) => saveContent('hireglobal', patch)}
          />
        ) : (
          <DocPanel
            key={activeTab.key}
            doc={content[activeTab.key]}
            isAdmin={isAdmin}
            onSave={(patch) => saveContent(activeTab.key, patch)}
          />
        )}
      </div>
    </div>
  );
}
