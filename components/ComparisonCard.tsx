
import React from 'react';
import { PolishedParagraph } from '../types';

interface ComparisonCardProps {
  data: PolishedParagraph;
  index: number;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ data, index }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-8">
      <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">第 {index + 1} 段</span>
        <button 
          onClick={() => navigator.clipboard.writeText(data.polished)}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <i className="fa-regular fa-copy"></i> 复制结果
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* 原文 */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3 text-slate-400">
            <i className="fa-solid fa-history text-xs"></i>
            <span className="text-xs font-bold uppercase tracking-tight">原文</span>
          </div>
          <p className="academic-text text-slate-600 leading-relaxed text-lg">
            {data.original}
          </p>
        </div>

        {/* 润色后 */}
        <div className="p-6 bg-indigo-50/30">
          <div className="flex items-center gap-2 mb-3 text-indigo-600">
            <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
            <span className="text-xs font-bold uppercase tracking-tight">润色与 AI 痕迹消除</span>
          </div>
          <p className="academic-text text-slate-800 leading-relaxed text-lg">
            {data.polished}
          </p>
        </div>
      </div>

      {/* 修改说明 */}
      {data.explanations.length > 0 && (
        <div className="bg-slate-50 p-6 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <i className="fa-solid fa-circle-info text-indigo-500"></i>
            <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">修改要点说明</span>
          </div>
          <ul className="space-y-2">
            {data.explanations.map((exp, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold mt-0.5 shrink-0">
                  {i + 1}
                </span>
                {exp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ComparisonCard;
