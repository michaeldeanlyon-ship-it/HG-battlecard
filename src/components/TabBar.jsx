export default function TabBar({ tabs, active, onSelect }) {
  return (
    <div className="tabs">
      {tabs.map((tab) => {
        const classes = ['tab'];
        if (tab.accent) classes.push('hg');
        if (tab.key === active) classes.push('active');
        return (
          <button
            key={tab.key}
            className={classes.join(' ')}
            onClick={() => onSelect(tab.key)}
          >
            {tab.name}
          </button>
        );
      })}
    </div>
  );
}
