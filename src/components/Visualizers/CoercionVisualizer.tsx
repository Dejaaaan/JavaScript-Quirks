import React, { useState } from 'react';
import { COERCION_DATABASE, CoercionItem } from '../../data/coercionData';
import { Sparkles, Calculator, Check, ArrowRight, HelpCircle, AlertTriangle, BookOpen, Layers } from 'lucide-react';
import { runJavaScriptCode } from '../../utils/codeRunner';
import { FormattedText } from '../FormattedText';
import { useI18n } from '../../i18n';

const MATRIX_VALUES = ['0', '""', '"0"', 'false', 'true', 'null', 'undefined', '[]', '{}', 'NaN'];

export const CoercionVisualizer: React.FC = () => {
  const { locale, localize } = useI18n();
  const [selectedItem, setSelectedItem] = useState<CoercionItem>(COERCION_DATABASE[0]);
  const [customExpr, setCustomExpr] = useState<string>('[] == ![]');
  const [customOutput, setCustomOutput] = useState<{ result: string; type: string; isError: boolean } | null>(null);
  const [activeTab, setActiveTab] = useState<'presets' | 'matrix' | 'custom'>('presets');

  const evaluateCustom = async (expr: string) => {
    try {
      const res = await runJavaScriptCode(`return (${expr});`);
      if (res.error) {
        setCustomOutput({ result: res.error, type: 'error', isError: true });
      } else {
        const val = res.returnValue ?? 'undefined';
        let inferredType = 'primitive';
        if (val.startsWith('"') || val.startsWith("'")) inferredType = 'string';
        else if (val === 'true' || val === 'false') inferredType = 'boolean';
        else if (!isNaN(Number(val)) || val === 'NaN' || val === 'Infinity' || val === '-Infinity') inferredType = 'number';
        else if (val === 'null') inferredType = 'null';
        else if (val === 'undefined') inferredType = 'undefined';
        else if (val.startsWith('{') || val.startsWith('[')) inferredType = 'object';

        setCustomOutput({ result: val, type: inferredType, isError: false });
      }
    } catch (e: any) {
      setCustomOutput({ result: e.message || (locale === 'sr' ? 'Greška pri evaluaciji' : 'Evaluation error'), type: 'error', isError: true });
    }
  };

  const getMatrixComparison = (a: string, b: string): { isEqual: boolean; isStrict: boolean } => {
    try {
      const loose = new Function(`return (${a}) == (${b});`)();
      const strict = new Function(`return (${a}) === (${b});`)();
      return { isEqual: Boolean(loose), isStrict: Boolean(strict) };
    } catch {
      return { isEqual: false, isStrict: false };
    }
  };

  const selectedExplanation = (locale === 'en' && selectedItem.explanationEn) ? selectedItem.explanationEn : selectedItem.explanation;
  const selectedSteps = (locale === 'en' && selectedItem.stepsEn) ? selectedItem.stepsEn : selectedItem.steps;
  const selectedCategory = (locale === 'en' && selectedItem.categoryEn) ? selectedItem.categoryEn : selectedItem.category;

  return (
    <div id="coercion-visualizer-root" className="bg-[#FFFFFF] dark:bg-[#18181B] text-[#1A1A1A] dark:text-[#F4F4F5] rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5DF] dark:border-[#27272A] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#4338CA]/10 dark:bg-[#818CF8]/10 text-[#4338CA] dark:text-[#A5B4FC] font-mono text-[11px] font-bold border border-[#4338CA]/20 dark:border-[#818CF8]/30">
              <Sparkles className="w-3.5 h-3.5 inline-block mr-1" />
              {localize('ECMAScript Analiza Specifikacije', 'ECMAScript Specification Analysis')}
            </span>
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight">
              {localize('Konverzija tipova i labava jednakost', 'Type Coercion & Loose Equality')}
            </h3>
          </div>
          <p className="text-xs text-[#73736C] dark:text-[#A1A1AA] font-serif italic mt-1">
            {localize('Istražite algoritam implicitne konverzije, labavu jednakost (==) i ToPrimitive operacije.', 'Explore the implicit coercion algorithm, loose equality (==), and ToPrimitive operations.')}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-[#FAF9F5] dark:bg-[#27272A] p-1 rounded-xl border border-[#E5E5DF] dark:border-[#3F3F46]">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'presets' ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] shadow-sm' : 'text-[#575750] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5]'
            }`}
          >
            {localize('Katalog primera', 'Preset Catalog')}
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'matrix' ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] shadow-sm' : 'text-[#575750] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5]'
            }`}
          >
            {localize('Matrica Jednakosti (==)', 'Equality Matrix (==)')}
          </button>
          <button
            onClick={() => {
              setActiveTab('custom');
              evaluateCustom(customExpr);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'custom' ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] shadow-sm' : 'text-[#575750] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5]'
            }`}
          >
            {localize('Kalkulator izraza', 'Expression Calculator')}
          </button>
        </div>
      </div>

      {/* Tab 1: Presets Catalog */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Preset Buttons List (5 cols) - height strictly driven by the right-hand column */}
          <div className="lg:col-span-5 flex flex-col min-h-0 bg-[#FAF9F5] dark:bg-[#202023] rounded-xl p-5 border border-[#E5E5DF] dark:border-[#27272A]">
            <span className="text-xs font-mono font-bold text-[#73736C] dark:text-[#A1A1AA] uppercase tracking-wider block mb-3 border-b border-[#E5E5DF] dark:border-[#27272A] pb-2 flex-shrink-0">
              {localize('Izaberite izraz za analizu:', 'Select expression for analysis:')}
            </span>
            <div className="relative flex-1 min-h-0">
              <div className="absolute inset-0 overflow-y-auto space-y-2 pr-1.5 custom-scrollbar">
                {COERCION_DATABASE.map((item) => {
                  const isSelected = selectedItem.id === item.id;
                  const catLabel = (locale === 'en' && item.categoryEn) ? item.categoryEn : item.category;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#1A1A1A] dark:bg-[#27272A] border-[#1A1A1A] dark:border-[#F59E0B] text-[#F9F9F7] dark:text-[#F4F4F5] shadow-sm'
                          : 'bg-[#FFFFFF] dark:bg-[#18181B] border-[#E5E5DF] dark:border-[#27272A] text-[#1A1A1A] dark:text-[#F4F4F5] hover:border-[#1A1A1A] dark:hover:border-[#52525B] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A]'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className={`font-mono text-xs sm:text-[13px] font-bold block truncate ${isSelected ? 'text-[#FDE68A] dark:text-[#FCD34D]' : 'text-[#1A1A1A] dark:text-[#F4F4F5]'}`}>
                          {item.expression}
                        </span>
                        <span className={`text-[11px] ${isSelected ? 'text-[#A3A39A] dark:text-[#A1A1AA]' : 'text-[#73736C] dark:text-[#71717A]'}`}>{catLabel}</span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-mono font-semibold shrink-0 ${
                          isSelected ? 'bg-[#333330] dark:bg-[#18181B] text-[#6EE7B7] dark:text-[#34D399]' : 'bg-[#E5E5DF] dark:bg-[#27272A] text-[#40403C] dark:text-[#A1A1AA]'
                        }`}
                      >
                        =&gt; {item.evaluatedResult}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detailed Dissection Card (7 cols) */}
          <div className="lg:col-span-7 bg-[#FAF9F5] dark:bg-[#202023] rounded-xl p-5 border border-[#E5E5DF] dark:border-[#27272A] space-y-5 flex flex-col justify-start">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E5DF] dark:border-[#27272A] pb-4 gap-3">
              <div>
                <span className="text-xs text-[#4338CA] dark:text-[#818CF8] font-mono font-bold">
                  {localize('Raščlanjivanje Izraza', 'Expression Dissection')}
                </span>
                <h4 className="text-xl sm:text-2xl font-mono font-bold text-[#1A1A1A] dark:text-[#F4F4F5] mt-1 break-all">{selectedItem.expression}</h4>
              </div>
              <div className="sm:text-right shrink-0">
                <span className="text-xs text-[#73736C] dark:text-[#A1A1AA] font-mono block">
                  {localize('Izračunati rezultat:', 'Evaluated result:')}
                </span>
                <span className="text-base font-mono font-bold text-[#15803D] dark:text-[#4ADE80] bg-[#F0FDF4] dark:bg-[#0E2718] border border-[#BBF7D0] dark:border-[#14532D] px-3 py-1 rounded-lg inline-block mt-0.5 shadow-sm">
                  {selectedItem.evaluatedResult}
                </span>
              </div>
            </div>

            {/* Category tag */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#E5E5DF] dark:bg-[#27272A] text-[#575750] dark:text-[#D4D4D8]">
                {selectedCategory}
              </span>
            </div>

            {/* Explanation */}
            <div>
              <h5 className="text-xs font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#4338CA] dark:text-[#818CF8]" />
                {localize('Mehanika i suštinsko objašnjenje', 'Mechanics & Core Explanation')}
              </h5>
              <div className="text-xs sm:text-sm text-[#40403C] dark:text-[#D4D4D8] leading-relaxed bg-[#FFFFFF] dark:bg-[#18181B] p-4 rounded-lg border border-[#E5E5DF] dark:border-[#27272A]">
                <FormattedText text={selectedExplanation} as="p" />
              </div>
            </div>

            {/* Spec Evaluation Steps */}
            <div>
              <h5 className="text-xs font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#B45309] dark:text-[#F59E0B]" />
                {localize('ECMAScript koraci izvršavanja:', 'ECMAScript Execution Steps:')}
              </h5>
              <div className="space-y-2">
                {selectedSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-[13px] font-mono bg-[#FFFFFF] dark:bg-[#18181B] p-3 rounded-lg border border-[#E5E5DF] dark:border-[#27272A] text-[#262624] dark:text-[#D4D4D8]">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] flex items-center justify-center font-bold text-[10px] mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">
                      <FormattedText text={step} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spec Reference */}
            <div className="pt-2 flex items-center gap-2 text-xs text-[#73736C] dark:text-[#A1A1AA] border-t border-[#E5E5DF] dark:border-[#27272A]">
              <BookOpen className="w-3.5 h-3.5 text-[#B45309] dark:text-[#F59E0B]" />
              <span>{localize('Specifikacija:', 'Specification:')} <strong className="text-[#1A1A1A] dark:text-[#F4F4F5] font-mono">{selectedItem.specReference}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Matrix */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#73736C] dark:text-[#A1A1AA]">
            <span>{localize('Tabela evaluacije za izraz', 'Evaluation table for expression')} <code className="text-[#1A1A1A] dark:text-[#F4F4F5] bg-[#FAF9F5] dark:bg-[#27272A] px-1.5 py-0.5 rounded border border-[#E5E5DF] dark:border-[#3F3F46] font-mono font-bold">{localize('Red == Kolona', 'Row == Column')}</code></span>
            <div className="flex items-center gap-3 font-mono">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#DCFCE7] dark:bg-[#0E2718] border border-[#15803D] dark:border-[#22C55E]"></span> <strong className="text-[#15803D] dark:text-[#4ADE80]">T (true)</strong></span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#FEE2E2] dark:bg-[#2A1515] border border-[#DC2626] dark:border-[#EF4444]"></span> <strong className="text-[#B91C1C] dark:text-[#F87171]">F (false)</strong></span>
            </div>
          </div>

          <div className="overflow-x-auto border border-[#E5E5DF] dark:border-[#27272A] rounded-xl bg-[#FFFFFF] dark:bg-[#18181B] p-3">
            <table className="w-full min-w-[620px] text-xs font-mono text-center border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-[#73736C] dark:text-[#A1A1AA] bg-[#FAF9F5] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#27272A] font-bold">==</th>
                  {MATRIX_VALUES.map((val) => (
                    <th key={val} className="p-2 font-bold text-[#1A1A1A] dark:text-[#F4F4F5] bg-[#FAF9F5] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#27272A]">
                      {val}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX_VALUES.map((rowVal) => (
                  <tr key={rowVal}>
                    <td className="p-2 font-bold text-[#1A1A1A] dark:text-[#F4F4F5] bg-[#FAF9F5] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#27272A]">{rowVal}</td>
                    {MATRIX_VALUES.map((colVal) => {
                      const { isEqual } = getMatrixComparison(rowVal, colVal);
                      return (
                        <td
                          key={colVal}
                          className={`p-2 border border-[#E5E5DF] dark:border-[#27272A] transition-colors ${
                            isEqual
                              ? 'bg-[#DCFCE7] dark:bg-[#0E2718] text-[#166534] dark:text-[#4ADE80] font-bold'
                              : 'bg-[#FEE2E2] dark:bg-[#2A1515] text-[#B91C1C] dark:text-[#F87171] font-medium'
                          }`}
                          title={`${rowVal} == ${colVal} => ${isEqual}`}
                        >
                          {isEqual ? 'T' : 'F'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#73736C] dark:text-[#A1A1AA] font-serif italic">
            {localize('Obratite pažnju kako je 0 == "0" true i 0 == [] true, dok je "0" == [] false (narušavajući matematičku tranzitivnost)!', 'Notice how 0 == "0" is true and 0 == [] is true, but "0" == [] is false (violating mathematical transitivity)!')}
          </p>
        </div>
      )}

      {/* Tab 3: Custom Expression Calculator */}
      {activeTab === 'custom' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customExpr}
              onChange={(e) => setCustomExpr(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && evaluateCustom(customExpr)}
              placeholder={localize('Unesite JS izraz, npr: [] + {} ili "5" - 2', 'Enter JS expression, e.g. [] + {} or "5" - 2')}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#E5E5DF] dark:border-[#3F3F46] bg-[#FAF9F5] dark:bg-[#202023] font-mono text-sm focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#F59E0B]"
            />
            <button
              onClick={() => evaluateCustom(customExpr)}
              className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{localize('Izračunaj', 'Evaluate')}</span>
            </button>
          </div>

          {customOutput && (
            <div className={`p-4 rounded-xl border ${
              customOutput.isError
                ? 'bg-[#FFF5F5] dark:bg-[#2A1515] border-[#FECACA] dark:border-[#7F1D1D] text-[#991B1B] dark:text-[#FCA5A5]'
                : 'bg-[#F0FDF4] dark:bg-[#0E2718] border-[#BBF7D0] dark:border-[#14532D] text-[#166534] dark:text-[#86EFAC]'
            }`}>
              <div className="flex items-center justify-between font-mono text-xs mb-1">
                <span className="font-bold">{localize('Rezultat evaluacije:', 'Evaluation result:')}</span>
                <span className="px-2 py-0.5 rounded bg-white/40 dark:bg-black/40 font-mono text-[11px]">
                  {customOutput.type}
                </span>
              </div>
              <pre className="font-mono text-sm sm:text-base font-bold whitespace-pre-wrap">{customOutput.result}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
