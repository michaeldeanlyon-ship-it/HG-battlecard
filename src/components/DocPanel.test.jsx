import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DocPanel from './DocPanel.jsx';

const doc = { html: '<h2>Segment A</h2><p>Some copy.</p>' };

describe('DocPanel read mode', () => {
  it('renders the raw HTML content', () => {
    render(<DocPanel doc={doc} isAdmin={false} onSave={vi.fn()} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Segment A' })).toBeInTheDocument();
    expect(screen.getByText('Some copy.')).toBeInTheDocument();
  });

  it('hides Edit for non-admins and shows it for admins', () => {
    const { rerender } = render(<DocPanel doc={doc} isAdmin={false} onSave={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();

    rerender(<DocPanel doc={doc} isAdmin={true} onSave={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });
});

describe('DocPanel edit mode', () => {
  async function openEditor(onSave = vi.fn()) {
    const user = userEvent.setup();
    render(<DocPanel doc={doc} isAdmin={true} onSave={onSave} />);
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    return user;
  }

  it('prefills the textarea with the raw HTML', async () => {
    await openEditor();
    expect(screen.getByDisplayValue(doc.html)).toBeInTheDocument();
  });

  it('saves the edited HTML and returns to read mode', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const user = await openEditor(onSave);

    const textarea = screen.getByDisplayValue(doc.html);
    await user.clear(textarea);
    await user.type(textarea, '<h2>New</h2>');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).toHaveBeenCalledWith({ html: '<h2>New</h2>' });
    expect(await screen.findByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('shows an error and stays in edit mode when save fails', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('denied'));
    const user = await openEditor(onSave);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText(/save failed/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(doc.html)).toBeInTheDocument();
  });

  it('discards changes on cancel without calling onSave', async () => {
    const onSave = vi.fn();
    const user = await openEditor(onSave);

    const textarea = screen.getByDisplayValue(doc.html);
    await user.type(textarea, ' extra');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { level: 2, name: 'Segment A' })).toBeInTheDocument();
  });
});
