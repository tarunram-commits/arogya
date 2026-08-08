import type {
  Language,
  Patient,
  Priority,
  RiskAssessment,
  RiskLevel,
  VitalFlag,
  Vitals } from
'../types';

/** Parse a "140/90" style reading into systolic / diastolic numbers. */
export function parseBp(bp: string): {systolic: number;diastolic: number;} {
  const [s, d] = bp.split('/').map((part) => Number.parseInt(part.trim(), 10));
  return { systolic: Number.isFinite(s) ? s : 0, diastolic: Number.isFinite(d) ? d : 0 };
}

export function analyzeVitals(v: Vitals): VitalFlag[] {
  const { systolic, diastolic } = parseBp(v.bp);
  const flags: VitalFlag[] = [];

  flags.push({
    key: 'bp',
    label: 'Blood Pressure',
    value: `${v.bp} mmHg`,
    status:
    systolic >= 160 || diastolic >= 100 || systolic > 0 && systolic < 90 ?
    'critical' :
    systolic >= 140 || diastolic >= 90 ?
    'watch' :
    'normal'
  });
  flags.push({
    key: 'hr',
    label: 'Heart Rate',
    value: `${v.heartRate} bpm`,
    status: v.heartRate >= 120 || v.heartRate < 50 ? 'critical' : v.heartRate >= 100 ? 'watch' : 'normal'
  });
  flags.push({
    key: 'temp',
    label: 'Temperature',
    value: `${v.temperature} °F`,
    status: v.temperature >= 103 ? 'critical' : v.temperature >= 100.4 ? 'watch' : 'normal'
  });
  flags.push({
    key: 'spo2',
    label: 'SpO₂',
    value: `${v.spo2}%`,
    status: v.spo2 < 90 ? 'critical' : v.spo2 < 94 ? 'watch' : 'normal'
  });
  flags.push({
    key: 'sugar',
    label: 'Blood Sugar',
    value: `${v.bloodSugar} mg/dL`,
    status: v.bloodSugar >= 250 || v.bloodSugar > 0 && v.bloodSugar < 60 ? 'critical' : v.bloodSugar >= 160 ? 'watch' : 'normal'
  });
  flags.push({
    key: 'weight',
    label: 'Weight',
    value: `${v.weight} kg`,
    status: 'normal'
  });

  return flags;
}

const FLAG_REASON: Record<string, string> = {
  bp: 'blood pressure outside safe range',
  hr: 'abnormal heart rate',
  temp: 'raised body temperature',
  spo2: 'low oxygen saturation',
  sugar: 'unstable blood sugar'
};

export function assessRisk(args: {
  vitals: Vitals;
  patient: Pick<Patient, 'age' | 'history'>;
  priority: Priority;
}): RiskAssessment {
  const flags = analyzeVitals(args.vitals);
  let score = 0;
  const reasonKeys: string[] = [];

  flags.forEach((flag) => {
    if (flag.status === 'critical') {
      score += 30;
      reasonKeys.push(flag.key);
    } else if (flag.status === 'watch') {
      score += 14;
      reasonKeys.push(flag.key);
    }
  });

  if (args.patient.age >= 65) {
    score += 12;
    reasonKeys.push('age');
  }
  const chronic = /diabet|hypertens|cardiac|heart|asthma|copd|kidney|renal|tuberc|stroke|cancer/i;
  if (chronic.test(args.patient.history || '')) {
    score += 14;
    reasonKeys.push('chronic');
  }
  if (args.priority === 'Emergency') {
    score += 26;
    reasonKeys.push('priority');
  } else if (args.priority === 'Urgent') {
    score += 12;
    reasonKeys.push('priority');
  }

  const clamped = Math.max(6, Math.min(98, score));
  const level: RiskLevel = clamped >= 62 ? 'High' : clamped >= 32 ? 'Medium' : 'Low';
  return { level, score: clamped, reasonKeys: reasonKeys.slice(0, 4) };
}

const REASON_LABELS: Record<Language, Record<string, string>> = {
  en: {
    ...FLAG_REASON,
    age: 'advanced age',
    chronic: 'chronic condition in history',
    priority: 'clinician-marked urgency'
  },
  hi: {
    bp: 'रक्तचाप सामान्य सीमा से बाहर',
    hr: 'असामान्य नाड़ी दर',
    temp: 'शरीर का तापमान बढ़ा हुआ',
    spo2: 'ऑक्सीजन स्तर कम',
    sugar: 'रक्त शर्करा अस्थिर',
    age: 'अधिक आयु',
    chronic: 'इतिहास में पुरानी बीमारी',
    priority: 'चिकित्सक द्वारा चिह्नित तात्कालिकता'
  },
  kn: {
    bp: 'ರಕ್ತದೊತ್ತಡ ಸಾಮಾನ್ಯ ಮಿತಿಯಿಂದ ಹೊರಗಿದೆ',
    hr: 'ಅಸಹಜ ನಾಡಿ ಬಡಿತ',
    temp: 'ದೇಹದ ಉಷ್ಣಾಂಶ ಹೆಚ್ಚಾಗಿದೆ',
    spo2: 'ಆಮ್ಲಜನಕ ಮಟ್ಟ ಕಡಿಮೆ',
    sugar: 'ರಕ್ತದ ಸಕ್ಕರೆ ಅಸ್ಥಿರ',
    age: 'ಹೆಚ್ಚಿನ ವಯಸ್ಸು',
    chronic: 'ಇತಿಹಾಸದಲ್ಲಿ ದೀರ್ಘಕಾಲದ ಕಾಯಿಲೆ',
    priority: 'ವೈದ್ಯರಿಂದ ಗುರುತಿಸಲಾದ ತುರ್ತು'
  },
  mr: {
    bp: 'रक्तदाब सामान्य मर्यादेबाहेर',
    hr: 'असामान्य नाडी गती',
    temp: 'शरीराचे तापमान वाढलेले',
    spo2: 'ऑक्सिजन पातळी कमी',
    sugar: 'रक्तशर्करा अस्थिर',
    age: 'अधिक वय',
    chronic: 'इतिहासात दीर्घकालीन आजार',
    priority: 'डॉक्टरांनी नोंदवलेली तातडी'
  }
};

const WORDS: Record<Language, Record<string, string>> = {
  en: { Male: 'male', Female: 'female', Other: 'patient', Low: 'Low', Medium: 'Medium', High: 'High', Routine: 'Routine', Urgent: 'Urgent', Emergency: 'Emergency', none: 'no significant findings' },
  hi: { Male: 'पुरुष', Female: 'महिला', Other: 'रोगी', Low: 'कम', Medium: 'मध्यम', High: 'उच्च', Routine: 'सामान्य', Urgent: 'तत्काल', Emergency: 'आपातकाल', none: 'कोई विशेष निष्कर्ष नहीं' },
  kn: { Male: 'ಪುರುಷ', Female: 'ಮಹಿಳೆ', Other: 'ರೋಗಿ', Low: 'ಕಡಿಮೆ', Medium: 'ಮಧ್ಯಮ', High: 'ಹೆಚ್ಚಿನ', Routine: 'ಸಾಮಾನ್ಯ', Urgent: 'ತುರ್ತು', Emergency: 'ತೀವ್ರ ತುರ್ತು', none: 'ಯಾವುದೇ ಗಮನಾರ್ಹ ಅಂಶಗಳಿಲ್ಲ' },
  mr: { Male: 'पुरुष', Female: 'महिला', Other: 'रुग्ण', Low: 'कमी', Medium: 'मध्यम', High: 'उच्च', Routine: 'सामान्य', Urgent: 'तातडीचे', Emergency: 'आपत्कालीन', none: 'कोणतेही विशेष निष्कर्ष नाहीत' }
};

const TEMPLATES: Record<Language, (t: Record<string, string>) => string> = {
  en: (t) =>
  `${t.name}, a ${t.age}-year-old ${t.gender} from ${t.village}, presents with ${t.symptoms}. Recorded vitals — BP ${t.bp} mmHg, pulse ${t.hr} bpm, temperature ${t.temp} °F, SpO₂ ${t.spo2}%, blood sugar ${t.sugar} mg/dL, weight ${t.weight} kg. Clinical impression: ${t.diagnosis}. Relevant history: ${t.history}. Findings needing attention: ${t.flags}. AI risk assessment: ${t.risk} risk (${t.score}/100) driven by ${t.reasons}. Referred to ${t.department}, ${t.hospital} for ${t.reason}. Priority: ${t.priority}. Advisory only — the treating clinician's judgement prevails.`,
  hi: (t) =>
  `${t.village} गाँव के ${t.age} वर्षीय ${t.gender} रोगी ${t.name} ${t.symptoms} की शिकायत के साथ आए हैं। दर्ज किए गए महत्वपूर्ण संकेत — रक्तचाप ${t.bp} mmHg, नाड़ी ${t.hr} bpm, तापमान ${t.temp} °F, ऑक्सीजन स्तर ${t.spo2}%, रक्त शर्करा ${t.sugar} mg/dL, वजन ${t.weight} kg। नैदानिक निदान: ${t.diagnosis}। प्रासंगिक चिकित्सा इतिहास: ${t.history}। ध्यान देने योग्य निष्कर्ष: ${t.flags}। AI जोखिम आकलन: ${t.risk} जोखिम (${t.score}/100), कारण — ${t.reasons}। ${t.hospital} के ${t.department} विभाग में ${t.reason} हेतु संदर्भित। प्राथमिकता: ${t.priority}। यह केवल सलाह है — अंतिम निर्णय उपचार करने वाले चिकित्सक का होगा।`,
  kn: (t) =>
  `${t.village} ಗ್ರಾಮದ ${t.age} ವರ್ಷದ ${t.gender} ರೋಗಿ ${t.name} ${t.symptoms} ದೂರುಗಳೊಂದಿಗೆ ಬಂದಿದ್ದಾರೆ. ದಾಖಲಾದ ಜೀವಸೂಚಕಗಳು — ರಕ್ತದೊತ್ತಡ ${t.bp} mmHg, ನಾಡಿ ${t.hr} bpm, ಉಷ್ಣಾಂಶ ${t.temp} °F, ಆಮ್ಲಜನಕ ಮಟ್ಟ ${t.spo2}%, ರಕ್ತದ ಸಕ್ಕರೆ ${t.sugar} mg/dL, ತೂಕ ${t.weight} kg. ವೈದ್ಯಕೀಯ ನಿರ್ಣಯ: ${t.diagnosis}. ಹಿಂದಿನ ಆರೋಗ್ಯ ಇತಿಹಾಸ: ${t.history}. ಗಮನ ಬೇಕಾದ ಅಂಶಗಳು: ${t.flags}. AI ಅಪಾಯ ಮೌಲ್ಯಮಾಪನ: ${t.risk} ಅಪಾಯ (${t.score}/100), ಕಾರಣ — ${t.reasons}. ${t.hospital} ನ ${t.department} ವಿಭಾಗಕ್ಕೆ ${t.reason} ಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ. ಆದ್ಯತೆ: ${t.priority}. ಇದು ಸಲಹೆ ಮಾತ್ರ — ಅಂತಿಮ ನಿರ್ಧಾರ ಚಿಕಿತ್ಸಕ ವೈದ್ಯರದ್ದು.`,
  mr: (t) =>
  `${t.village} गावातील ${t.age} वर्षांचे ${t.gender} रुग्ण ${t.name} ${t.symptoms} ची तक्रार घेऊन आले आहेत. नोंदवलेली महत्त्वाची चिन्हे — रक्तदाब ${t.bp} mmHg, नाडी ${t.hr} bpm, तापमान ${t.temp} °F, ऑक्सिजन पातळी ${t.spo2}%, रक्तशर्करा ${t.sugar} mg/dL, वजन ${t.weight} kg. वैद्यकीय निदान: ${t.diagnosis}. पूर्वीचा वैद्यकीय इतिहास: ${t.history}. लक्ष देण्याजोगे निष्कर्ष: ${t.flags}. AI जोखीम मूल्यांकन: ${t.risk} जोखीम (${t.score}/100), कारण — ${t.reasons}. ${t.hospital} येथील ${t.department} विभागाकडे ${t.reason} साठी संदर्भित. प्राधान्य: ${t.priority}. हे केवळ सल्ला आहे — अंतिम निर्णय उपचार करणाऱ्या डॉक्टरांचा.`
};

export interface SummaryInput {
  patient: Pick<Patient, 'name' | 'age' | 'gender' | 'village' | 'history'>;
  vitals: Vitals;
  symptoms: string;
  diagnosis: string;
  hospital: string;
  department: string;
  reason: string;
  priority: Priority;
  risk: RiskAssessment;
}

export function generateSummary(input: SummaryInput): Record<Language, string> {
  const flags = analyzeVitals(input.vitals).filter((f) => f.status !== 'normal');
  const languages: Language[] = ['en', 'kn', 'hi', 'mr'];
  const out = {} as Record<Language, string>;

  languages.forEach((lang) => {
    const dict = REASON_LABELS[lang];
    const words = WORDS[lang];
    const flagText = flags.length ?
    flags.map((f) => `${dict[f.key] ?? f.label} (${f.value})`).join(', ') :
    words.none;
    const reasonText = input.risk.reasonKeys.length ?
    input.risk.reasonKeys.map((k) => dict[k] ?? k).join(', ') :
    words.none;

    out[lang] = TEMPLATES[lang]({
      name: input.patient.name,
      age: String(input.patient.age),
      gender: words[input.patient.gender] ?? '',
      village: input.patient.village,
      symptoms: input.symptoms || '—',
      bp: input.vitals.bp,
      hr: String(input.vitals.heartRate),
      temp: String(input.vitals.temperature),
      spo2: String(input.vitals.spo2),
      sugar: String(input.vitals.bloodSugar),
      weight: String(input.vitals.weight),
      diagnosis: input.diagnosis || '—',
      history: input.patient.history || '—',
      flags: flagText,
      risk: words[input.risk.level],
      score: String(input.risk.score),
      reasons: reasonText,
      hospital: input.hospital,
      department: input.department,
      reason: input.reason,
      priority: words[input.priority]
    });
  });

  return out;
}

export const LANGUAGES: {code: Language;label: string;native: string;}[] = [
{ code: 'en', label: 'English', native: 'English' },
{ code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
{ code: 'hi', label: 'Hindi', native: 'हिन्दी' },
{ code: 'mr', label: 'Marathi', native: 'मराठी' }];