import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatGrid from './StatGrid.jsx';

describe('StatGrid', () => {
  it('renders a label and value for every stat', () => {
    render(
      <StatGrid
        stats={[
          { label: 'EOR', value: '$399/mo' },
          { label: 'Coverage', value: '150–180+ countries' },
        ]}
      />,
    );

    expect(screen.getByText('EOR')).toBeInTheDocument();
    expect(screen.getByText('$399/mo')).toBeInTheDocument();
    expect(screen.getByText('Coverage')).toBeInTheDocument();
    expect(screen.getByText('150–180+ countries')).toBeInTheDocument();
  });

  it('renders nothing but the grid wrapper when stats is empty', () => {
    const { container } = render(<StatGrid stats={[]} />);
    expect(container.querySelectorAll('.stat')).toHaveLength(0);
  });
});
