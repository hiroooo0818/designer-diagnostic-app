export type Category = 'ux_research' | 'ui_design' | 'facilitation' | 'business' | 'data';

export type DiagnosisType =
  | 'UX Researcher'
  | 'Visual Crafter'
  | 'Design Facilitator'
  | 'Strategic Designer'
  | 'Data-Driven Designer'
  | 'Design Generalist';

export interface DiagnosisData {
  id: string;
  user_id?: string;
  session_id?: string;
  created_at: string;
  ux_research_score: number;
  ui_design_score: number;
  facilitation_score: number;
  business_score: number;
  data_score: number;
  total_score: number;
  diagnosis_type: DiagnosisType;
  strength_comment: string;
  improvement_comment: string;
  answers: Record<number, number>;
}

export interface DiagnosisInput {
  session_id: string;
  ux_research_score: number;
  ui_design_score: number;
  facilitation_score: number;
  business_score: number;
  data_score: number;
  total_score: number;
  diagnosis_type: DiagnosisType;
  strength_comment: string;
  improvement_comment: string;
  answers: Record<number, number>;
}

export type Screen = 'welcome' | 'questions' | 'result' | 'history' | 'history_detail';
