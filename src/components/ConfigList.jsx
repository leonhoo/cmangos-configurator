export default function ({ config, filtered, onItemClick }) {
  const visible = new Set(filtered.map(it => it.key));

  return (
    <div className="config-list">
      {config.map((g, gi) => {
        const items = g.items.filter(it => visible.has(it.key));
        if (items.length === 0) return null;

        return (
          <div key={gi} className="group-section">
            <div className="group-title">{g.name}</div>
            {items.map((it, ii) => (
              <div key={ii} className="config-item" onClick={() => onItemClick(it)}>
                <div className="item-header">
                  <span className="item-key">{it.key}</span>
                  <span className="item-value">{it.value}</span>
                </div>
                <div className="item-desc">{it.desc}</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}