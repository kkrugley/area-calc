import React, { useState, useMemo, useCallback } from 'react';
import { Unit, Dimension } from './types';
import { UNITS, CONVERSION_FACTORS, DEFAULT_CONTINGENCY_PERCENT } from './constants';
import { PlusIcon, TrashIcon, TileIcon } from './components/icons';

const DimensionInputRow: React.FC<{
  dimension: Dimension;
  onChange: (id: string, field: keyof Omit<Dimension, 'id'>, value: string | Unit) => void;
  onRemove: (id: string) => void;
}> = ({ dimension, onChange, onRemove }) => {
  return (
    <div className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg animate-fade-in">
      <div className="grid grid-cols-2 gap-2 flex-grow">
        <div className="relative">
          <label htmlFor={`length-${dimension.id}`} className="absolute -top-2.5 left-2 inline-block bg-slate-700 px-1 text-xs font-medium text-slate-400">
            Length
          </label>
          <input
            id={`length-${dimension.id}`}
            type="number"
            value={dimension.length}
            onChange={(e) => onChange(dimension.id, 'length', e.target.value)}
            placeholder="e.g., 120"
            className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            min="0"
          />
        </div>
        <div className="relative">
          <label htmlFor={`height-${dimension.id}`} className="absolute -top-2.5 left-2 inline-block bg-slate-700 px-1 text-xs font-medium text-slate-400">
            Height
          </label>
          <input
            id={`height-${dimension.id}`}
            type="number"
            value={dimension.height}
            onChange={(e) => onChange(dimension.id, 'height', e.target.value)}
            placeholder="e.g., 60"
            className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            min="0"
          />
        </div>
      </div>
      <div className="relative">
        <label htmlFor={`unit-${dimension.id}`} className="absolute -top-2.5 left-2 inline-block bg-slate-700 px-1 text-xs font-medium text-slate-400">
          Unit
        </label>
        <select
          id={`unit-${dimension.id}`}
          value={dimension.unit}
          onChange={(e) => onChange(dimension.id, 'unit', e.target.value as Unit)}
          className="bg-slate-800 border border-slate-600 rounded-md p-2 h-[42px] focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition appearance-none pr-8 bg-no-repeat bg-right"
          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
        >
          {UNITS.map(unit => <option key={unit.value} value={unit.value}>{unit.label}</option>)}
        </select>
      </div>
      <button onClick={() => onRemove(dimension.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors">
        <TrashIcon />
      </button>
    </div>
  );
};

const ResultCard: React.FC<{ value: string; unit: string; description: string; }> = ({ value, unit, description }) => (
    <div className="bg-slate-800 p-4 rounded-lg text-center transform hover:scale-105 transition-transform">
        <p className="text-slate-400 text-sm">{description}</p>
        <p className="text-3xl font-bold text-cyan-400 break-all">{value}</p>
        <p className="text-slate-500">{unit}</p>
    </div>
);


export default function App() {
  const [dimensions, setDimensions] = useState<Dimension[]>([
    { id: crypto.randomUUID(), length: '2400', height: '1200', unit: Unit.MM }
  ]);
  const [contingencyPercent, setContingencyPercent] = useState<number>(DEFAULT_CONTINGENCY_PERCENT);

  const handleAddDimension = useCallback(() => {
    setDimensions(prev => [...prev, { id: crypto.randomUUID(), length: '', height: '', unit: Unit.CM }]);
  }, []);

  const handleRemoveDimension = useCallback((id: string) => {
    setDimensions(prev => prev.filter(dim => dim.id !== id));
  }, []);

  const handleDimensionChange = useCallback((id: string, field: keyof Omit<Dimension, 'id'>, value: string | Unit) => {
    setDimensions(prev => prev.map(dim => dim.id === id ? { ...dim, [field]: value } : dim));
  }, []);

  const handleContingencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContingencyPercent(Number(e.target.value));
  };
  
  const calculatedArea = useMemo(() => {
    const totalAreaMm2 = dimensions.reduce((total, dim) => {
      const length = parseFloat(dim.length) || 0;
      const height = parseFloat(dim.height) || 0;
      const conversionFactor = CONVERSION_FACTORS[dim.unit];
      
      const lengthInMm = length * conversionFactor;
      const heightInMm = height * conversionFactor;
      
      return total + (lengthInMm * heightInMm);
    }, 0);

    const contingencyFactor = 1 + (contingencyPercent / 100);
    const totalWithContingencyMm2 = totalAreaMm2 * contingencyFactor;
    
    return {
      mm2: totalWithContingencyMm2,
      cm2: totalWithContingencyMm2 / 100,
      m2: totalWithContingencyMm2 / 1_000_000
    };
  }, [dimensions, contingencyPercent]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(num);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-2">
                <TileIcon />
                <h1 className="text-4xl font-bold text-white tracking-tight">Tile Area Calculator</h1>
            </div>
          <p className="text-slate-400">Calculate the total tile area needed for your project, including contingency.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side - Inputs */}
          <div className="lg:col-span-3 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4 text-white">Dimensions</h2>
            <div className="space-y-3">
              {dimensions.map(dim => (
                <DimensionInputRow 
                  key={dim.id} 
                  dimension={dim}
                  onChange={handleDimensionChange}
                  onRemove={handleRemoveDimension}
                />
              ))}
            </div>
            <button
              onClick={handleAddDimension}
              className="mt-4 flex items-center justify-center gap-2 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
            >
              <PlusIcon />
              Add Another Area
            </button>
          </div>

          {/* Right Side - Results */}
          <div className="lg:col-span-2 space-y-6">
             {/* Contingency */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <label htmlFor="contingency" className="block text-xl font-semibold text-white mb-2">
                    Contingency Stock
                </label>
                <div className="flex items-center gap-4">
                    <input
                        id="contingency"
                        type="range"
                        min="0"
                        max="50"
                        value={contingencyPercent}
                        onChange={handleContingencyChange}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <span className="font-mono text-lg bg-slate-700 px-3 py-1 rounded-md text-cyan-400 w-20 text-center">
                        {contingencyPercent}%
                    </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">A buffer for cuts, mistakes, or future repairs. 10-15% is standard.</p>
            </div>
            
            {/* Total Area */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 sticky top-8">
                <h2 className="text-2xl font-semibold mb-4 text-white">Total Required Area</h2>
                <div className="grid grid-cols-1 gap-4">
                    <ResultCard value={formatNumber(calculatedArea.m2)} unit="m²" description="Square Meters" />
                    <ResultCard value={formatNumber(calculatedArea.cm2)} unit="cm²" description="Square Centimeters" />
                    <ResultCard value={formatNumber(calculatedArea.mm2)} unit="mm²" description="Square Millimeters" />
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
