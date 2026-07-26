import { describe, it, expect } from 'vitest';
import { competitors, hireglobal, objectionHandling, discovery } from './seedData.js';

const COMPETITOR_IDS = ['deel', 'rippling', 'remote', 'gusto', 'adp'];

function expectNonEmptyStringArray(arr) {
  expect(Array.isArray(arr)).toBe(true);
  expect(arr.length).toBeGreaterThan(0);
  arr.forEach((s) => expect(typeof s).toBe('string'));
  arr.forEach((s) => expect(s.trim().length).toBeGreaterThan(0));
}

describe('seedData competitors', () => {
  it('has exactly the five expected competitor ids', () => {
    expect(Object.keys(competitors).sort()).toEqual([...COMPETITOR_IDS].sort());
  });

  it.each(COMPETITOR_IDS)('%s has a well-formed profile', (id) => {
    const c = competitors[id];
    expect(typeof c.name).toBe('string');
    expect(c.name.length).toBeGreaterThan(0);
    expect(typeof c.order).toBe('number');

    expect(Array.isArray(c.stats)).toBe(true);
    expect(c.stats.length).toBeGreaterThan(0);
    c.stats.forEach((s) => {
      expect(typeof s.label).toBe('string');
      expect(typeof s.value).toBe('string');
      expect(s.label.length).toBeGreaterThan(0);
      expect(s.value.length).toBeGreaterThan(0);
    });

    expectNonEmptyStringArray(c.weak);
    expectNonEmptyStringArray(c.push);
    expect(typeof c.quote).toBe('string');
    expect(c.quote.length).toBeGreaterThan(0);
  });
});

describe('seedData hireglobal', () => {
  it('has a well-formed profile with strengths/watch instead of weak/push', () => {
    expect(hireglobal.name).toBe('HireGlobal');
    expect(Array.isArray(hireglobal.stats)).toBe(true);
    expect(hireglobal.stats.length).toBeGreaterThan(0);
    expectNonEmptyStringArray(hireglobal.strengths);
    expectNonEmptyStringArray(hireglobal.watch);
    expect(hireglobal.quote.length).toBeGreaterThan(0);
  });
});

describe('seedData doc pages', () => {
  it.each([
    ['objectionHandling', objectionHandling],
    ['discovery', discovery],
  ])('%s has a name and non-empty HTML', (_label, page) => {
    expect(typeof page.name).toBe('string');
    expect(page.name.length).toBeGreaterThan(0);
    expect(typeof page.html).toBe('string');
    expect(page.html.length).toBeGreaterThan(0);
    expect(page.html).toContain('<h2>');
  });

  it('discovery preserves the Required question tagging', () => {
    expect(discovery.html).toContain('class="req"');
    expect(discovery.html).toContain('>Required<');
  });

  it('objectionHandling preserves the quick-reference comparison table', () => {
    expect(objectionHandling.html).toContain('<table>');
    expect(objectionHandling.html).toContain('<th>');
  });
});

describe('seedData tab order', () => {
  it('assigns every competitor plus hireglobal plus the two doc pages a unique order, 0 through 7', () => {
    const orders = [
      ...COMPETITOR_IDS.map((id) => competitors[id].order),
      hireglobal.order,
      objectionHandling.order,
      discovery.order,
    ];
    expect(new Set(orders).size).toBe(orders.length);
    expect([...orders].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });
});
