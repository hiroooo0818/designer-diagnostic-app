import { useState, useMemo, useEffect } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import {
  ChevronRight,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Search,
  Palette,
  Users,
  LineChart,
  BarChart3,
  History,
  Save,
  Check,
  ChevronLeft,
  Calendar,
  Copy,
} from 'lucide-react';
import {
  saveDiagnosis,
  getDiagnosisHistory,
  getDiagnosisById,
  generateSessionId,
} from './lib/diagnosis';
import {
  categoryLabels,
  categoryColors,
  diagnosisTypeDescriptions,
  diagnosisTypeDescriptionsJa,
  diagnosisTypeCharacters,
  getScoreLevel,
  getDiagnosisType,
  getCategoryScore,
  diagnosisToRadarData,
  getAxisComment,
  SITE_URL,
} from './lib/diagnosisMeta';
import { Category, DiagnosisData, Screen } from './types';

interface Question {
  id: number;
  text: string;
  category: Category;
}

const questions: Question[] = [
  {
    id: 1,
    text: 'ユーザーインタビューや調査を通じて、ユーザーの本当のニーズを発見することができる',
    category: 'ux_research',
  },
  {
    id: 2,
    text: '情報の優先順位を適切に設計し、ユーザーにとって分かりやすい情報設計ができる',
    category: 'ui_design',
  },
  {
    id: 3,
    text: 'ワークショップやブレインストーミングで、参加者から最大限の成果を引き出せる',
    category: 'facilitation',
  },
  {
    id: 4,
    text: 'ビジネス目標とKPIを理解し、デザインの意思決定と紐付けることができる',
    category: 'business',
  },
  {
    id: 5,
    text: 'A/Bテストやユーザー行動データを分析し、デザイン改善の根拠として活用できる',
    category: 'data',
  },
  {
    id: 6,
    text: 'ユーザージャーニーマップやペルソナを作成し、チームで共有・活用している',
    category: 'ux_research',
  },
  {
    id: 7,
    text: '一貫性のあるデザイントークンやコンポーネントシステムを設計・運用できる',
    category: 'ui_design',
  },
  {
    id: 8,
    text: 'ステークホルダー間の意見の相違を調整し、合意形成をリードできる',
    category: 'facilitation',
  },
  {
    id: 9,
    text: '競合他社や市場トレンドを分析し、デザイン戦略に反映できる',
    category: 'business',
  },
  {
    id: 10,
    text: '定量データと定性データを組み合わせて、インサイトを導き出せる',
    category: 'data',
  },
  {
    id: 11,
    text: 'ユーザビリティテストを実施し、得られた知見を設計の改善に反映できる',
    category: 'ux_research',
  },
  {
    id: 12,
    text: 'タイポグラフィや配色、レイアウトの原則を踏まえた視覚デザインができる',
    category: 'ui_design',
  },
  {
    id: 13,
    text: 'デザインレビューを建設的に進行し、チームの意思決定を促進できる',
    category: 'facilitation',
  },
  {
    id: 14,
    text: '事業計画やROIの観点から、デザインに関する投資の優先順位を判断できる',
    category: 'business',
  },
  {
    id: 15,
    text: 'アナリティクスツールを用いて、ユーザー行動の傾向や課題を把握できる',
    category: 'data',
  },
  {
    id: 16,
    text: '観察調査やフィールドワークから、ユーザーの行動背景や文脈を読み解くことができる',
    category: 'ux_research',
  },
  {
    id: 17,
    text: 'アクセシビリティやユーザビリティを考慮したインターフェース設計ができる',
    category: 'ui_design',
  },
  {
    id: 18,
    text: '異なる職種のメンバーと円滑にコミュニケーションを取り、協働を進められる',
    category: 'facilitation',
  },
  {
    id: 19,
    text: 'プロダクト戦略やビジネスモデルを理解し、デザイン提案に活かすことができる',
    category: 'business',
  },
  {
    id: 20,
    text: 'データに基づく仮説検証のサイクルを設計し、継続的に改善を行うことができる',
    category: 'data',
  },
];

const categoryIcons: Record<Category, React.ReactNode> = {
  ux_research: <Search className="w-5 h-5" />,
  ui_design: <Palette className="w-5 h-5" />,
  facilitation: <Users className="w-5 h-5" />,
  business: <LineChart className="w-5 h-5" />,
  data: <BarChart3 className="w-5 h-5" />,
};

const strengthComments: Record<Category, string> = {
  ux_research: 'ユーザーの潜在ニーズを深く理解し、インサイトを導き出す力に優れています。',
  ui_design: '視覚的な情報設計と一貫性のあるデザインシステム構築に長けています。',
  facilitation: 'チームをまとめ、ステークホルダーとの合意形成をスムーズに進める力があります。',
  business: 'ビジネス目標を理解し、戦略的な視点でデザイン提案ができる能力があります。',
  data: '定量・定性データを分析し、意思決定に活かす力に優れています。',
};

const improvementComments: Record<Category, string> = {
  ux_research: 'ユーザーインタビューや観察調査の実施頻度を増やし、手法を学習してみましょう。',
  ui_design: 'デザインシステムの構築やタイポグラフィ・配色理論の学習をおすすめします。',
  facilitation: 'ワークショップの進行役を積極的に引き受け、ファシリテーション経験を積みましょう。',
  business: 'ビジネス書籍や市場調査に触れ、KPI・ROIへの理解を深めてみましょう。',
  data: 'A/Bテストや分析ツールの習得から始め、データに基づく判断を増やしてみましょう。',
};

function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [savedDiagnosisId, setSavedDiagnosisId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [history, setHistory] = useState<DiagnosisData[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiagnosisData | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setScreen('result');
    }
  };

  const scores = useMemo(() => {
    const categoryScores: Record<Category, number[]> = {
      ux_research: [],
      ui_design: [],
      facilitation: [],
      business: [],
      data: [],
    };

    questions.forEach((q) => {
      const answer = answers[q.id] || 0;
      categoryScores[q.category].push(answer);
    });

    const result: Record<Category, number> = {} as Record<Category, number>;
    (Object.keys(categoryScores) as Category[]).forEach((cat) => {
      const catScores = categoryScores[cat];
      const avg = catScores.length > 0 ? catScores.reduce((a, b) => a + b, 0) / catScores.length : 0;
      result[cat] = Math.round(avg * 20);
    });

    return result;
  }, [answers]);

  const totalScore = useMemo(() => {
    return Math.round(
      Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length
    );
  }, [scores]);

  const radarData = useMemo(() => {
    return (Object.keys(categoryLabels) as Category[]).map((cat) => ({
      category: categoryLabels[cat],
      score: scores[cat],
      fullMark: 100,
    }));
  }, [scores]);

  const strengths = useMemo(() => {
    const sorted = (Object.keys(scores) as Category[]).sort((a, b) => scores[b] - scores[a]);
    return sorted.slice(0, 2);
  }, [scores]);

  const improvements = useMemo(() => {
    const sorted = (Object.keys(scores) as Category[]).sort((a, b) => scores[a] - scores[b]);
    return sorted.slice(0, 2);
  }, [scores]);

  const diagnosisType = useMemo(() => getDiagnosisType(scores), [scores]);

  const resetDiagnosis = () => {
    setScreen('welcome');
    setCurrentQuestion(0);
    setAnswers({});
    setSavedDiagnosisId(null);
    setSaveSuccess(false);
    setCopied(false);
  };

  const handleSaveDiagnosis = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const strengthText = strengths.map((cat) => strengthComments[cat]).join(' ');
    const improvementText = improvements.map((cat) => improvementComments[cat]).join(' ');

    const result = await saveDiagnosis({
      session_id: generateSessionId(),
      ux_research_score: scores.ux_research,
      ui_design_score: scores.ui_design,
      facilitation_score: scores.facilitation,
      business_score: scores.business,
      data_score: scores.data,
      total_score: totalScore,
      diagnosis_type: diagnosisType,
      strength_comment: strengthText,
      improvement_comment: improvementText,
      answers,
    });

    setIsSaving(false);

    if (result) {
      setSavedDiagnosisId(result.id);
      setSaveSuccess(true);
    }
  };

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    const data = await getDiagnosisHistory();
    setHistory(data);
    setIsLoadingHistory(false);
  };

  const loadDiagnosisDetail = async (id: string) => {
    const data = await getDiagnosisById(id);
    if (data) {
      setSelectedDiagnosis(data);
      setScreen('history_detail');
    }
  };

  useEffect(() => {
    if (screen === 'history') {
      loadHistory();
    }
  }, [screen]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

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

  const resultUrl = savedDiagnosisId ? `${SITE_URL}/result/${savedDiagnosisId}` : '';

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(resultUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareResult = async () => {
    const params = new URLSearchParams({
      type: diagnosisType,
      score: String(totalScore),
      ux: String(scores.ux_research),
      ui: String(scores.ui_design),
      fac: String(scores.facilitation),
      biz: String(scores.business),
      data: String(scores.data),
    });
    const shareUrl = `${SITE_URL}/result?${params.toString()}`;
    await navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black border-b border-white/20 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setScreen('welcome')}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <img src="/logo.png" alt="Designer Diagnostic" style={{ height: '32px', width: 'auto' }} />
          </button>
          <div className="flex items-center gap-3">
            {screen === 'questions' && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span>
                  {currentQuestion + 1} / {questions.length}
                </span>
              </div>
            )}
            {screen !== 'questions' && screen !== 'welcome' && (
              <button
                onClick={() => setScreen('history')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <History className="w-4 h-4" />
                履歴
              </button>
            )}
          </div>
        </div>
        {screen === 'questions' && (
          <div className="h-1 bg-white/10">
            <div
              className="h-full bg-[#B5D2CC] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Screen */}
          {screen === 'welcome' && (
            <div className="min-h-[calc(100vh-12rem)] flex items-center">
              <div className="w-full text-center space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <img
                    src="/logo.png"
                    alt="Designer Diagnostic"
                    style={{ width: '500px', maxWidth: '90vw' }}
                    className="mx-auto mb-4"
                  />
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    What are your strengths as a designer?
                  </h1>
                  <p className="text-gray-300 text-lg max-w-md mx-auto">
                    20の質問に答えて、5つの能力軸から
                    あなたの強みと改善ポイントを可視化します
                  </p>
                </div>

                <div className="space-y-3">
                  {(Object.keys(categoryLabels) as Category[]).map((cat) => (
                    <div
                      key={cat}
                      className="flex items-center gap-3 px-4 py-3 bg-black border border-white/20 text-gray-200"
                    >
                      <div className="text-[#B5D2CC]">{categoryIcons[cat]}</div>
                      <span className="font-medium">{categoryLabels[cat]}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setScreen('questions')}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#F1BF42] text-[#000000] font-semibold rounded-[3px] hover:opacity-90 transition-opacity"
                  >
                    診断を始める
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div>
                    <button
                      onClick={() => setScreen('history')}
                      className="inline-flex items-center gap-2 px-6 py-3 text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20 rounded-[3px] transition-colors"
                    >
                      <History className="w-4 h-4" />
                      過去の診断結果を見る
                    </button>
                  </div>
                </div>

                <p className="text-gray-400 text-sm">所要時間：約4分</p>
              </div>
            </div>
          )}

          {/* Question Screen */}
          {screen === 'questions' && (
            <div className="min-h-[calc(100vh-12rem)] flex items-center py-8">
              <div className="w-full space-y-8 animate-fade-in">
                <div className="text-center space-y-2">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-[#F1BF42] text-black">
                    Question {currentQuestion + 1}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-white px-4 leading-relaxed">
                    {questions[currentQuestion].text}
                  </h2>
                </div>

                <div className="space-y-3">
                  <p className="text-center text-sm text-gray-500 mb-4">
                    1（まったく当てはまらない）〜 5（非常に当てはまる）
                  </p>
                  <div className="grid grid-cols-5 gap-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleAnswer(value)}
                        className={`
                          aspect-square rounded-[3px] text-xl font-bold
                          transition-colors duration-200
                          ${
                            answers[questions[currentQuestion].id] === value
                              ? 'bg-[#B5D2CC] text-white border border-[#B5D2CC]'
                              : 'bg-black text-gray-200 border border-white/20 hover:border-[#B5D2CC]'
                          }
                        `}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 px-2">
                    <span>当てはまらない</span>
                    <span>強く当てはまる</span>
                  </div>
                </div>

                <div className="flex justify-center gap-2 pt-4">
                  {questions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 transition-colors duration-300 ${
                        idx < currentQuestion
                          ? 'bg-[#B5D2CC]'
                          : idx === currentQuestion
                          ? 'bg-[#F1BF42]'
                          : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Result Screen */}
          {screen === 'result' && (
            <div className="py-8 space-y-8 animate-fade-in">
              <div className="text-center space-y-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-[#F1BF42] text-[#000000]">
                  <Sparkles className="w-3 h-3 text-[#000000]" />
                  診断完了
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  あなたの診断結果
                </h2>
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
                        <PolarAngleAxis
                          dataKey="category"
                          tick={{ fill: '#FFFFFF', fontSize: 12 }}
                        />
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
                            <span className="font-medium text-gray-200">
                              {categoryLabels[cat]}
                            </span>
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
                            <span className="font-medium text-gray-200">
                              {categoryLabels[cat]}
                            </span>
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
                    <div
                      key={cat}
                      className="flex items-center gap-4 p-4 border border-white/20"
                    >
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

              {/* Save and Restart Buttons */}
              <div className="text-center space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleShareResult}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#B5D2CC] text-[#000000] font-medium rounded-[3px] hover:opacity-90 transition-opacity"
                  >
                    <Copy className="w-4 h-4" />
                    {shareCopied ? 'Copied!' : '結果をシェア'}
                  </button>

                  {!savedDiagnosisId ? (
                    <button
                      onClick={handleSaveDiagnosis}
                      disabled={isSaving}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F1BF42] text-[#000000] font-medium rounded-[3px] hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? '保存中...' : '結果を保存する'}
                    </button>
                  ) : saveSuccess ? (
                    <div className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-[#B5D2CC] font-medium">
                      <Check className="w-4 h-4" />
                      診断結果を保存しました
                    </div>
                  ) : null}
                </div>

                {savedDiagnosisId && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">結果をシェア</p>
                    <div className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto">
                      <input
                        type="text"
                        readOnly
                        value={resultUrl}
                        className="w-full sm:flex-1 px-3 py-2 bg-black border border-white/20 text-gray-200 text-sm rounded-[3px] truncate"
                      />
                      <button
                        onClick={handleCopyUrl}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#F1BF42] text-black font-medium rounded-[3px] hover:opacity-90 transition-opacity whitespace-nowrap w-full sm:w-auto"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? 'Copied!' : '結果URLをコピー'}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <button
                    onClick={resetDiagnosis}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black border border-white/20 text-gray-200 font-medium rounded-[3px] hover:bg-white/10 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    もう一度診断する
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* History Screen */}
          {screen === 'history' && (
            <div className="py-8 space-y-8 animate-fade-in">
              <div className="space-y-4">
                <button
                  onClick={() => setScreen('welcome')}
                  className="inline-flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  ホームに戻る
                </button>

                <h2 className="text-2xl font-bold text-white">過去の診断結果</h2>
              </div>

              {isLoadingHistory ? (
                <div className="text-center py-12 text-gray-500">読み込み中...</div>
              ) : history.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">まだ診断履歴がありません</p>
                  <button
                    onClick={() => setScreen('questions')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#F1BF42] text-[#000000] font-medium rounded-[3px] hover:opacity-90 transition-opacity"
                  >
                    診断を始める
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadDiagnosisDetail(item.id)}
                      className="w-full text-left bg-black border border-white/20 p-5 hover:border-[#B5D2CC] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {formatDate(item.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-3xl font-serif font-bold text-white">
                              {item.total_score}
                            </span>
                            <span className="px-2 py-1 text-sm font-medium border border-white/20 text-gray-200">
                              {item.diagnosis_type}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="mt-4 flex gap-2 flex-wrap">
                        {(['ux_research', 'ui_design', 'facilitation', 'business', 'data'] as Category[]).map(
                          (cat) => (
                            <span
                              key={cat}
                              className="inline-flex items-center gap-1.5 px-2 py-1 text-xs border border-white/20 text-gray-200"
                            >
                              <span
                                className="w-2 h-2"
                                style={{ backgroundColor: categoryColors[cat] }}
                              />
                              {categoryLabels[cat]}: {getCategoryScore(item, cat)}
                            </span>
                          )
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* History Detail Screen */}
          {screen === 'history_detail' && selectedDiagnosis && (
            <div className="py-8 space-y-8 animate-fade-in">
              <div className="space-y-4">
                <button
                  onClick={() => setScreen('history')}
                  className="inline-flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  履歴一覧に戻る
                </button>

                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedDiagnosis.created_at)}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  診断結果詳細
                </h2>
              </div>

              {/* Total Score Card */}
              <div className="bg-black border border-white/20 p-6 md:p-8">
                <div className="text-center space-y-6">
                  <div>
                    <p className="text-gray-500 text-sm mb-2">総合スコア</p>
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-6xl md:text-7xl font-serif font-bold text-white">
                        {selectedDiagnosis.total_score}
                      </span>
                      <span className="text-2xl text-gray-400">/ 100</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/20">
                    <img
                      src={diagnosisTypeCharacters[selectedDiagnosis.diagnosis_type]}
                      alt={selectedDiagnosis.diagnosis_type}
                      className="w-[240px] mx-auto"
                    />
                    <p className="mt-4 text-3xl md:text-4xl font-serif font-bold text-[#F1BF42]">
                      {selectedDiagnosis.diagnosis_type}
                    </p>
                    <p className="mt-3 text-sm md:text-base text-gray-300 max-w-md mx-auto">
                      {diagnosisTypeDescriptions[selectedDiagnosis.diagnosis_type]}
                    </p>
                    <p className="mt-2 text-sm md:text-base text-gray-300 max-w-md mx-auto">
                      {diagnosisTypeDescriptionsJa[selectedDiagnosis.diagnosis_type]}
                    </p>
                  </div>

                  {/* Radar Chart */}
                  <div className="h-72 md:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="70%"
                        data={diagnosisToRadarData(selectedDiagnosis)}
                      >
                        <PolarGrid stroke="rgba(255,255,255,0.2)" />
                        <PolarAngleAxis
                          dataKey="category"
                          tick={{ fill: '#FFFFFF', fontSize: 12 }}
                        />
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
                      const score = getCategoryScore(selectedDiagnosis, cat);
                      return (
                        <div
                          key={cat}
                          className="flex items-center gap-4 p-4 border border-white/20"
                        >
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
              {selectedDiagnosis.strength_comment && (
                <div className="bg-black border border-white/20 p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-[#B5D2CC]" />
                    <h3 className="text-lg font-bold text-white">強みのポイント</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedDiagnosis.strength_comment}
                  </p>
                </div>
              )}

              {/* Improvement Comment */}
              {selectedDiagnosis.improvement_comment && (
                <div className="bg-black border border-white/20 p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown className="w-5 h-5 text-[#FF3318]" />
                    <h3 className="text-lg font-bold text-white">改善のヒント</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedDiagnosis.improvement_comment}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="text-center space-y-4">
                <button
                  onClick={() => setScreen('history')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black border border-white/20 text-gray-200 font-medium rounded-[3px] hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  履歴一覧へ
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400 border-t border-white/20">
        <p>Designer Diagnostic - あなたの強みを可視化</p>
      </footer>
    </div>
  );
}

export default App;
