export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
];

export const INPUT_MODES = [
  { id: 'text', label: 'Text Input', icon: '📝' },
  { id: 'file', label: 'File Upload', icon: '📁' },
  { id: 'voice', label: 'Voice Input', icon: '🎤' },
];
