export interface User {
  id: string;
  name: string;
  email: string;
  medId: string;
  role: string;
}

export interface Document {
  id: string;
  userId: string;
  medId: string;
  inputType: 'text' | 'file' | 'voice';
  originalText?: string;
  fileName?: string;
  fileUrl?: string;
  extractedText?: string;
  overview?: Record<string, unknown>;
  summary?: string;
  language: string;
  createdAt?: string;
}

export interface TestResult {
  test_name: string;
  value: string;
  reference_range: string;
  is_abnormal: boolean;
}

export interface Medication {
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Overview {
  patient_info?: {
    name?: string;
    age?: string;
    gender?: string;
    patient_id?: string;
  };
  hospital_info?: {
    hospital_name?: string;
    referring_doctor?: string;
    consulting_doctor?: string;
    report_date?: string;
  };
  test_results?: TestResult[];
  abnormal_findings?: string[];
  medications?: Medication[];
  error?: string;
}
