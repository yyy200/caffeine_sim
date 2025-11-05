import "./CaffeineReferenceTooltip.css";

function CaffeineReferenceTooltip() {
  return (
    <span className="hint-icon" title="Common caffeine values">
      ℹ️
      <div className="tooltip">
        <div className="tooltip-content">
          <strong>Common Caffeine Values:</strong>
          <ul className="caffeine-reference">
            <li>Espresso (1 shot): ~64 mg</li>
            <li>Brewed Coffee (240 ml): ~95 mg</li>
            <li>Decaf Coffee (240 ml): ~2-5 mg</li>
            <li>Black Tea (240 ml): ~47 mg</li>
            <li>Green Tea (240 ml): ~28 mg</li>
            <li>Energy Drink (240 ml): ~80-200 mg</li>
            <li>Cola (355 ml): ~34 mg</li>
            <li>Dark Chocolate (30 g): ~12 mg</li>
          </ul>
        </div>
      </div>
    </span>
  );
}

export default CaffeineReferenceTooltip;

