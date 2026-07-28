import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signOut } from 'firebase/auth';
import useAuth from './hooks/useAuth.js';
import useBattlecard from './hooks/useBattlecard.js';
import App from './App.jsx';

vi.mock('./firebase.js', () => ({ auth: {} }));
vi.mock('firebase/auth', () => ({
  signOut: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
}));
vi.mock('./hooks/useAuth.js', () => ({ default: vi.fn() }));
vi.mock('./hooks/useBattlecard.js', () => ({ default: vi.fn() }));

const competitors = [
  {
    id: 'deel',
    name: 'Deel',
    stats: [{ label: 'EOR', value: '$599/mo' }],
    weak: ['Expensive'],
    push: ['We are cheaper'],
    quote: 'Deel quote',
  },
  {
    id: 'rippling',
    name: 'Rippling',
    stats: [{ label: 'EOR', value: '$499/mo' }],
    weak: ['Opaque'],
    push: ['We are transparent'],
    quote: 'Rippling quote',
  },
];

const content = {
  hireglobal: {
    name: 'HireGlobal',
    stats: [{ label: 'EOR', value: '$399/mo' }],
    strengths: ['Cheapest'],
    watch: ['Thin reviews'],
    quote: 'HireGlobal quote',
  },
  objectionHandling: { name: 'Objection handling', html: '<h2>Segment A</h2>' },
  discovery: { name: 'Discovery', html: '<h2>Challenges</h2>' },
};

function mockSignedOut() {
  useAuth.mockReturnValue({ user: null, isAdmin: false, loading: false });
  useBattlecard.mockReturnValue({
    competitors: [], content: {}, loading: true, saveCompetitor: vi.fn(), saveContent: vi.fn(),
  });
}

function mockSignedIn({ isAdmin = false, battlecardLoading = false, comps = competitors, cont = content } = {}) {
  useAuth.mockReturnValue({
    user: { email: 'rep@example.com', uid: 'u1' },
    isAdmin,
    loading: false,
  });
  useBattlecard.mockReturnValue({
    competitors: comps,
    content: cont,
    loading: battlecardLoading,
    saveCompetitor: vi.fn().mockResolvedValue(undefined),
    saveContent: vi.fn().mockResolvedValue(undefined),
  });
}

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a loading state while auth is resolving', () => {
    useAuth.mockReturnValue({ user: null, isAdmin: false, loading: true });
    useBattlecard.mockReturnValue({ competitors: [], content: {}, loading: true, saveCompetitor: vi.fn(), saveContent: vi.fn() });

    render(<App />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('shows the login screen when signed out', () => {
    mockSignedOut();
    render(<App />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('lists tabs in order: competitors, then HireGlobal accented, then the doc tabs', () => {
    mockSignedIn();
    render(<App />);

    const tabs = screen.getAllByRole('button').filter((b) =>
      ['Deel', 'Rippling', 'HireGlobal', 'Objection handling', 'Discovery'].includes(b.textContent),
    );
    expect(tabs.map((t) => t.textContent)).toEqual([
      'Deel', 'Rippling', 'HireGlobal', 'Objection handling', 'Discovery',
    ]);
    expect(screen.getByText('HireGlobal')).toHaveClass('hg');
    expect(screen.getByText('Deel')).not.toHaveClass('hg');
  });

  it('defaults to the first tab and shows its panel', () => {
    mockSignedIn();
    render(<App />);
    expect(screen.getByText('Deel')).toHaveClass('active');
    expect(screen.getByText('Deel quote')).toBeInTheDocument();
  });

  it('switches panels when a different tab is clicked', async () => {
    mockSignedIn();
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('HireGlobal'));
    expect(screen.getByText('HireGlobal quote')).toBeInTheDocument();
    expect(screen.getByText('Strengths to lead with')).toBeInTheDocument();

    await user.click(screen.getByText('Discovery'));
    expect(screen.getByRole('heading', { level: 2, name: 'Challenges' })).toBeInTheDocument();
  });

  it('shows the pricing cheat sheet tab and lets a vendor header jump to that profile', async () => {
    mockSignedIn();
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Pricing cheat sheet' }));
    expect(screen.getByText('$599/mo')).toBeInTheDocument();
    expect(screen.getByText('$399/mo')).toBeInTheDocument();

    const table = screen.getByRole('table');
    await user.click(within(table).getByRole('button', { name: 'Rippling' }));
    expect(screen.getByText('Rippling quote')).toBeInTheDocument();
  });

  it('shows a loading indicator in the panel while battlecard data is loading', () => {
    mockSignedIn({ battlecardLoading: true });
    render(<App />);
    expect(screen.getByText('Loading…', { selector: '.stat-label' })).toBeInTheDocument();
  });

  it('shows a seed hint when there is no content yet', () => {
    mockSignedIn({ comps: [], cont: {} });
    render(<App />);
    expect(screen.getByText('No content yet — run the seed script.')).toBeInTheDocument();
  });

  it('only shows Edit affordances to admins', () => {
    mockSignedIn({ isAdmin: false });
    const { rerender } = render(<App />);
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();

    mockSignedIn({ isAdmin: true });
    rerender(<App />);
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('signs out via the firebase auth SDK', async () => {
    mockSignedIn();
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Sign out'));

    expect(signOut).toHaveBeenCalledWith({});
  });
});
