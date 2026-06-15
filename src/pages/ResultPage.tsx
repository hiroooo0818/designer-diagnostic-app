import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { getDiagnosisById } from '../lib/diagnosis';
import {
  categoryLabels,
  categoryColors,
  diagnosisTypeDescriptions,
  diagnosisTypeDescriptionsJa,
  diagnosisTypeCharacters,
  getScoreLevel,
  getCategoryScore,
  diagnosisToRadarData,
  SITE_URL,
} from '../lib/diagnosisMeta';
import { Category, DiagnosisData } from '../types';

const setMetaTag = (property: string, content: string) => {
  let element = document.querySelector(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const fetchDiagnosis = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      const data = await getDiagnosisById(id);
      if (isActive) {
        setDiagnosis(data);
        setIsLoading(false);
      }
    };

    fetchDiagnosis();

    return () => {
      isActive = false;
    };
  }, [id]);

  useEffect(() => {
    if (!diagnosis || !id) return;

    const characterFile = diagnosisTypeCharacters[diagnosis.diagnosis_type].replace(
      '/characters/',
      ''
    );

    setMetaTag('og:title', `${diagnosis.diagnosis_type} | Designer Diagnostic`);
    setMetaTag(
      'og:description',
      `スコア${diagnosis.total_score}点 - ${diagnosisTypeDescriptionsJa[diagnosis.diagnosis_type]}`
    );
    setMetaTag('og:image', `${SITE_URL}/characters/${characterFile}`);
    setMetaTag('og:url', `${SITE_URL}/result/${id}`);
  }, [diagnosis, id]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-lg">Result not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="fixed top-0 left-0 right-0 bg-black border-b border-white/20 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-70 transition-opacity w-fit"
          >
            <span className="font-serif font-bold text-lg text-white">Designer Diagnostic</span>
          </Link>
        </div>
      </header>

      <main className="pt-20 pb-12 px-4">
        <div className="max-w-2xl mx-auto py-8 space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(diagnosis.created_at)}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">診断結果</h2>
          </div>

          {/* Total Score Card */}
          <div className="bg-black border border-white/20 p-6 md:p-8">
            <div className="text-center space-y-6">
              <div>
                <p className="text-gray-500 text-sm mb-2">総合スコア</p>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-6xl md:text-7xl font-serif font-bold text-white">
                    {diagnosis.total_score}
                  </span>
                  <span className="text-2xl text-gray-400">/ 100</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/20">
                <img
                  src={diagnosisTypeCharacters[diagnosis.diagnosis_type]}
                  alt={diagnosis.diagnosis_type}
                  className="w-[240px] mx-auto"
                />
                <p className="mt-4 text-3xl md:text-4xl font-serif font-bold text-[#F1BF42]">
                  {diagnosis.diagnosis_type}
                </p>
                <p className="mt-3 text-sm md:text-base text-gray-300 max-w-md mx-auto">
                  {diagnosisTypeDescriptions[diagnosis.diagnosis_type]}
                </p>
                <p className="mt-2 text-sm md:text-base text-gray-300 max-w-md mx-auto">
                  {diagnosisTypeDescriptionsJa[diagnosis.diagnosis_type]}
                </p>
              </div>

              {/* Radar Chart */}
              <div className="h-72 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={diagnosisToRadarData(diagnosis)}>
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

          {/* All Scores */}
          <div className="bg-black border border-white/20 p-6 md:p-8">
            <h3 className="text-lg font-bold text-white mb-6">全能力スコア</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['ux_research', 'ui_design', 'facilitation', 'business', 'data'] as Category[]).map(
                (cat) => {
                  const score = getCategoryScore(diagnosis, cat);
                  return (
                    <div key={cat} className="flex items-center gap-4 p-4 border border-white/20">
                      <div
                        className="w-1.5 h-12 shrink-0"
                        style={{ backgroundColor: categoryColors[cat] }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-white">{categoryLabels[cat]}</p>
                        <p className="text-sm text-gray-500">{getScoreLevel(score)}</p>
                      </div>
                      <div className="text-2xl font-serif font-bold text-white">{score}</div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Strength Comment */}
          {diagnosis.strength_comment && (
            <div className="bg-black border border-white/20 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#B5D2CC]" />
                <h3 className="text-lg font-bold text-white">強みのポイント</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">{diagnosis.strength_comment}</p>
            </div>
          )}

          {/* Improvement Comment */}
          {diagnosis.improvement_comment && (
            <div className="bg-black border border-white/20 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-[#FF3318]" />
                <h3 className="text-lg font-bold text-white">改善のヒント</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">{diagnosis.improvement_comment}</p>
            </div>
          )}

          {/* Action Buttons */}
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

export default ResultPage;
