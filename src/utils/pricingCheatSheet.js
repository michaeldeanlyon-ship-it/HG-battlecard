const NOT_OFFERED = 'Not offered';

const CANONICAL_TIERS = [
  'Contractor Management',
  'Agent of Record',
  'Virtual EOR',
  'Employer of Record',
];

const TIER_ALIASES = {
  'contractor management': 'Contractor Management',
  'contractor mgmt': 'Contractor Management',
  'agent of record': 'Agent of Record',
  'virtual eor': 'Virtual EOR',
  'employer of record': 'Employer of Record',
  'eor': 'Employer of Record',
  'global eor': 'Employer of Record',
  'global/eor': 'Employer of Record',
};

function canonicalTierFor(label) {
  return TIER_ALIASES[label.trim().toLowerCase()] ?? null;
}

export function buildPricingCheatSheet(hireglobal, competitors) {
  const vendors = [
    { key: 'hireglobal', name: hireglobal.name },
    ...competitors.map((c) => ({ key: c.id, name: c.name })),
  ];

  const cellsByTier = new Map(CANONICAL_TIERS.map((tier) => [tier, {}]));
  const extraTierOrder = [];

  vendors.forEach(({ key }) => {
    const doc = key === 'hireglobal' ? hireglobal : competitors.find((c) => c.id === key);
    (doc.stats || []).forEach(({ label, value }) => {
      const tier = canonicalTierFor(label) ?? label;
      if (!cellsByTier.has(tier)) {
        cellsByTier.set(tier, {});
        extraTierOrder.push(tier);
      }
      cellsByTier.get(tier)[key] = value;
    });
  });

  const orderedTiers = [...CANONICAL_TIERS, ...extraTierOrder];
  const rows = orderedTiers.map((tier) => {
    const cells = {};
    vendors.forEach(({ key }) => {
      cells[key] = cellsByTier.get(tier)[key] ?? NOT_OFFERED;
    });
    return { tier, cells };
  });

  return { vendors, rows };
}
