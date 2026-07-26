import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import useAuth from './useAuth.js';

vi.mock('../firebase.js', () => ({ auth: {}, db: {} }));
vi.mock('firebase/auth', () => ({ onAuthStateChanged: vi.fn() }));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({ __ref: true })),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  onSnapshot: vi.fn(),
}));

function wireAuthCallback() {
  let callback;
  onAuthStateChanged.mockImplementation((_auth, cb) => {
    callback = cb;
    return () => {};
  });
  return (user) => act(() => callback(user));
}

function wireSnapshotCallback() {
  let callback;
  onSnapshot.mockImplementation((_ref, cb) => {
    callback = cb;
    return () => {};
  });
  return (snap) => act(() => callback(snap));
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getDoc.mockResolvedValue({ exists: () => true, data: () => ({ role: 'viewer' }) });
    setDoc.mockResolvedValue(undefined);
  });

  it('starts in a loading state', () => {
    onAuthStateChanged.mockImplementation(() => () => {});
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
  });

  it('resolves to a signed-out state when there is no user', async () => {
    const fireAuth = wireAuthCallback();
    const { result } = renderHook(() => useAuth());

    fireAuth(null);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.role).toBeNull();
    expect(result.current.isAdmin).toBe(false);
  });

  it('self-provisions a viewer doc for a brand-new user', async () => {
    const fireAuth = wireAuthCallback();
    getDoc.mockResolvedValue({ exists: () => false });
    onSnapshot.mockImplementation(() => () => {});

    renderHook(() => useAuth());
    fireAuth({ uid: 'new-uid', email: 'new@example.com' });

    await waitFor(() =>
      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        { email: 'new@example.com', role: 'viewer' },
      ),
    );
    expect(doc).toHaveBeenCalledWith({}, 'users', 'new-uid');
  });

  it('does not touch an existing user doc', async () => {
    const fireAuth = wireAuthCallback();
    getDoc.mockResolvedValue({ exists: () => true, data: () => ({ role: 'admin' }) });
    onSnapshot.mockImplementation(() => () => {});

    renderHook(() => useAuth());
    fireAuth({ uid: 'existing-uid', email: 'existing@example.com' });

    await waitFor(() => expect(getDoc).toHaveBeenCalled());
    expect(setDoc).not.toHaveBeenCalled();
  });

  it('reflects role changes live and derives isAdmin from them', async () => {
    const fireAuth = wireAuthCallback();
    const fireSnapshot = wireSnapshotCallback();

    const { result } = renderHook(() => useAuth());
    fireAuth({ uid: 'abc', email: 'a@example.com' });
    await waitFor(() => expect(onSnapshot).toHaveBeenCalled());

    fireSnapshot({ exists: () => true, data: () => ({ role: 'viewer' }) });
    await waitFor(() => expect(result.current.role).toBe('viewer'));
    expect(result.current.isAdmin).toBe(false);

    fireSnapshot({ exists: () => true, data: () => ({ role: 'admin' }) });
    await waitFor(() => expect(result.current.isAdmin).toBe(true));
  });

  it('defaults role to viewer if the user doc snapshot does not exist', async () => {
    const fireAuth = wireAuthCallback();
    const fireSnapshot = wireSnapshotCallback();

    const { result } = renderHook(() => useAuth());
    fireAuth({ uid: 'abc', email: 'a@example.com' });
    await waitFor(() => expect(onSnapshot).toHaveBeenCalled());

    fireSnapshot({ exists: () => false });
    await waitFor(() => expect(result.current.role).toBe('viewer'));
    expect(result.current.isAdmin).toBe(false);
  });
});
