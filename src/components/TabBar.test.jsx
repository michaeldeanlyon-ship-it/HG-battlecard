import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TabBar from './TabBar.jsx';

const tabs = [
  { key: 'deel', name: 'Deel' },
  { key: 'hireglobal', name: 'HireGlobal', accent: true },
  { key: 'discovery', name: 'Discovery' },
];

describe('TabBar', () => {
  it('renders one button per tab, in order', () => {
    render(<TabBar tabs={tabs} active="deel" onSelect={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.map((b) => b.textContent)).toEqual(['Deel', 'HireGlobal', 'Discovery']);
  });

  it('marks only the active tab as active', () => {
    render(<TabBar tabs={tabs} active="discovery" onSelect={() => {}} />);
    expect(screen.getByText('Deel')).not.toHaveClass('active');
    expect(screen.getByText('Discovery')).toHaveClass('active');
  });

  it('gives the accent tab the hg class regardless of active state', () => {
    render(<TabBar tabs={tabs} active="deel" onSelect={() => {}} />);
    expect(screen.getByText('HireGlobal')).toHaveClass('hg');
    expect(screen.getByText('Deel')).not.toHaveClass('hg');
  });

  it('calls onSelect with the clicked tab key', async () => {
    const onSelect = vi.fn();
    render(<TabBar tabs={tabs} active="deel" onSelect={onSelect} />);

    await userEvent.click(screen.getByText('Discovery'));

    expect(onSelect).toHaveBeenCalledWith('discovery');
  });
});
