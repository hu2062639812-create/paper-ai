
import React, { useState, useCallback } from 'react';
import { polishAcademicText } from './services/geminiService';
import { ProcessingResult, ProcessingStatus } from './types';
import ComparisonCard from './components/ComparisonCard';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = useCallback(async () => {
    if (!inputText.trim()) return;

    setStatus(ProcessingStatus.LOADING);
    setError(null);
    
    try {
      const data = await polishAcademicText(inputText);
      setResult(data);
      setStatus(ProcessingStatus.SUCCESS);
      // 平滑滚动到结果区域
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || '处理过程中发生意外错误，请稍后重试。');
      setStatus(ProcessingStatus.ERROR);
    }
  }, [inputText]);

  const handleReset = () => {
    setInputText('');
    setResult(null);
    setStatus(ProcessingStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <i className="fa-solid fa-graduation-cap text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">学术润色大师</h1>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">AI痕迹消除与论文精炼</p>
            </div>
          </div>
          <div className="flex gap-4">
             <button 
                onClick={() => window.open('https://ai.google.dev/gemini-api/docs/billing', '_blank')}
                className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
             >
               API 文档
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-12">
        {/* 介绍区域 */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            提升您的学术写作水平
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            专业的学术论文编辑工具，旨在精炼您的研究文本、丰富词汇表达，并在保持逻辑严密性的同时，最大程度降低 AI 生成痕迹。
          </p>
        </section>

        {/* 编辑区域 */}
        <section className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden mb-12">
          <div className="p-8">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
              输入学术段落
            </label>
            <textarea
              className="w-full h-64 p-6 academic-text text-lg text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-slate-300"
              placeholder="在此粘贴您的学术文本（例如：摘要、方法论、讨论部分等）..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={status === ProcessingStatus.LOADING}
            />
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <i className="fa-solid fa-check-circle text-green-500"></i>
                  降低 AI 痕迹
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <i className="fa-solid fa-check-circle text-green-500"></i>
                  保持逻辑严密
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors"
                  disabled={status === ProcessingStatus.LOADING}
                >
                  清空内容
                </button>
                <button
                  onClick={handleProcess}
                  disabled={status === ProcessingStatus.LOADING || !inputText.trim()}
                  className={`
                    px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all
                    ${status === ProcessingStatus.LOADING 
                      ? 'bg-indigo-400 cursor-not-allowed text-white' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 shadow-indigo-200 hover:shadow-indigo-300'}
                  `}
                >
                  {status === ProcessingStatus.LOADING ? (
                    <>
                      <i className="fa-solid fa-circle-notch animate-spin"></i>
                      正在处理...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                      开始学术润色
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="px-8 pb-8">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-4 text-red-700">
                <i className="fa-solid fa-triangle-exclamation text-xl"></i>
                <div className="text-sm font-medium">{error}</div>
              </div>
            </div>
          )}
        </section>

        {/* 结果区域 */}
        {result && (
          <div id="results-section" className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
                  {result.paragraphs.length}
                </span>
                润色精炼结果
              </h3>
              <button 
                onClick={() => {
                  const fullText = result.paragraphs.map(p => p.polished).join('\n\n');
                  navigator.clipboard.writeText(fullText);
                }}
                className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
              >
                <i className="fa-solid fa-copy"></i> 复制全部润色文本
              </button>
            </div>

            {result.paragraphs.map((item, idx) => (
              <ComparisonCard key={idx} data={item} index={idx} />
            ))}

            <div className="bg-indigo-600 rounded-2xl p-10 text-center text-white mt-12 shadow-xl shadow-indigo-100">
              <h4 className="text-2xl font-bold mb-4">对结果满意吗？</h4>
              <p className="opacity-80 mb-8 max-w-lg mx-auto">
                所有的润色文本均针对高影响力期刊的投稿标准进行了优化。请记得再次核对专业的公式、图表引用及特定数据。
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                  className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors shadow-lg"
                >
                  开始新会话
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 加载状态 */}
        {status === ProcessingStatus.LOADING && !result && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-pulse">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-300">
              <i className="fa-solid fa-file-invoice text-3xl"></i>
            </div>
            <div className="text-slate-400 font-medium italic">正在分析学术结构并降低 AI 写作特征...</div>
            <div className="w-full max-w-md h-4 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-1/3 animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-white text-[10px]">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <span className="font-bold text-slate-800 tracking-tight">学术润色大师</span>
          </div>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            由 Gemini 3 Pro 驱动的科研助手。致力于学术卓越与语言的多样性表达。
          </p>
          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
             <p className="text-xs text-slate-400">&copy; 2024 学术润色大师. 保留所有权利。</p>
             <div className="flex gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
               <span className="hover:text-indigo-600 cursor-pointer">隐私政策</span>
               <span className="hover:text-indigo-600 cursor-pointer">服务条款</span>
               <span className="hover:text-indigo-600 cursor-pointer">学术规范</span>
             </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default App;
