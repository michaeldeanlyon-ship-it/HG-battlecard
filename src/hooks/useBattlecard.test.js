import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import useBattlecard from './useBattlecard.js';

vi.mock('../firebase.js', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn((_db, name) => ({ __col: name })),
  doc: vi.fn((_db, col, id) => ({ __col: col, __id: id })),
  onSnapshot: vi.fn(),
  updateDoc: vi.fn(),
}));

function makeSnap(docs) {
  return { docs: docs.map(({ id, data }) => ({ id, data: () => data })) };
}

function wireSnapshots() {
  const callbacks = [];
  const unsubs = [vi.fn(), vi.fn()];
  onSnapshot.mockImplementation((_ref, cb) => {
    callbacks.push(cb);
    return unsubs[callbacks.length - 1];
  });
  return {
    fireCompetitors: (snap) => act(() => callbacks[0](snap)),
    fireContent: (snap) => act(() => callbacks[1](snap)),
    unsubs,
  };
}

describe('useBattlecard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts loading with empty data', () => {
    onSnapshot.mockImplementation(() => () => {});
    const { result } = renderHook(() => useBattlecard());
    expect(result.current.loading).toBe(true);
    expect(result.current.competitors).toEqual([]);
    expect(result.current.content).toEqual({});
  });

  it('sorts competitors by their order field regardless of snapshot order', async () => {
    const { fireCompetitors, fireContent } = wireSnapshots();
    const { result } = renderHook(() => useBattlecard());

    fireCompetitors(makeSnap([
      { id: 'gusto', data: { name: 'Gusto', order: 3 } },
      { id: 'deel', data: { name: 'Deel', order: 0 } },
      { id: 'remote', data: { name: 'Remote', order: 2 } },
    ]));
    fireContent(makeSnap([]));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.competitors.map((c) => c.id)).toEqual(['deel', 'remote', 'gusto']);
    expect(result.current.competitors[0]).toMatchObject({ id: 'deel', name: 'Deel', order: 0 });
  });

  it('keys content docs by their id', async () => {
    const { fireCompetitors, fireContent } = wireSnapshots();
    const { result } = renderHook(() => useBattlecard());

    fireCompetitors(makeSnap([]));
    fireContent(makeSnap([
      { id: 'hireglobal', data: { name: 'HireGlobal' } },
      { id: 'discovery', data: { name: 'Discovery' } },
    ]));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.content.hireglobal).toMatchObject({ id: 'hireglobal', name: 'HireGlobal' });
    expect(result.current.content.discovery).toMatchObject({ id: 'discovery', name: 'Discovery' });
  });

  it('only stops loading once both listeners have reported in', async () => {
    const { fireCompetitors, fireContent } = wireSnapshots();
    const { result } = renderHook(() => useBattlecard());

    fireCompetitors(makeSnap([]));
    expect(result.current.loading).toBe(true);

    fireContent(makeSnap([]));
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('saveCompetitor writes to competitors/{id}', async () => {
    onSnapshot.mockImplementation(() => () => {});
    updateDoc.mockResolvedValue(undefined);
    const { result } = renderHook(() => useBattlecard());

    await act(async () => {
      await result.current.saveCompetitor('deel', { quote: 'new quote' });
    });

    expect(doc).toHaveBeenCalledWith({}, 'competitors', 'deel');
    expect(updateDoc).toHaveBeenCalledWith({ __col: 'competitors', __id: 'deel' }, { quote: 'new quote' });
  });

  it('saveContent writes to content/{id}', async () => {
    onSnapshot.mockImplementation(() => () => {});
    updateDoc.mockResolvedValue(undefined);
    const { result } = renderHook(() => useBattlecard());

    await act(async () => {
      await result.current.saveContent('discovery', { html: '<p>x</p>' });
    });

    expect(doc).toHaveBeenCalledWith({}, 'content', 'discovery');
    expect(updateDoc).toHaveBeenCalledWith({ __col: 'content', __id: 'discovery' }, { html: '<p>x</p>' });
  });

  it('unsubscribes both listeners on unmount', () => {
    const { unsubs } = wireSnapshots();
    const { unmount } = renderHook(() => useBattlecard());

    unmount();

    expect(unsubs[0]).toHaveBeenCalledTimes(1);
    expect(unsubs[1]).toHaveBeenCalledTimes(1);
  });
});
