import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js';

const MESSAGES = {
  'auth/invalid-email':      'That email address looks malformed.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/user-not-found':     'Email or password is incorrect.',
  'auth/wrong-password':     'Email or password is incorrect.',
  'auth/user-disabled':      'That account has been disabled.',
  'auth/too-many-requests':  'Too many attempts. Wait a minute and try again.',
  'auth/network-request-failed': 'Network problem — check your connection.',
};

export default function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [busy, setBusy]         = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(MESSAGES[err.code] || 'Could not sign in. Try again.');
      setBusy(false);
    }
  }

  return (
    <form className="login-card" onSubmit={handleSubmit}>
      <p className="eyebrow">HireGlobal / call prep</p>
      <h1>Sales battlecard</h1>
      <p className="login-sub">Sign in with your team account.</p>

      {error && <p className="error">{error}</p>}

      <label className="field">
        <span className="field-label">Email</span>
        <input
          className="input"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="field">
        <span className="field-label">Password</span>
        <input
          className="input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      <button className="btn full" type="submit" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
