import { describe, it, expect, vi } from 'vitest';
import { render, screen, within, getDefaultNormalizer } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfilePanel from './ProfilePanel.jsx';

// getByDisplayValue collapses whitespace by default, which merges our
// one-item-per-line textarea content onto a single line. Preserve newlines.
const exact = { normalizer: getDefaultNormalizer({ collapseWhitespace: false }) };
const getByLines = (text) => screen.getByDisplayValue(text, exact);

const lists = [
  { key: 'weak', title: "Where they're weak", dot: 'red', li: 'weak' },
  { key: 'push', title: 'Push back with', dot: 'green', li: 'push' },
];

const doc = {
  stats: [
    { label: 'EOR', value: '$599/mo' },
    { label: 'Lock-in', value: 'Annual' },
  ],
  weak: ['Expensive', 'Opaque FX'],
  push: ['We are cheaper', 'No lock-in'],
  quote: 'Say this to the prospect.',
};

describe('ProfilePanel read mode', () => {
  it('renders stats, both lists with their dot/li classes, and the quote', () => {
    render(<ProfilePanel doc={doc} lists={lists} isAdmin={false} onSave={vi.fn()} />);

    expect(screen.getByText('EOR')).toBeInTheDocument();
    expect(screen.getByText('$599/mo')).toBeInTheDocument();

    expect(screen.getByText('Expensive')).toHaveClass('weak');
    expect(screen.getByText('We are cheaper')).toHaveClass('push');
    expect(document.querySelector('.dot.red')).toBeInTheDocument();
    expect(document.querySelector('.dot.green')).toBeInTheDocument();

    expect(screen.getByText(doc.quote)).toHaveClass('quote');
  });

  it('hides the Edit button for non-admins', () => {
    render(<ProfilePanel doc={doc} lists={lists} isAdmin={false} onSave={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
  });

  it('shows the Edit button for admins', () => {
    render(<ProfilePanel doc={doc} lists={lists} isAdmin={true} onSave={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });
});

describe('ProfilePanel edit mode', () => {
  async function openEditor(onSave = vi.fn()) {
    const user = userEvent.setup();
    render(<ProfilePanel doc={doc} lists={lists} isAdmin={true} onSave={onSave} />);
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    return user;
  }

  it('prefills stat inputs and one list item per line', async () => {
    await openEditor();

    expect(screen.getByDisplayValue('EOR')).toBeInTheDocument();
    expect(screen.getByDisplayValue('$599/mo')).toBeInTheDocument();
    expect(getByLines('Expensive\nOpaque FX')).toBeInTheDocument();
    expect(getByLines('We are cheaper\nNo lock-in')).toBeInTheDocument();
  });

  it('adds and removes stat rows', async () => {
    const user = await openEditor();

    await user.click(screen.getByRole('button', { name: 'Add stat' }));
    expect(screen.getAllByPlaceholderText('Label')).toHaveLength(3);

    await user.click(screen.getAllByTitle('Remove stat')[0]);
    expect(screen.getAllByPlaceholderText('Label')).toHaveLength(2);
    expect(screen.queryByDisplayValue('EOR')).not.toBeInTheDocument();
  });

  it('parses textareas one-item-per-line and drops blank lines on save', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const user = await openEditor(onSave);

    const weakBox = getByLines('Expensive\nOpaque FX');
    await user.clear(weakBox);
    await user.type(weakBox, 'One{enter}{enter}Two ');

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ weak: ['One', 'Two'] }),
    );
  });

  it('filters out stat rows where both label and value are blank', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const user = await openEditor(onSave);

    await user.click(screen.getByRole('button', { name: 'Add stat' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        stats: [
          { label: 'EOR', value: '$599/mo' },
          { label: 'Lock-in', value: 'Annual' },
        ],
      }),
    );
  });

  it('returns to read mode after a successful save', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const user = await openEditor(onSave);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('shows an error and stays in edit mode when save fails', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('denied'));
    const user = await openEditor(onSave);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText(/save failed/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('discards changes on cancel without calling onSave', async () => {
    const onSave = vi.fn();
    const user = await openEditor(onSave);

    const weakBox = getByLines('Expensive\nOpaque FX');
    await user.type(weakBox, ' more text');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText('Expensive')).toBeInTheDocument();
  });
});
