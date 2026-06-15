import { Category, DiagnosisData, DiagnosisType } from '../types';

export const categoryLabels: Record<Category, string> = {
  ux_research: 'UX Research',
  ui_design: 'UI Design',
  facilitation: 'Facilitation',
  business: 'Business Acumen',
  data: 'Data Literacy',
};

export const categoryColors: Record<Category, string> = {
  ux_research: '#B5D2CC',
  ui_design: '#FFFFFF',
  facilitation: '#F1BF42',
  business: '#999999',
  data: '#FF3318',
};

export const diagnosisTypeDescriptions: Record<DiagnosisType, string> = {
  'UX Researcher':
    'You excel at uncovering user needs and translating insights into design decisions.',
  'Visual Crafter':
    'You create intuitive, consistent, and visually compelling design systems.',
  'Design Facilitator':
    'You bring people together and drive alignment across teams and stakeholders.',
  'Strategic Designer':
    'You connect design to business goals and think beyond pixels.',
  'Data-Driven Designer':
    'You let data guide your decisions and validate your design hypotheses.',
  'Design Generalist':
    'You are a well-rounded designer with strength across all dimensions.',
};

export const diagnosisTypeDescriptionsJa: Record<DiagnosisType, string> = {
  'UX Researcher':
    'ユーザーの潜在ニーズを発見し、インサイトをデザインに活かす力に優れています。',
  'Visual Crafter':
    '直感的で一貫性のある、視覚的に魅力的なデザインシステムを構築できます。',
  'Design Facilitator':
    'チームをまとめ、ステークホルダー間の合意形成をリードする力があります。',
  'Strategic Designer':
    'ビジネス目標とデザインを結びつけ、戦略的な視点で提案できます。',
  'Data-Driven Designer':
    'データに基づいた意思決定でデザインの仮説を検証・改善できます。',
  'Design Generalist':
    'すべての能力軸においてバランスよく力を発揮できる万能型デザイナーです。',
};

export const diagnosisTypeCharacters: Record<DiagnosisType, string> = {
  'UX Researcher': '/characters/ux-researcher.png',
  'Visual Crafter': '/characters/visual-crafter.png',
  'Design Facilitator': '/characters/design-facilitator.png',
  'Strategic Designer': '/characters/strategic-designer.png',
  'Data-Driven Designer': '/characters/data-driven-designer.png',
  'Design Generalist': '/characters/design-generalist.png',
};

const categoryToDiagnosisType: Record<Category, DiagnosisType> = {
  ux_research: 'UX Researcher',
  ui_design: 'Visual Crafter',
  facilitation: 'Design Facilitator',
  business: 'Strategic Designer',
  data: 'Data-Driven Designer',
};

const axisComments: Record<Category, { high: string; medium: string; low: string }> = {
  ux_research: {
    high: 'ユーザーの声を深く聞き、潜在ニーズを掘り起こす力が際立っています。インタビューや観察調査を通じて得たインサイトを、チーム全体の共通認識に変えることができる、リサーチドリブンなデザイナーです。ユーザージャーニーマップやペルソナの活用で、プロジェクトの方向性を正しく導いています。',
    medium:
      'ユーザーリサーチの基本を押さえており、現場での活用も始まっています。インタビュー設計や分析手法をさらに深めることで、より説得力のあるインサイトを導き出せるようになります。定期的なリサーチ実施を習慣化することがステップアップの鍵です。',
    low: 'ユーザーリサーチはデザインの根幹となるスキルです。まずはユーザーインタビューを月1回実施することから始めてみましょう。『ユーザーインタビューのバイブル』などの書籍や、社内外のリサーチャーとの協働が成長を加速させます。',
  },
  ui_design: {
    high: '視覚的な情報設計とデザインシステムの構築・運用において、卓越した力を発揮しています。一貫性のあるコンポーネント設計や、タイポグラフィ・配色への深い理解が、プロダクト全体の品質を底上げしています。チームのデザイン基準を引き上げるリーダー的存在です。',
    medium:
      'UIデザインの基礎はしっかりと身についています。さらにデザインシステムの設計やアクセシビリティへの配慮を深めることで、より多くのユーザーに届くデザインができるようになります。FigmaのAuto Layoutやコンポーネント管理を積極的に活用してみましょう。',
    low: 'UIデザインは練習で確実に伸びるスキルです。まずはタイポグラフィの基礎と配色理論を学ぶことをおすすめします。既存のデザインシステム（Material Design、Apple HIG）を読み込み、優れたUIを模写することが上達の近道です。',
  },
  facilitation: {
    high: 'ワークショップや会議の場で、参加者の力を最大限に引き出すファシリテーション力が光ります。ステークホルダー間の意見の相違を調整し、チームを合意形成へと導く姿勢は、プロジェクトの推進力そのものです。デザインの価値をビジネス全体に広げる橋渡し役として欠かせない存在です。',
    medium:
      'ファシリテーションの基本スキルは備わっています。より複雑な利害関係や対立が生じる場面でのハンドリングを経験することで、さらに成長できます。ワークショップの設計段階から目的と成果物を明確にする習慣をつけると、場のクオリティが上がります。',
    low: 'ファシリテーションは経験を積むことで急速に伸びるスキルです。まずは小規模なチームミーティングの進行役を引き受けることから始めましょう。付箋を使ったブレインストーミングやHow Might Weセッションなど、シンプルな手法から試してみてください。',
  },
  business: {
    high: 'ビジネス目標とデザインを結びつけ、KPIや市場トレンドを踏まえた戦略的な提案ができています。競合分析や事業インパクトの観点からデザインの意思決定を行える力は、デザイナーとして経営層とも対等に議論できるレベルです。',
    medium:
      'ビジネスの基本的な文脈を理解しながらデザインに取り組んでいます。KPIとデザイン成果の関連をより意識することで、経営層やPMへの説明力が増します。ビジネス書やケーススタディの読み込みが、次のステップへの橋渡しになります。',
    low: 'デザインの価値をビジネス成果と結びつけることが、これからの重要な成長テーマです。まずは自分が関わるプロジェクトのKPIを把握することから始めましょう。『ビジネスモデル・ジェネレーション』などの書籍が、ビジネス思考の土台を作る助けになります。',
  },
  data: {
    high: '定量・定性データを組み合わせてインサイトを導き出す力に優れています。A/Bテストや行動データの分析をデザイン改善の根拠として活用できるスキルは、データドリブンな組織においてデザイナーの発言力を高める大きな武器です。',
    medium:
      'データを参照しながらデザイン判断を行う習慣が身についています。分析ツール（Google Analytics、Mixpanelなど）の活用や、A/Bテストの設計・評価をより積極的に行うことで、データとデザインの循環をさらに強化できます。',
    low: 'データ活用はデザインの説得力を高める重要なスキルです。まずはGoogle Analyticsなどの基本的な分析ツールに触れることから始めましょう。数字を見る習慣をつけるだけで、デザインの意思決定の質が変わってきます。',
  },
};

export const getAxisComment = (cat: Category, score: number): string => {
  if (score >= 80) return axisComments[cat].high;
  if (score >= 50) return axisComments[cat].medium;
  return axisComments[cat].low;
};

export const getScoreLevel = (score: number): string => {
  if (score >= 80) return 'エキスパート';
  if (score >= 60) return 'アドバンスド';
  if (score >= 40) return 'スタンダード';
  return 'ビギナー';
};

export const getDiagnosisType = (categoryScores: Record<Category, number>): DiagnosisType => {
  const values = Object.values(categoryScores);
  const max = Math.max(...values);
  const min = Math.min(...values);

  if (max - min <= 15) {
    return 'Design Generalist';
  }

  const topCategory = (Object.keys(categoryScores) as Category[]).sort(
    (a, b) => categoryScores[b] - categoryScores[a]
  )[0];

  return categoryToDiagnosisType[topCategory];
};

export const getCategoryScore = (diagnosis: DiagnosisData, cat: Category): number => {
  const scoreMap: Record<Category, number> = {
    ux_research: diagnosis.ux_research_score,
    ui_design: diagnosis.ui_design_score,
    facilitation: diagnosis.facilitation_score,
    business: diagnosis.business_score,
    data: diagnosis.data_score,
  };
  return scoreMap[cat];
};

export const diagnosisToRadarData = (diagnosis: DiagnosisData) => [
  { category: 'UX Research', score: diagnosis.ux_research_score, fullMark: 100 },
  { category: 'UI Design', score: diagnosis.ui_design_score, fullMark: 100 },
  { category: 'Facilitation', score: diagnosis.facilitation_score, fullMark: 100 },
  { category: 'Business Acumen', score: diagnosis.business_score, fullMark: 100 },
  { category: 'Data Literacy', score: diagnosis.data_score, fullMark: 100 },
];

export const isDiagnosisType = (value: string): value is DiagnosisType => {
  return value in diagnosisTypeCharacters;
};

export const SITE_URL = 'https://designer-diagnostic-app.vercel.app';
