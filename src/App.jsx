import React, { useState, useMemo } from 'react';
import { Activity } from 'lucide-react';

const SineWaveVisualizer = () => {
  const [phaseDegree, setPhaseDegree] = useState(0);

  // SVG dimensions
  const width = 800;
  const height = 300;
  const padding = 20;
  
  const drawWave = (phaseOff) => {
    const points = [];
    // 2 full cycles
    const cycles = 2;
    const pointsCount = 200;
    
    // The usable drawing area
    const drawWidth = width - padding * 2;
    const drawHeight = height - padding * 2;
    const cy = height / 2;
    
    // amplitude
    const A = drawHeight / 2;
    
    // frequency
    const freq = (cycles * 2 * Math.PI) / drawWidth;
    
    const phaseRad = phaseOff * (Math.PI / 180);
    
    for (let i = 0; i <= pointsCount; i++) {
      const x = (i / pointsCount) * drawWidth;
      // SVG y is inverted, so we subtract
      const y = cy - A * Math.sin(freq * x + phaseRad);
      points.push(`${x + padding},${y}`);
    }
    
    return `M ${points.join(' L ')}`;
  };

  const parsedPhase = (phaseDegree === '-' || phaseDegree === '') ? 0 : Number(phaseDegree);
  const dynamicWavePath = useMemo(() => drawWave(parsedPhase), [parsedPhase]);
  const referenceWavePath = useMemo(() => drawWave(0), []);

  const handleSliderChange = (e) => {
    setPhaseDegree(Number(e.target.value));
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val === '' || val === '-') {
      setPhaseDegree(val);
    } else if (!isNaN(Number(val))) {
      setPhaseDegree(Number(val));
    }
  };

  const presets = [0, 25, 45, 90, 135, 180, -25, -45, -90, -135, -180];

  return (
    <div className="app-container">
      <div className="glass-panel">
        <h1>
          <Activity size={32} style={{display: 'inline', verticalAlign: 'middle', marginRight: '10px'}} />
          Sine Wave Visualizer
        </h1>
        <p className="subtitle">Interactive visualization of wave phase shifts</p>
        
        <div className="visualization-container">
          <svg viewBox={`0 0 ${width} ${height}`} className="wave-svg" preserveAspectRatio="none">
            {/* Grid */}
            <line x1="0" y1={height/4} x2={width} y2={height/4} className="grid-line" />
            <line x1="0" y1={(height/4)*3} x2={width} y2={(height/4)*3} className="grid-line" />
            
            <line x1={width/4} y1="0" x2={width/4} y2={height} className="grid-line" />
            <line x1={width/2} y1="0" x2={width/2} y2={height} className="grid-line" />
            <line x1={(width/4)*3} y1="0" x2={(width/4)*3} y2={height} className="grid-line" />

            {/* Axes */}
            <line x1="0" y1={height/2} x2={width} y2={height/2} className="axis-line" />
            <line x1={padding} y1="0" x2={padding} y2={height} className="axis-line" />

            {/* Reference Wave (0 phase) */}
            <path d={referenceWavePath} className="reference-wave" />
            
            {/* Dynamic Wave */}
            <path d={dynamicWavePath} className="wave-path" />
          </svg>
        </div>
        
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color legend-primary"></div>
            <span>Current Phase ({parsedPhase}°)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color legend-secondary" style={{opacity: 0.5}}></div>
            <span>Reference (0°)</span>
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <div className="controls-container">
          <div className="control-group">
            <div className="control-header">
              <span className="control-label">Phase Shift (Degrees)</span>
              <span className="control-value">{parsedPhase}°</span>
            </div>
            <input 
              type="range" 
              min="-360" 
              max="360" 
              step="1" 
              value={parsedPhase} 
              onChange={handleSliderChange} 
            />
            <div style={{display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem'}}>
              <span>-360°</span>
              <span>0°</span>
              <span>+360°</span>
            </div>
            
            <div style={{marginTop: '1rem'}}>
              <span className="control-label" style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Custom Value</span>
              <input 
                type="number" 
                value={phaseDegree} 
                onChange={handleInputChange} 
                style={{marginTop: '0.5rem'}}
                placeholder="Enter exact phase degree..."
              />
            </div>
          </div>
          
          <div className="control-group">
            <div className="control-header">
              <span className="control-label">Quick Presets</span>
            </div>
            <div className="presets">
              {presets.map(preset => (
                <button 
                  key={preset}
                  className={`preset-btn ${parsedPhase === preset ? 'active' : ''}`}
                  onClick={() => setPhaseDegree(preset)}
                >
                  {preset > 0 ? `+${preset}°` : `${preset}°`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SineWaveVisualizer;
