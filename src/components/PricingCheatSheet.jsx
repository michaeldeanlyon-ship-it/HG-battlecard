import { buildPricingCheatSheet } from '../utils/pricingCheatSheet.js';

export default function PricingCheatSheet({ hireglobal, competitors, onSelectVendor }) {
  const { vendors, rows } = buildPricingCheatSheet(hireglobal, competitors);

  return (
    <div className="pricing-scroll">
      <table className="pricing-table">
        <thead>
          <tr>
            <th></th>
            {vendors.map((v) => (
              <th key={v.key}>
                <button
                  className={`linkbtn${v.key === 'hireglobal' ? ' hg' : ''}`}
                  onClick={() => onSelectVendor(v.key)}
                >
                  {v.name}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.tier}>
              <td>{row.tier}</td>
              {vendors.map((v) => (
                <td key={v.key}>{row.cells[v.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
