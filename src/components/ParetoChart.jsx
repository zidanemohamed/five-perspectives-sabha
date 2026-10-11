import React from 'react';

export default function ParetoChart({ currentKaurava = 92, currentPandava = 62, currentRound = 1 }) {
  // Chart dimensions
  const width = 540;
  const height = 360;
  const padding = 50;

  // Scale functions
  const toSvgX = (val) => padding + (val / 100) * (width - 2 * padding);
  const toSvgY = (val) => height - padding - (val / 100) * (height - 2 * padding);

  // Key Strategic Coordinates
  const batnaWar = { k: 0, p: 25, label: 'BATNA (Kurukshetra War)', type: 'danger' };
  const statusQuo = { k: 98, p: 12, label: 'Status Quo (Pandava Exile)', type: 'neutral' };
  const fiveVillages = { k: 92, p: 62, label: 'Krishna’s 5 Villages Offer', type: 'pareto' };
  const equalPartition = { k: 75, p: 75, label: 'Imperial Partition', type: 'pareto' };
  const currentPos = { k: currentKaurava, p: currentPandava, label: `Round ${currentRound} State`, type: 'current' };

  // Pareto Frontier Curve path (concave contract curve: Y = 100 - (X^1.4)/25)
  const curvePoints = [];
  for (let x = 0; x <= 100; x += 5) {
    const y = Math.max(0, 100 - Math.pow(x, 1.45) / 25.5);
    curvePoints.push(`${toSvgX(x)},${toSvgY(y)}`);
  }
  const paretoCurveD = `M ${curvePoints.join(' L ')}`;

  return (
    <div className="pareto-chart-container" style={{ position: 'relative' }}>
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        style={{ width: '100%', height: 'auto', backgroundColor: '#fbf4df', border: '1px solid #dcc58a' }}
      >
        {/* Grid lines (engraved) */}
        {[20, 40, 60, 80].map((tick) => (
          <g key={tick}>
            <line 
              x1={toSvgX(tick)} 
              y1={padding} 
              x2={toSvgX(tick)} 
              y2={height - padding} 
              stroke="#e6d4a6" 
              strokeDasharray="2,3" 
            />
            <line 
              x1={padding} 
              y1={toSvgY(tick)} 
              x2={width - padding} 
              y2={toSvgY(tick)} 
              stroke="#e6d4a6" 
              strokeDasharray="2,3" 
            />
            {/* Axis Tick Labels */}
            <text x={toSvgX(tick)} y={height - padding + 18} fill="#8a6a4a" fontSize="10" textAnchor="middle" fontFamily="Outfit">
              {tick}
            </text>
            <text x={padding - 12} y={toSvgY(tick) + 3} fill="#8a6a4a" fontSize="10" textAnchor="end" fontFamily="Outfit">
              {tick}
            </text>
          </g>
        ))}

        {/* Axes */}
        <line x1={padding} y1={height - padding} x2={width - padding + 15} y2={height - padding} stroke="#a8802f" strokeWidth="1.5" />
        <line x1={padding} y1={height - padding} x2={padding} y2={padding - 15} stroke="#a8802f" strokeWidth="1.5" />

        {/* Axis Titles */}
        <text 
          x={width / 2} 
          y={height - 12} 
          fill="#a8802f" 
          fontSize="11" 
          fontFamily="Cinzel" 
          letterSpacing="0.1em" 
          textAnchor="middle"
        >
          Kaurava / Duryodhana Utility →
        </text>

        <text 
          transform={`rotate(-90)`}
          x={-height / 2} 
          y={16} 
          fill="#a8802f" 
          fontSize="11" 
          fontFamily="Cinzel" 
          letterSpacing="0.1em" 
          textAnchor="middle"
        >
          Pandava / Proposer Utility →
        </text>

        {/* Sub-Optimal War Region Polygon */}
        <rect 
          x={padding} 
          y={toSvgY(35)} 
          width={toSvgX(30) - padding} 
          height={toSvgY(0) - toSvgY(35)} 
          fill="#ecc9bf" 
          opacity="0.35" 
        />
        <text x={toSvgX(15)} y={toSvgY(15)} fill="#a3262a" fontSize="9" textAnchor="middle" fontFamily="Outfit">
          War Trap Zone (Zero-Sum Defection)
        </text>

        {/* Pareto Optimal Curve */}
        <path d={paretoCurveD} fill="none" stroke="#4f7a4a" strokeWidth="2.5" />
        <text x={toSvgX(65)} y={toSvgY(85)} fill="#2f6b3b" fontSize="10" fontFamily="Cinzel" letterSpacing="0.08em">
          Pareto Efficient Frontier
        </text>

        {/* BATNA Point */}
        <circle cx={toSvgX(batnaWar.k)} cy={toSvgY(batnaWar.p)} r="6" fill="#8b1d1d" stroke="#fdf7e6" strokeWidth="1.5" />
        <text x={toSvgX(batnaWar.k) + 8} y={toSvgY(batnaWar.p) - 8} fill="#a3262a" fontSize="10" fontFamily="Outfit" fontWeight="600">
          BATNA (War: 0, 25)
        </text>

        {/* Five Villages Point */}
        <circle cx={toSvgX(fiveVillages.k)} cy={toSvgY(fiveVillages.p)} r="7" fill="#a8802f" stroke="#fbf4df" strokeWidth="2" />
        <text x={toSvgX(fiveVillages.k) - 10} y={toSvgY(fiveVillages.p) - 12} fill="#a8802f" fontSize="10" fontFamily="Cinzel" fontWeight="700">
          5 Villages Accord (92, 62)
        </text>

        {/* Equal Partition */}
        <circle cx={toSvgX(equalPartition.k)} cy={toSvgY(equalPartition.p)} r="5" fill="#3d6b3a" />
        <text x={toSvgX(equalPartition.k) + 8} y={toSvgY(equalPartition.p) + 4} fill="#3f7a46" fontSize="9" fontFamily="Outfit">
          50/50 Partition (75, 75)
        </text>

        {/* Current Round Marker with Reticle */}
        <circle cx={toSvgX(currentPos.k)} cy={toSvgY(currentPos.p)} r="8" fill="none" stroke="#9a6f1f" strokeWidth="2" strokeDasharray="3,2" />
        <circle cx={toSvgX(currentPos.k)} cy={toSvgY(currentPos.p)} r="4" fill="#9a6f1f" />
        <text x={toSvgX(currentPos.k) + 12} y={toSvgY(currentPos.p) + 4} fill="#9a6f1f" fontSize="10" fontFamily="Cinzel" fontWeight="700">
          Current Offer ({currentPos.k}, {currentPos.p})
        </text>
      </svg>

      <div style={{ marginTop: '12px', fontSize: '12px', color: '#4a2a22', lineHeight: '1.5' }}>
        <strong style={{ color: '#a8802f' }}>Game-Theoretic Insight:</strong> The <em>Five Villages Compromise</em> (92, 62) is strictly <strong>Pareto-superior</strong> to the Kurukshetra War BATNA (0, 25). Kauravas sacrifice only 8% of territory, yet avoid total dynasty extinction. Duryodhana’s rejection was an irrational defect move caused by psychological hubris and status loss aversion.
      </div>
    </div>
  );
}
