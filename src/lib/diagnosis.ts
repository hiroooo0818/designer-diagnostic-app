import { supabase } from './supabase';
import { DiagnosisData, DiagnosisInput } from '../types';

export async function saveDiagnosis(input: DiagnosisInput): Promise<DiagnosisData | null> {
  const { data, error } = await supabase
    .from('diagnostics')
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error('Error saving diagnosis:', error);
    return null;
  }

  return data as DiagnosisData;
}

export async function getDiagnosisHistory(): Promise<DiagnosisData[]> {
  const { data, error } = await supabase
    .from('diagnostics')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching diagnosis history:', error);
    return [];
  }

  return data as DiagnosisData[];
}

export async function getDiagnosisById(id: string): Promise<DiagnosisData | null> {
  const { data, error } = await supabase
    .from('diagnostics')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching diagnosis:', error);
    return null;
  }

  return data as DiagnosisData;
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
