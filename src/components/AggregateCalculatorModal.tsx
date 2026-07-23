import React, { useState } from 'react';
import { Calculator, X, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Department } from '../types';

interface AggregateCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  onApplyDepartment?: (deptId: string) => void;
}

export const AggregateCalculatorModal: React.FC<AggregateCalculatorModalProps> = ({
  isOpen,
  onClose,
  departments,
  onApplyDepartment
}) => {
  const [matricMarks, setMatricMarks] = useState<string>('1020');
  const [matricTotal, setMatricTotal] = useState<string>('1100');
  const [interMarks, setInterMarks] = useState<string>('1010');
  const [interTotal, setInterTotal] = useState<string>('1100');
  const [testMarks, setTestMarks] = useState<string>('85');
  const [testTotal, setTestTotal] = useState<string>('100');

  // Weightage formula percentages
  const [weightMatric, setWeightMatric] = useState<number>(30);
  const [weightInter, setWeightInter] = useState<number>(70);
  const [weightTest, setWeightTest] = useState<number>(0);

  const [calculatedAggregate, setCalculatedAggregate] = useState<number | null>(89.86);

  if (!isOpen) return null;

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const mVal = parseFloat(matricMarks) || 0;
    const mTot = parseFloat(matricTotal) || 1100;
    const iVal = parseFloat(interMarks) || 0;
    const iTot = parseFloat(interTotal) || 1100;
    const tVal = parseFloat(testMarks) || 0;
    const tTot = parseFloat(testTotal) || 100;

    const mPct = (mVal / mTot) * 100;
    const iPct = (iVal / iTot) * 100;
    const tPct = tVal > 0 ? (tVal / tTot) * 100 : 0;

    const totalWeight = weightMatric + weightInter + weightTest || 100;

    const normMatric = weightMatric / totalWeight;
    const normInter = weightInter / totalWeight;
    const normTest = weightTest / totalWeight;

    const agg = (mPct * normMatric) + (iPct * normInter) + (tPct * normTest);
    setCalculatedAggregate(parseFloat(agg.toFixed(2)));
  };

  const setStandardFormula = (m: number, i: number, t: number) => {
    setWeightMatric(m);
    setWeightInter(i);
    setWeightTest(t);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">University Aggregate Calculator</h2>
              <p className="text-xs text-slate-400">Calculate admission eligibility according to HEC criteria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Preset Formulas */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Preset Formula
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setStandardFormula(30, 70, 0);
                  handleCalculate();
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  weightMatric === 30 && weightInter === 70 && weightTest === 0
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                30% Matric + 70% FSc
              </button>

              <button
                type="button"
                onClick={() => {
                  setStandardFormula(20, 50, 30);
                  handleCalculate();
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  weightMatric === 20 && weightInter === 50 && weightTest === 30
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                20% Matric + 50% FSc + 30% Test
              </button>

              <button
                type="button"
                onClick={() => {
                  setStandardFormula(10, 40, 50);
                  handleCalculate();
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  weightMatric === 10 && weightInter === 40 && weightTest === 50
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                10% Matric + 40% FSc + 50% Test
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCalculate} className="space-y-4">
            
            {/* Academic Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Matric Marks */}
              <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-200">Matric / SSC Marks</label>
                  <span className="text-xs text-indigo-400 font-semibold">Weight: {weightMatric}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400">Obtained</span>
                    <input
                      type="number"
                      value={matricMarks}
                      onChange={(e) => setMatricMarks(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Total</span>
                    <input
                      type="number"
                      value={matricTotal}
                      onChange={(e) => setMatricTotal(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* FSc / Intermediate Marks */}
              <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-200">FSc / HSSC Marks</label>
                  <span className="text-xs text-indigo-400 font-semibold">Weight: {weightInter}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400">Obtained</span>
                    <input
                      type="number"
                      value={interMarks}
                      onChange={(e) => setInterMarks(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Total</span>
                    <input
                      type="number"
                      value={interTotal}
                      onChange={(e) => setInterTotal(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Entry Test Marks */}
            <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-200">Entry Test / ECAT / MDCAT (Optional)</label>
                <span className="text-xs text-indigo-400 font-semibold">Weight: {weightTest}%</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400">Obtained Score</span>
                  <input
                    type="number"
                    value={testMarks}
                    onChange={(e) => setTestMarks(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Total Marks</span>
                  <input
                    type="number"
                    value={testTotal}
                    onChange={(e) => setTestTotal(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Calculate My Aggregate
            </button>
          </form>

          {/* Aggregate Calculation Result Display */}
          {calculatedAggregate !== null && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-850 to-indigo-950 border border-indigo-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                  <span className="text-sm font-bold text-slate-200">Your Calculated Aggregate</span>
                </div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300">
                  {calculatedAggregate}%
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Department Eligibility Breakdown:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {departments.map((dept) => {
                    const isEligible = calculatedAggregate >= dept.eligibilityPercentage;
                    return (
                      <div
                        key={dept._id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          isEligible
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-300 opacity-70'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="text-xs font-bold text-white truncate">{dept.name}</p>
                          <p className="text-[10px] text-slate-400">Min Req: {dept.eligibilityPercentage}%</p>
                        </div>
                        {isEligible ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            {onApplyDepartment && (
                              <button
                                onClick={() => {
                                  onApplyDepartment(dept._id);
                                  onClose();
                                }}
                                className="text-[10px] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2 py-1 rounded"
                              >
                                Apply
                              </button>
                            )}
                          </div>
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
