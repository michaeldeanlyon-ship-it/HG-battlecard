import { useCallback, useEffect, useState } from 'react';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

export default function useBattlecard() {
  const [competitors, setCompetitors] = useState([]);
  const [content, setContent]         = useState({});
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    let gotCompetitors = false;
    let gotContent     = false;
    const settle = () => {
      if (gotCompetitors && gotContent) setLoading(false);
    };

    const unsubCompetitors = onSnapshot(collection(db, 'competitors'), (snap) => {
      setCompetitors(
        snap.docs
          .map((d) => ({ ...d.data(), id: d.id }))
          .sort((a, b) => a.order - b.order),
      );
      gotCompetitors = true;
      settle();
    });

    const unsubContent = onSnapshot(collection(db, 'content'), (snap) => {
      const next = {};
      snap.docs.forEach((d) => { next[d.id] = { ...d.data(), id: d.id }; });
      setContent(next);
      gotContent = true;
      settle();
    });

    return () => {
      unsubCompetitors();
      unsubContent();
    };
  }, []);

  const saveCompetitor = useCallback(
    (id, patch) => updateDoc(doc(db, 'competitors', id), patch),
    [],
  );

  const saveContent = useCallback(
    (id, patch) => updateDoc(doc(db, 'content', id), patch),
    [],
  );

  return { competitors, content, loading, saveCompetitor, saveContent };
}
