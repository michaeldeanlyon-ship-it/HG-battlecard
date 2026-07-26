import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase.js';

export default function useAuth() {
  const [user, setUser]       = useState(null);
  const [role, setRole]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) setRole(null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    const ref = doc(db, 'users', user.uid);

    // Self-provision on first login. A concurrent tab (or StrictMode's double-mount) can
    // lose this race and get denied by the create-only rule — harmless, the doc exists.
    getDoc(ref).then((snap) => {
      if (!snap.exists()) {
        return setDoc(ref, { email: user.email, role: 'viewer' }).catch(() => {});
      }
    });

    // Live, so promoting an account in the Firestore console lands without a re-login.
    return onSnapshot(ref, (snap) => {
      setRole(snap.exists() ? snap.data().role : 'viewer');
    });
  }, [user]);

  return { user, role, isAdmin: role === 'admin', loading };
}
