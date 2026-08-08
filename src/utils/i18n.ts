import type { Language } from '../types';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Nav Items
    'nav.dashboard': 'Dashboard',
    'nav.search_patient': 'Search Patient',
    'nav.register_patient': 'Register Patient',
    'nav.new_referral': 'New Referral',
    'nav.referral_log': 'Referral Log',
    'nav.scan_qr': 'Scan QR Code',
    'nav.referral_queue': 'Referral Queue',
    'nav.profile_settings': 'Profile Settings',

    // Dashboard Banner
    'banner.slogan_prefix': "Bharat's",
    'banner.slogan_highlight': 'Health, Our Priority.',
    'banner.welcome': 'Welcome',
    'banner.phc_desc': 'Empowering primary care with AI-driven triage, instant QR referral slips, and scannable ABDM-aligned health vaults across rural India.',
    'banner.specialist_desc': 'Review incoming high-priority referrals, scan patient referral QR tokens at your desk, and access encrypted ABDM health vaults instantly.',
    'banner.register_patient_btn': '+ Register Patient',
    'banner.create_referral_btn': '+ Create Referral Slip',
    'banner.scan_qr_btn': 'Scan Referral QR',
    'banner.queue_btn': 'Referral Queue',

    // Speech Bubbles
    'bubble.phc_doctor': '"AI risk triage & instant QR handoffs"',
    'bubble.phc_patient': '"Health vault travels with me"',
    'bubble.specialist_doctor': '"Scan QR for instant patient vault access"',
    'bubble.specialist_patient': '"Seamless referral handoffs"',

    // Stats
    'stat.total_patients': 'Total patients',
    'stat.total_referrals': 'Total referrals',
    'stat.emergency_cases': 'Emergency cases',
    'stat.active_referrals': 'Active referrals',
    'stat.incoming_referrals': 'Incoming referrals',
    'stat.emergency_waiting': 'Emergency waiting',
    'stat.under_treatment': 'Under treatment',
    'stat.completed_handoffs': 'Completed handoffs',

    // Headings & Labels
    'heading.referral_volume': 'Referral volume — last 7 days',
    'heading.priority_mix': 'Priority mix',
    'heading.priority_queue': 'Priority queue',
    'heading.ai_risk_dist': 'AI risk distribution',
    'heading.search_placeholder': 'Search patient, ID or mobile...',
    'heading.patient_directory': 'Patient Directory',

    // Buttons & Actions
    'action.upload_report': 'Upload Report (PDF/Pic)',
    'action.new_referral': 'New referral',
    'action.delete_patient': 'Delete Patient',
    'action.view_queue': 'View queue →',
    'action.view_vault': 'Open Health Vault'
  },
  hi: {
    // Nav Items
    'nav.dashboard': 'डैशबोर्ड',
    'nav.search_patient': 'रोगी खोजें',
    'nav.register_patient': 'रोगी पंजीकरण',
    'nav.new_referral': 'नया रेफ़रल',
    'nav.referral_log': 'रेफ़रल लॉग',
    'nav.scan_qr': 'क्यूआर कोड स्कैन करें',
    'nav.referral_queue': 'रेफ़रल कतार',
    'nav.profile_settings': 'प्रोफ़ाइल सेटिंग्स',

    // Dashboard Banner
    'banner.slogan_prefix': 'भारत का',
    'banner.slogan_highlight': 'स्वास्थ्य, हमारी प्राथमिकता।',
    'banner.welcome': 'स्वागत है',
    'banner.phc_desc': 'एआई-संचालित जोखिम वर्गीकरण, तत्काल क्यूआर रेफ़रल पर्चियों और भारत भर में स्कैन योग्य एबीडीएम स्वास्थ्य तिजोरी के साथ प्राथमिक देखभाल को सशक्त बनाना।',
    'banner.specialist_desc': 'आने वाले उच्च-प्राथमिकता वाले रेफ़रल की समीक्षा करें, अपने डेस्क पर क्यूआर टोकन स्कैन करें और डिजिटल स्वास्थ्य तिजोरी तक तुरंत पहुँच प्राप्त करें।',
    'banner.register_patient_btn': '+ रोगी पंजीकृत करें',
    'banner.create_referral_btn': '+ रेफ़रल पर्ची बनाएं',
    'banner.scan_qr_btn': 'क्यूआर स्कैन करें',
    'banner.queue_btn': 'रेफ़रल कतार देखें',

    // Speech Bubbles
    'bubble.phc_doctor': '"एआई जोखिम वर्गीकरण और क्यूआर हैंडऑफ़"',
    'bubble.phc_patient': '"स्वास्थ्य तिजोरी मेरे साथ चलती है"',
    'bubble.specialist_doctor': '"त्वरित रोगी तिजोरी पहुंच के लिए क्यूआर स्कैन करें"',
    'bubble.specialist_patient': '"निर्बाध रेफ़रल हैंडऑफ़"',

    // Stats
    'stat.total_patients': 'कुल रोगी',
    'stat.total_referrals': 'कुल रेफ़रल',
    'stat.emergency_cases': 'आपातकालीन मामले',
    'stat.active_referrals': 'सक्रिय रेफ़रल',
    'stat.incoming_referrals': 'आने वाले रेफ़रल',
    'stat.emergency_waiting': 'आपातकालीन प्रतीक्षा',
    'stat.under_treatment': 'इलाज के तहत',
    'stat.completed_handoffs': 'पूरे हुए हैंडऑफ़',

    // Headings & Labels
    'heading.referral_volume': 'रेफ़रल मात्रा — पिछले 7 दिन',
    'heading.priority_mix': 'प्राथमिकता मिश्रण',
    'heading.priority_queue': 'प्राथमिकता कतार',
    'heading.ai_risk_dist': 'एआई जोखिम वितरण',
    'heading.search_placeholder': 'रोगी का नाम, आईडी या मोबाइल खोजें...',
    'heading.patient_directory': 'रोगी निर्देशिका',

    // Buttons & Actions
    'action.upload_report': 'रिपोर्ट अपलोड करें (PDF/Pic)',
    'action.new_referral': 'नया रेफ़रल',
    'action.delete_patient': 'रोगी हटाएं',
    'action.view_queue': 'कतार देखें →',
    'action.view_vault': 'स्वास्थ्य तिजोरी खोलें'
  },
  kn: {
    // Nav Items
    'nav.dashboard': 'ಡೆಶ್‌ಬೋರ್ಡ್',
    'nav.search_patient': 'ರೋಗಿ ಹುಡುಕಿ',
    'nav.register_patient': 'ರೋಗಿ ನೋಂದಣಿ',
    'nav.new_referral': 'ಹೊಸ ರಫರಲ್',
    'nav.referral_log': 'ರಫರಲ್ ಲಾಗ್',
    'nav.scan_qr': 'QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    'nav.referral_queue': 'ರಫರಲ್ ಕ್ಯೂ',
    'nav.profile_settings': 'ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್ಸ್',

    // Dashboard Banner
    'banner.slogan_prefix': 'ಭಾರತದ',
    'banner.slogan_highlight': 'ಆರೋಗ್ಯ, ನಮ್ಮ ಆದ್ಯತೆ.',
    'banner.welcome': 'ಸ್ವಾಗತ',
    'banner.phc_desc': 'ಎಐ ಅಪಾಯ ವರ್ಗೀಕರಣ, ತಕ್ಷಣದ ಕ್ಯೂಆರ್ ರಫರಲ್ ಸ್ಲಿಪ್‌ಗಳು ಮತ್ತು ಸ್ಕ್ಯಾನ್ ಮಾಡಬಹುದಾದ ಎಬಿಡಿಎಂ ಆರೋಗ್ಯ ವಾಲ್ಟ್‌ನೊಂದಿಗೆ ಪ್ರಾಥಮಿಕ ಆರೈಕೆಯನ್ನು ಸಶಕ್ತಗೊಳಿಸುವುದು.',
    'banner.specialist_desc': 'ಬರುವ ಹೆಚ್ಚಿನ ಆದ್ಯತೆಯ ರಫರಲ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, ನಿಮ್ಮ ಡೆಸ್ಕ್‌ನಲ್ಲಿ ಕ್ಯೂಆರ್ ಟೋಕನ್‌ಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಮತ್ತು ಡಿಜಿಟಲ್ ಆರೋಗ್ಯ ವಾಲ್ಟ್ ಪ್ರವೇಶಿಸಿ.',
    'banner.register_patient_btn': '+ ರೋಗಿ ನೋಂದಾಯಿಸಿ',
    'banner.create_referral_btn': '+ ರಫರಲ್ ಸ್ಲಿಪ್ ರಚಿಸಿ',
    'banner.scan_qr_btn': 'QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    'banner.queue_btn': 'ರಫರಲ್ ಕ್ಯೂ',

    // Speech Bubbles
    'bubble.phc_doctor': '"ಎಐ ಅಪಾಯ ವರ್ಗೀಕರಣ & ತಕ್ಷಣದ QR ಹ್ಯಾಂಡ್‌ಆಫ್‌ಗಳು"',
    'bubble.phc_patient': '"ಆರೋಗ್ಯ ವಾಲ್ಟ್ ನನ್ನೊಂದಿಗೆ ಚಲಿಸುತ್ತದೆ"',
    'bubble.specialist_doctor': '"ತಕ್ಷಣದ ಆರೋಗ್ಯ ವಾಲ್ಟ್ ಪ್ರವೇಶಕ್ಕೆ QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ"',
    'bubble.specialist_patient': '"ಸುಲಭ ರಫರಲ್ ಹ್ಯಾಂಡ್‌ಆಫ್‌ಗಳು"',

    // Stats
    'stat.total_patients': 'ಒಟ್ಟು ರೋಗಿಗಳು',
    'stat.total_referrals': 'ಒಟ್ಟು ರಫರಲ್‌ಗಳು',
    'stat.emergency_cases': 'ತುರ್ತು ಪ್ರಕರಣಗಳು',
    'stat.active_referrals': 'ಸಕ್ರಿಯ ರಫರಲ್‌ಗಳು',
    'stat.incoming_referrals': 'ಬರುವ ರಫರಲ್‌ಗಳು',
    'stat.emergency_waiting': 'ತುರ್ತು ಕಾಯುವಿಕೆ',
    'stat.under_treatment': 'ಚಿಕಿತ್ಸೆಯಲ್ಲಿರುವವರು',
    'stat.completed_handoffs': 'ಪೂರ್ಣಗೊಂಡ ಹ್ಯಾಂಡ್‌ಆಫ್‌ಗಳು',

    // Headings & Labels
    'heading.referral_volume': 'ರಫರಲ್ ಪ್ರಮಾಣ — ಕೊನೆಯ 7 ದಿನಗಳು',
    'heading.priority_mix': 'ಆದ್ಯತೆಯ ಮಿಶ್ರಣ',
    'heading.priority_queue': 'ಆದ್ಯತೆಯ ಕ್ಯೂ',
    'heading.ai_risk_dist': 'ಎಐ ಅಪಾಯ ಹಂಚಿಕೆ',
    'heading.search_placeholder': 'ರೋಗಿ ಹೆಸರು, ಐಡಿ ಅಥವಾ ಮೊಬೈಲ್ ಹುಡುಕಿ...',
    'heading.patient_directory': 'ರೋಗಿ ಡೈರೆಕ್ಟರಿ',

    // Buttons & Actions
    'action.upload_report': 'ವರದಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (PDF/Pic)',
    'action.new_referral': 'ಹೊಸ ರಫರಲ್',
    'action.delete_patient': 'ರೋಗಿ ಅಳಿಸಿ',
    'action.view_queue': 'ಕ್ಯೂ ವೀಕ್ಷಿಸಿ →',
    'action.view_vault': 'ಆರೋಗ್ಯ ವಾಲ್ಟ್ ತೆರೆಯಿರಿ'
  },
  mr: {
    // Nav Items
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.search_patient': 'रुग्ण शोधा',
    'nav.register_patient': 'रुग्ण नोंदणी',
    'nav.new_referral': 'नवीन रेफरल',
    'nav.referral_log': 'रेफरल लॉग',
    'nav.scan_qr': 'QR कोड स्कॅन करा',
    'nav.referral_queue': 'रेफरल रांग',
    'nav.profile_settings': 'प्रोफाइल सेटिंग्ज',

    // Dashboard Banner
    'banner.slogan_prefix': 'भारताचे',
    'banner.slogan_highlight': 'आरोग्य, आमचे प्राधान्य.',
    'banner.welcome': 'स्वागत आहे',
    'banner.phc_desc': 'एआय-आधारित जोखीम वर्गीकरण, झटपट क्यूआर रेफरल स्लिप्स आणि स्कॅन करण्यायोग्य एबीडीएम आरोग्य व्हॉल्टसह प्राथमिक काळजी सक्षम करणे.',
    'banner.specialist_desc': 'येणाऱ्या उच्च-प्राधान्य रेफरल्सचे पुनरावलोकन करा, डेस्कवर क्यूआर टोकन स्कॅन करा आणि डिजिटल आरोग्य व्हॉल्ट त्वरित मिळवा.',
    'banner.register_patient_btn': '+ रुग्ण नोंदणी करा',
    'banner.create_referral_btn': '+ रेफरल स्लिप तयार करा',
    'banner.scan_qr_btn': 'QR स्कॅन करा',
    'banner.queue_btn': 'रेफरल रांग पहा',

    // Speech Bubbles
    'bubble.phc_doctor': '"एआय जोखीम वर्गीकरण आणि झटपट क्यूआर हँडऑफ"',
    'bubble.phc_patient': '"आरोग्य व्हॉल्ट माझ्यासोबत प्रवास करते"',
    'bubble.specialist_doctor': '"त्वरित रुग्ण व्हॉल्ट प्रवेशासाठी QR स्कॅन करा"',
    'bubble.specialist_patient': '"अखंड रेफरल हँडऑफ"',

    // Stats
    'stat.total_patients': 'एकूण रुग्ण',
    'stat.total_referrals': 'एकूण रेफरल्स',
    'stat.emergency_cases': 'आणीबाणी प्रकरणे',
    'stat.active_referrals': 'सक्रिय रेफरल्स',
    'stat.incoming_referrals': 'येणारे रेफरल्स',
    'stat.emergency_waiting': 'आणीबाणी प्रतिक्षा',
    'stat.under_treatment': 'उपचाराधीन',
    'stat.completed_handoffs': 'पूर्ण झालेले हँडऑफ',

    // Headings & Labels
    'heading.referral_volume': 'रेफरल प्रमाण — शेवटचे 7 दिवस',
    'heading.priority_mix': 'प्राधान्य मिश्रण',
    'heading.priority_queue': 'प्राधान्य रांग',
    'heading.ai_risk_dist': 'एआय जोखीम वितरण',
    'heading.search_placeholder': 'रुग्णाचे नाव, आयडी किंवा मोबाईल शोधा...',
    'heading.patient_directory': 'रुग्ण निर्देशिका',

    // Buttons & Actions
    'action.upload_report': 'अहवाल अपलोड करा (PDF/Pic)',
    'action.new_referral': 'नवीन रेफरल',
    'action.delete_patient': 'रुग्ण हटवा',
    'action.view_queue': 'रांग पहा →',
    'action.view_vault': 'आरोग्य व्हॉल्ट उघडा'
  }
};

export function t(key: string, lang: Language = 'en'): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  return dict[key] || TRANSLATIONS['en'][key] || key;
}
