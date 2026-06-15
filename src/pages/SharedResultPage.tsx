import { Link, useSearchParams } from 'react-router-dom';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import {
  categoryLabels,
  categoryColors,
  diagnosisTypeDescriptions,
  diagnosisTypeDescriptionsJa,
  diagnosisTypeCharacters,
  getScoreLevel,
  getAxisComment,
  isDiagnosisType,
} from '../lib/diagnosisMeta';
import { Category, DiagnosisType } from '../types';

function SharedResultPage() {
  const [searchParams] = useSearchParams();

  const type = searchParams.get('type');
  const scoreParam = searchParams.get('score');
  const uxParam = searchParams.get('ux');
  const uiParam = searchParams.get('ui');
  const facParam = searchParams.get('fac');
  const bizParam = searchParams.get('biz');
  const dataParam = searchParams.get('data');

  const rawScores = [scoreParam, uxParam, uiParam, facParam, bizParam, dataParam];
  const isValid =
    type !== null &&
    isDiagnosisType(type) &&
    rawScores.every((value) => value !== null && !Number.isNaN(Number(value)));

  if (!isValid) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-lg">Result not found</p>
      </div>
    );
  }

  const diagnosisType = type as DiagnosisType;
  const totalScore = Number(scoreParam);
  const scores: Record<Category, number> = {
    ux_research: Number(uxParam),
    ui_design: Number(uiParam),
    facilitation: Number(facParam),
    business: Number(bizParam),
    data: Number(dataParam),
  };

  const radarData = (Object.keys(categoryLabels) as Category[]).map((cat) => ({
    category: categoryLabels[cat],
    score: scores[cat],
    fullMark: 100,
  }));

  const sortedByScoreDesc = (Object.keys(scores) as Category[]).sort(
    (a, b) => scores[b] - scores[a]
  );
  const strengths = sortedByScoreDesc.slice(0, 2);
  const improvements = [...sortedByScoreDesc].reverse().slice(0, 2);

  return (
    <div className="min-h-screen bg-black">
      <header className="fixed top-0 left-0 right-0 bg-black border-b border-white/20 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-70 transition-opacity w-fit"
          >
            <img src="/logo.png" alt="Designer Diagnostic" style={{ height: '32px', width: 'auto' }} />
          </Link>
        </div>
      </header>

      <main className="pt-20 pb-12 px-4">
        <div className="max-w-2xl mx-auto py-8 space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-[#F1BF42] text-[#000000]">
              <Sparkles className="w-3 h-3 text-[#000000]" />
              診断完了
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white">あなたの診断結果</h2>
          </div>

          {/* Total Score Card */}
          <div className="bg-black border border-white/20 p-6 md:p-8">
            <div className="text-center space-y-6">
              <div>
                <p className="text-gray-500 text-sm mb-2">総合スコア</p>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-6xl md:text-7xl font-serif font-bold text-white">
                    {totalScore}
                  </span>
                  <span className="text-2xl text-gray-400">/ 100</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/20">
                <img
                  src={diagnosisTypeCharacters[diagnosisType]}
                  alt={diagnosisType}
                  className="w-[240px] mx-auto"
                />
                <p className="mt-4 text-3xl md:text-4xl font-serif font-bold text-[#F1BF42]">
                  {diagnosisType}
                </p>
                <p className="mt-3 text-sm md:text-base text-gray-300 max-w-md mx-auto">
                  {diagnosisTypeDescriptions[diagnosisType]}
                </p>
                <p className="mt-2 text-sm md:text-base text-gray-300 max-w-md mx-auto">
                  {diagnosisTypeDescriptionsJa[diagnosisType]}
                </p>
              </div>

              {/* Radar Chart */}
              <div className="h-72 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: '#FFFFFF', fontSize: 12 }} />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: '#999999', fontSize: 10 }}
                    />
                    <Radar
                      name="能力値"
                      dataKey="score"
                      stroke="#F1BF42"
                      fill="#F1BF42"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="bg-black border border-white/20 p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#B5D2CC]" />
                <h3 className="text-lg font-bold text-white">あなたの強み</h3>
              </div>
              <div className="space-y-4">
                {strengths.map((cat, idx) => (
                  <div key={cat} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3"
                          style={{ backgroundColor: categoryColors[cat] }}
                        />
                        <span className="font-medium text-gray-200">{categoryLabels[cat]}</span>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 text-xs border border-[#FF3318] text-[#FF3318]">
                            TOP
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-white">{scores[cat]}点</span>
                    </div>
                    <div className="h-2 bg-white/10 overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${scores[cat]}%`,
                          backgroundColor: categoryColors[cat],
                        }}
                      />
                    </div>
                    <p className="mt-2 p-3 text-[16px] leading-[1.8] text-white/70 bg-white/5">
                      {getAxisComment(cat, scores[cat])}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Improvements */}
          <div className="bg-black border border-white/20 p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-[#FF3318]" />
                <h3 className="text-lg font-bold text-white">改善ポイント</h3>
              </div>
              <div className="space-y-4">
                {improvements.map((cat) => (
                  <div key={cat} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3"
                          style={{ backgroundColor: categoryColors[cat] }}
                        />
                        <span className="font-medium text-gray-200">{categoryLabels[cat]}</span>
                      </div>
                      <span className="font-bold text-white">{scores[cat]}点</span>
                    </div>
                    <div className="h-2 bg-white/10 overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${scores[cat]}%`,
                          backgroundColor: categoryColors[cat],
                        }}
                      />
                    </div>
                    <p className="mt-2 p-3 text-[16px] leading-[1.8] text-white/70 bg-white/5">
                      {getAxisComment(cat, scores[cat])}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All Scores */}
          <div className="bg-black border border-white/20 p-6 md:p-8">
            <h3 className="text-lg font-bold text-white mb-6">全能力スコア</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(categoryLabels) as Category[]).map((cat) => (
                <div key={cat} className="flex items-center gap-4 p-4 border border-white/20">
                  <div
                    className="w-1.5 h-12 shrink-0"
                    style={{ backgroundColor: categoryColors[cat] }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white">{categoryLabels[cat]}</p>
                    <p className="text-sm text-gray-500">{getScoreLevel(scores[cat])}</p>
                  </div>
                  <div className="text-2xl font-serif font-bold text-white">{scores[cat]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F1BF42] text-[#000000] font-medium rounded-[3px] hover:opacity-90 transition-opacity"
            >
              自分も診断する
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-400 border-t border-white/20">
        <p>Designer Diagnostic - あなたの強みを可視化</p>
      </footer>
    </div>
  );
}

export default SharedResultPage;
