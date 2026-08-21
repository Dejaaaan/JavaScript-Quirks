import React, { useState } from 'react';
import { GitCommit, Search, CheckCircle2, XCircle, ArrowDown, HelpCircle, ShieldAlert } from 'lucide-react';

interface PrototypeNode {
  name: string;
  type: 'instanca' | 'prototip' | 'koren' | 'null';
  properties: { key: string; value: string; isOwn: boolean }[];
  protoTargetName: string | null;
}

const SAMPLE_CHAINS: { id: string; name: string; description: string; nodes: PrototypeNode[] }[] = [
  {
    id: 'dog-inheritance',
    name: 'Korisnička Hijerarhija Klasa (Dog -> Animal -> Object)',
    description: 'Klasičan lanac instanci koji prikazuje kako se nasleđene metode delegiraju uz lanac',
    nodes: [
      {
        name: 'myDog (Instanca)',
        type: 'instanca',
        properties: [
          { key: 'name', value: '"Sparky"', isOwn: true },
          { key: 'breed', value: '"Zlatni Retriver"', isOwn: true }
        ],
        protoTargetName: 'Dog.prototype'
      },
      {
        name: 'Dog.prototype',
        type: 'prototip',
        properties: [
          { key: 'bark', value: 'function() { return "Av av!" }', isOwn: true },
          { key: 'fetch', value: 'function() { return "Loptica" }', isOwn: true }
        ],
        protoTargetName: 'Animal.prototype'
      },
      {
        name: 'Animal.prototype',
        type: 'prototip',
        properties: [
          { key: 'eat', value: 'function() { return "Jede" }', isOwn: true },
          { key: 'sleep', value: 'function() { return "Spava" }', isOwn: true }
        ],
        protoTargetName: 'Object.prototype'
      },
      {
        name: 'Object.prototype',
        type: 'koren',
        properties: [
          { key: 'toString', value: 'function() { [native code] }', isOwn: true },
          { key: 'valueOf', value: 'function() { [native code] }', isOwn: true },
          { key: 'hasOwnProperty', value: 'function() { [native code] }', isOwn: true }
        ],
        protoTargetName: 'null'
      },
      {
        name: 'null',
        type: 'null',
        properties: [],
        protoTargetName: null
      }
    ]
  },
  {
    id: 'array-chain',
    name: 'Ugrađeni Array ([1, 2, 3] -> Array.prototype -> Object.prototype)',
    description: 'Kako se metode niza poput .map() i .filter() pronalaze na Array.prototype',
    nodes: [
      {
        name: 'myArr = [1, 2, 3] (Instanca)',
        type: 'instanca',
        properties: [
          { key: '0', value: '1', isOwn: true },
          { key: '1', value: '2', isOwn: true },
          { key: '2', value: '3', isOwn: true },
          { key: 'length', value: '3', isOwn: true }
        ],
        protoTargetName: 'Array.prototype'
      },
      {
        name: 'Array.prototype',
        type: 'prototip',
        properties: [
          { key: 'map', value: 'function() { ... }', isOwn: true },
          { key: 'filter', value: 'function() { ... }', isOwn: true },
          { key: 'sort', value: 'function() { ... }', isOwn: true },
          { key: 'push', value: 'function() { ... }', isOwn: true }
        ],
        protoTargetName: 'Object.prototype'
      },
      {
        name: 'Object.prototype',
        type: 'koren',
        properties: [
          { key: 'toString', value: 'function() { [native code] }', isOwn: true },
          { key: 'valueOf', value: 'function() { [native code] }', isOwn: true }
        ],
        protoTargetName: 'null'
      },
      {
        name: 'null',
        type: 'null',
        properties: [],
        protoTargetName: null
      }
    ]
  }
];

export const PrototypeVisualizer: React.FC = () => {
  const [selectedChainIdx, setSelectedChainIdx] = useState(0);
  const [searchProp, setSearchProp] = useState('bark');

  const chain = SAMPLE_CHAINS[selectedChainIdx];

  // Find where the property exists in the chain
  let foundInNode: string | null = null;
  for (const node of chain.nodes) {
    if (node.properties.some((p) => p.key === searchProp.trim())) {
      foundInNode = node.name;
      break;
    }
  }

  return (
    <div id="prototype-visualizer" className="bg-[#FFFFFF] dark:bg-[#18181B] text-[#1A1A1A] dark:text-[#F4F4F5] rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5DF] dark:border-[#27272A] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#BE185D]/10 dark:bg-[#EC4899]/20 text-[#BE185D] dark:text-[#F472B6] font-mono text-[11px] font-bold border border-[#BE185D]/20 dark:border-[#EC4899]/30">
              <GitCommit className="w-3.5 h-3.5 inline-block mr-1" />
              Graf Delegacije
            </span>
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight">Istraživač lanca prototipova i delegacije</h3>
          </div>
          <p className="text-xs text-[#73736C] dark:text-[#A1A1AA] font-serif italic mt-1">
            Pratite skriveni <code className="text-[#BE185D] dark:text-[#F472B6] font-mono">[[Prototype]]</code> lanac od instance objekta sve do završnog <code className="text-[#BE185D] dark:text-[#F472B6] font-mono">null</code>.
          </p>
        </div>

        {/* Chain Selector */}
        <div className="flex items-center gap-1.5 bg-[#FAF9F5] dark:bg-[#202023] p-1 rounded-xl border border-[#E5E5DF] dark:border-[#27272A]">
          {SAMPLE_CHAINS.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => setSelectedChainIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedChainIdx === idx
                  ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] shadow-sm'
                  : 'text-[#575750] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5]'
              }`}
            >
              {c.name.split('(')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Property Search Simulation Bar */}
      <div className="bg-[#FAF9F5] dark:bg-[#202023] p-4 rounded-xl border border-[#E5E5DF] dark:border-[#27272A] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-[#BE185D] dark:text-[#F472B6]" />
          <span className="text-xs text-[#73736C] dark:text-[#A1A1AA] font-serif italic">Simulirajte pretragu svojstva:</span>
          <input
            type="text"
            value={searchProp}
            onChange={(e) => setSearchProp(e.target.value)}
            placeholder="npr. bark, name, toString, nepostojece"
            className="bg-[#FFFFFF] dark:bg-[#18181B] border border-[#E5E5DF] dark:border-[#27272A] text-[#BE185D] dark:text-[#F472B6] font-bold rounded-lg px-3 py-1 text-xs font-mono outline-none focus:border-[#BE185D] dark:focus:border-[#F472B6] flex-1 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          {foundInNode ? (
            <div className="flex items-center gap-1.5 text-[#166534] dark:text-[#86EFAC] bg-[#F0FDF4] dark:bg-[#064E3B]/30 border border-[#BBF7D0] dark:border-[#059669]/40 px-3 py-1.5 rounded-lg shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-[#4ADE80]" />
              <span>Pronađeno na: <strong>{foundInNode}</strong></span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[#991B1B] dark:text-[#FCA5A5] bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 border border-[#FECACA] dark:border-[#991B1B]/50 px-3 py-1.5 rounded-lg shadow-sm">
              <XCircle className="w-4 h-4 text-[#DC2626] dark:text-[#F87171]" />
              <span>Dostignut <code className="text-[#1A1A1A] dark:text-[#F4F4F5] font-bold">null</code> =&gt; undefined</span>
            </div>
          )}
        </div>
      </div>

      {/* Vertical Prototype Chain Nodes */}
      <div className="space-y-4 max-w-2xl mx-auto py-2">
        {chain.nodes.map((node, idx) => {
          const isMatchNode = foundInNode === node.name;
          const isNullNode = node.type === 'null';

          return (
            <div key={idx} className="flex flex-col items-center">
              {/* Card */}
              <div
                className={`w-full p-4 rounded-xl border transition-all ${
                  isNullNode
                    ? 'bg-[#FAF9F5] dark:bg-[#202023] border-dashed border-[#D4D4CE] dark:border-[#3F3F46] text-center text-[#A3A39A] dark:text-[#71717A] py-3'
                    : isMatchNode
                    ? 'bg-[#FDF2F8] dark:bg-[#500724]/40 border-2 border-[#BE185D] dark:border-[#F472B6] shadow-md'
                    : 'bg-[#FAF9F5] dark:bg-[#202023] border-[#E5E5DF] dark:border-[#27272A]'
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#E5E5DF] dark:border-[#27272A] pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                        node.type === 'instanca'
                          ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#1E40AF] dark:text-[#93C5FD] border border-[#BFDBFE] dark:border-[#3B82F6]/40'
                          : node.type === 'prototip'
                          ? 'bg-[#FDF2F8] dark:bg-[#831843]/40 text-[#BE185D] dark:text-[#F472B6] border border-[#FBCFE8] dark:border-[#EC4899]/40'
                          : node.type === 'koren'
                          ? 'bg-[#FAF5FF] dark:bg-[#581C87]/40 text-[#6B21A8] dark:text-[#D8B4FE] border border-[#E9D5FF] dark:border-[#A855F7]/40'
                          : 'bg-[#F4F4F0] dark:bg-[#27272A] text-[#73736C] dark:text-[#A1A1AA]'
                      }`}
                    >
                      {node.type}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">{node.name}</span>
                  </div>

                  {node.protoTargetName && (
                    <span className="text-[11px] font-mono text-[#73736C] dark:text-[#A1A1AA]">
                      [[Prototype]] =&gt; <strong className="text-[#BE185D] dark:text-[#F472B6]">{node.protoTargetName}</strong>
                    </span>
                  )}
                </div>

                {/* Properties in this node */}
                {!isNullNode && (
                  <div className="space-y-1.5 mt-2">
                    <span className="text-[10px] font-semibold uppercase text-[#73736C] dark:text-[#A1A1AA] block font-mono">
                      Sopstvena svojstva (Own Properties) ({node.properties.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-xs">
                      {node.properties.map((prop, pIdx) => {
                        const isTargetProp = prop.key === searchProp.trim();
                        return (
                          <div
                            key={pIdx}
                            className={`px-2.5 py-1.5 rounded-lg flex items-center justify-between border ${
                              isTargetProp
                                ? 'bg-[#FCE7F3] dark:bg-[#831843]/60 border-[#F472B6] dark:border-[#EC4899] text-[#9D174D] dark:text-[#FBCFE8] font-bold shadow-sm'
                                : 'bg-[#FFFFFF] dark:bg-[#18181B] border-[#E5E5DF] dark:border-[#27272A] text-[#40403C] dark:text-[#D4D4D8]'
                            }`}
                          >
                            <span className="text-[#73736C] dark:text-[#A1A1AA]">{prop.key}:</span>
                            <span className="truncate max-w-[160px] text-[#BE185D] dark:text-[#F472B6] font-medium">{prop.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Arrow down to next prototype */}
              {idx < chain.nodes.length - 1 && (
                <div className="flex flex-col items-center my-1 text-[#A3A39A] dark:text-[#71717A]">
                  <span className="text-[10px] font-mono text-[#73736C] dark:text-[#A1A1AA] mb-0.5">__proto__</span>
                  <ArrowDown className="w-4 h-4 text-[#A3A39A] dark:text-[#71717A]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Prototype Pollution Info Note */}
      <div className="bg-[#FFFBEB] dark:bg-[#78350F]/30 p-4 rounded-xl border border-[#FDE68A] dark:border-[#B45309]/50 flex items-start gap-3 text-xs text-[#92400E] dark:text-[#FDE68A]">
        <ShieldAlert className="w-5 h-5 text-[#D97706] dark:text-[#F59E0B] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-serif font-bold text-[#B45309] dark:text-[#F59E0B] block mb-1">Sigurnosno upozorenje: Prototype Pollution</span>
          Direktna mutacija na <code className="text-[#BE185D] dark:text-[#F472B6] font-mono font-bold bg-[#FFFFFF] dark:bg-[#18181B] px-1 rounded border border-[#FDE68A] dark:border-[#B45309]">Object.prototype</code> zagađuje SVAKI pojedinačni objekat u celom JavaScript runtime-u! Uvek koristite <code className="text-[#BE185D] dark:text-[#F472B6] font-mono font-bold bg-[#FFFFFF] dark:bg-[#18181B] px-1 rounded border border-[#FDE68A] dark:border-[#B45309]">Object.create(null)</code> ili <code className="text-[#BE185D] dark:text-[#F472B6] font-mono font-bold bg-[#FFFFFF] dark:bg-[#18181B] px-1 rounded border border-[#FDE68A] dark:border-[#B45309]">new Map()</code> kada radite sa dinamičkim korisničkim ključevima.
        </div>
      </div>
    </div>
  );
};
