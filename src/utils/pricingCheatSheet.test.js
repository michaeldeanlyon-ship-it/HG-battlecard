import { describe, it, expect } from 'vitest';
import { buildPricingCheatSheet } from './pricingCheatSheet.js';

const hireglobal = {
  name: 'HireGlobal',
  stats: [
    { label: 'Contractor Management', value: '$19/mo' },
    { label: 'Agent of Record', value: '$49/mo' },
    { label: 'Virtual EOR', value: '$199/mo — $1M indemnification' },
    { label: 'Employer of Record', value: '$399/mo' },
    { label: 'Coverage', value: '150–180+ countries, 50+ currencies' },
  ],
};

const competitors = [
  {
    id: 'deel',
    name: 'Deel',
    stats: [
      { label: 'Contractor mgmt', value: '$49/mo' },
      { label: 'EOR', value: '$599–899/mo' },
      { label: 'Lock-in', value: 'Month-to-month' },
    ],
  },
  {
    id: 'rippling',
    name: 'Rippling',
    stats: [
      { label: 'Contractor mgmt', value: 'Bundled, not standalone' },
      { label: 'EOR', value: '$499–599/mo, quote-only' },
      { label: 'Lock-in', value: 'Annual + minimum headcount, mandatory' },
    ],
  },
  {
    id: 'adp',
    name: 'ADP',
    stats: [
      { label: 'RUN (US payroll)', value: '~$79/mo + $4/employee' },
      { label: 'Global/EOR', value: 'No standalone EOR — custom quote via partners' },
    ],
  },
];

describe('buildPricingCheatSheet', () => {
  it('lists HireGlobal first, then competitors in the order given', () => {
    const { vendors } = buildPricingCheatSheet(hireglobal, competitors);
    expect(vendors).toEqual([
      { key: 'hireglobal', name: 'HireGlobal' },
      { key: 'deel', name: 'Deel' },
      { key: 'rippling', name: 'Rippling' },
      { key: 'adp', name: 'ADP' },
    ]);
  });

  it('always puts the 4 canonical pricing tiers first, in fixed order', () => {
    const { rows } = buildPricingCheatSheet(hireglobal, competitors);
    expect(rows.slice(0, 4).map((r) => r.tier)).toEqual([
      'Contractor Management',
      'Agent of Record',
      'Virtual EOR',
      'Employer of Record',
    ]);
  });

  it('normalizes differently-worded vendor labels onto the same canonical tier', () => {
    const { rows } = buildPricingCheatSheet(hireglobal, competitors);
    const contractorMgmt = rows.find((r) => r.tier === 'Contractor Management');
    expect(contractorMgmt.cells).toEqual({
      hireglobal: '$19/mo',
      deel: '$49/mo',
      rippling: 'Bundled, not standalone',
      adp: 'Not offered',
    });

    const eor = rows.find((r) => r.tier === 'Employer of Record');
    expect(eor.cells).toEqual({
      hireglobal: '$399/mo',
      deel: '$599–899/mo',
      rippling: '$499–599/mo, quote-only',
      adp: 'No standalone EOR — custom quote via partners',
    });
  });

  it('fills Not offered for tiers a vendor has no stat for', () => {
    const { rows } = buildPricingCheatSheet(hireglobal, competitors);
    const aor = rows.find((r) => r.tier === 'Agent of Record');
    expect(aor.cells).toEqual({
      hireglobal: '$49/mo',
      deel: 'Not offered',
      rippling: 'Not offered',
      adp: 'Not offered',
    });

    const virtualEor = rows.find((r) => r.tier === 'Virtual EOR');
    expect(virtualEor.cells).toEqual({
      hireglobal: '$199/mo — $1M indemnification',
      deel: 'Not offered',
      rippling: 'Not offered',
      adp: 'Not offered',
    });
  });

  it('appends non-tier stats as extra rows, deduplicated by exact label across vendors', () => {
    const { rows } = buildPricingCheatSheet(hireglobal, competitors);
    const extraTiers = rows.slice(4).map((r) => r.tier);
    expect(extraTiers).toEqual(['Coverage', 'Lock-in', 'RUN (US payroll)']);

    const lockIn = rows.find((r) => r.tier === 'Lock-in');
    expect(lockIn.cells).toEqual({
      hireglobal: 'Not offered',
      deel: 'Month-to-month',
      rippling: 'Annual + minimum headcount, mandatory',
      adp: 'Not offered',
    });
  });

  it('gives a vendor-unique stat its own row, with everyone else Not offered', () => {
    const { rows } = buildPricingCheatSheet(hireglobal, competitors);
    const run = rows.find((r) => r.tier === 'RUN (US payroll)');
    expect(run.cells).toEqual({
      hireglobal: 'Not offered',
      deel: 'Not offered',
      rippling: 'Not offered',
      adp: '~$79/mo + $4/employee',
    });
  });
});
