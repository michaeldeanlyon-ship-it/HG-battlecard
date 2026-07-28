import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PricingCheatSheet from './PricingCheatSheet.jsx';

const hireglobal = {
  name: 'HireGlobal',
  stats: [
    { label: 'Contractor Management', value: '$19/mo' },
    { label: 'Employer of Record', value: '$399/mo' },
  ],
};

const competitors = [
  {
    id: 'deel',
    name: 'Deel',
    stats: [{ label: 'EOR', value: '$599–899/mo' }],
  },
];

describe('PricingCheatSheet', () => {
  it('renders a tier row per canonical tier and a value cell per vendor', () => {
    render(<PricingCheatSheet hireglobal={hireglobal} competitors={competitors} onSelectVendor={vi.fn()} />);

    expect(screen.getByText('Contractor Management')).toBeInTheDocument();
    expect(screen.getByText('Employer of Record')).toBeInTheDocument();
    expect(screen.getByText('$19/mo')).toBeInTheDocument();
    expect(screen.getByText('$399/mo')).toBeInTheDocument();
    expect(screen.getByText('$599–899/mo')).toBeInTheDocument();
  });

  it('shows Not offered for a vendor with no stat for a tier', () => {
    render(<PricingCheatSheet hireglobal={hireglobal} competitors={competitors} onSelectVendor={vi.fn()} />);
    expect(screen.getAllByText('Not offered').length).toBeGreaterThan(0);
  });

  it('renders each vendor name as a clickable header that calls onSelectVendor with its key', async () => {
    const onSelectVendor = vi.fn();
    const user = userEvent.setup();
    render(<PricingCheatSheet hireglobal={hireglobal} competitors={competitors} onSelectVendor={onSelectVendor} />);

    await user.click(screen.getByRole('button', { name: 'Deel' }));
    expect(onSelectVendor).toHaveBeenCalledWith('deel');

    await user.click(screen.getByRole('button', { name: 'HireGlobal' }));
    expect(onSelectVendor).toHaveBeenCalledWith('hireglobal');
  });
});
