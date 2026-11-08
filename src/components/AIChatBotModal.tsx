import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  X,
  MessageCircle,
  Stethoscope,
  Clock,
  ShieldCheck,
  Building2,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
  recommendedTests?: {
    name: string;
    reason: string;
    fasting: string;
    estPrice: string;
  }[];
  whatsAppPrompt?: string;
}

interface AIChatBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity?: string;
  phoneNumber?: string;
}

const QUICK_SUGGESTIONS = [
  '🩺 Which tests for fatigue & hair fall?',
  '⏱️ Fasting rules for lipid & sugar tests',
  '💰 Compare Agilus vs Dr Lal prices',
  '🫁 Smog & winter lung test panel',
  '👤 Full Body Checkup recommendations',
  '💬 Chat directly on WhatsApp (+91 98149 26491)'
];

export const AIChatBotModal: React.FC<AIChatBotModalProps> = ({
  isOpen,
  onClose,
  selectedCity = 'North India',
  phoneNumber = '9814926491',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello! 👋 I am **AuraBot**, your 24x7 Free AI Health & Diagnostic Assistant for North India.\n\nI can analyze your symptoms to recommend exact blood tests, explain fasting requirements, compare NABL lab prices, or connect you directly with our medical team on WhatsApp.`,
      timestamp: 'Just now',
      suggestions: [
        'Which tests for fatigue & weakness?',
        'Do I need fasting for Lipid Profile?',
        'Compare lab brands & prices',
        'Book test for winter smog cough'
      ]
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const internationalNumber = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;

  const createWhatsAppUrl = (customText?: string) => {
    const defaultText = customText 
      ? `Hello AuraHealth! I was consulting AuraBot on your website. My inquiry:\n"${customText}"\nPlease help me book/confirm this with the lab.`
      : `Hello AuraHealth! I would like to inquire about booking a diagnostic lab test in ${selectedCity}.`;
    return `https://wa.me/${internationalNumber}?text=${encodeURIComponent(defaultText)}`;
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getAIResponse = (userQuery: string): Omit<ChatMessage, 'id' | 'timestamp' | 'sender'> => {
    const q = userQuery.toLowerCase();

    // 1. Fatigue / Tiredness / Hair fall / Weakness
    if (q.includes('fatigue') || q.includes('tired') || q.includes('hair') || q.includes('weak') || q.includes('energy')) {
      return {
        text: `Persistent fatigue, low energy, and hair fall in North India are most commonly linked to **Vitamin D3 & B12 deficiencies**, **Iron/Ferritin deficiency**, or **Thyroid dysfunction**. Here is what doctors recommend testing:`,
        recommendedTests: [
          {
            name: 'Vitamin D3 & B12 Combo',
            reason: 'Crucial for bone density, cellular energy, nerve health, and hair follicles.',
            fasting: 'Non-Fasting (Anytime)',
            estPrice: '₹899 (Thyrocare / Agilus)'
          },
          {
            name: 'Complete Blood Count (CBC) + Ferritin',
            reason: 'Screens for Iron Deficiency Anemia, hemoglobin level, and red blood cell indices.',
            fasting: 'Non-Fasting',
            estPrice: '₹299 - ₹450'
          },
          {
            name: 'Thyroid Profile (TSH, FT3, FT4)',
            reason: 'Evaluates sluggish metabolism or Hypothyroidism which causes hair thinning and extreme exhaustion.',
            fasting: 'Overnight Fasting Preferred (Morning slot)',
            estPrice: '₹349 - ₹499'
          }
        ],
        whatsAppPrompt: `I need to book fatigue/hair fall tests (Vitamin D, B12, Thyroid, CBC) in ${selectedCity}.`,
        suggestions: [
          'What are the fasting rules for thyroid?',
          'Can a phlebotomist come to my home tomorrow?',
          'Book these tests on WhatsApp'
        ]
      };
    }

    // 2. Fasting / Food / Preparation rules
    if (q.includes('fasting') || q.includes('food') || q.includes('eat') || q.includes('water') || q.includes('preparation') || q.includes('breakfast')) {
      return {
        text: `Here are the official medical fasting guidelines for diagnostic blood tests:\n\n` +
          `• **Tests Requiring Fasting (10 to 12 Hours overnight):**\n` +
          `  - **Lipid Profile** (Cholesterol, Triglycerides, HDL, LDL)\n` +
          `  - **Fasting Blood Glucose (FBS)**\n` +
          `  - **Complete Metabolic / Comprehensive Full Body Profiles**\n\n` +
          `• **Water Rule:** Plain water is **fully permitted and encouraged** to keep veins hydrated for an easy blood draw.\n` +
          `• **Non-Fasting Tests (Can be taken anytime during the day):**\n` +
          `  - **HbA1c** (3-Month Sugar Avg) — *No fasting required!*\n` +
          `  - **Complete Blood Count (CBC)**\n` +
          `  - **Vitamin D3 & B12**\n` +
          `  - **Liver Function (LFT) & Kidney Function (KFT)** alone.`,
        whatsAppPrompt: `I want to check fasting slot availability for home collection in ${selectedCity}.`,
        suggestions: [
          'What time do phlebotomists arrive?',
          'Which lab provides fastest report?',
          'Ask operations team on WhatsApp'
        ]
      };
    }

    // 3. Smog / Pollution / Cough / Winter AQI
    if (q.includes('smog') || q.includes('pollution') || q.includes('aqi') || q.includes('cough') || q.includes('breath') || q.includes('chest') || q.includes('lung')) {
      return {
        text: `With high winter AQI and PM2.5 levels across Delhi-NCR and Northern India, toxic particulate matter inflames the airways and triggers systemic cardiac/pulmonary stress. We recommend the **Winter Smog & Respiratory Health Panel**:`,
        recommendedTests: [
          {
            name: 'High Sensitivity CRP (hs-CRP)',
            reason: 'Detects micro-vascular inflammation caused by inhaled PM2.5 particulates.',
            fasting: 'Non-Fasting',
            estPrice: '₹440 (Dr Lal / Agilus)'
          },
          {
            name: 'Complete Blood Count (CBC) with Absolute Eosinophil Count (AEC)',
            reason: 'Measures bronchial allergy, eosinophilia, and infection resistance.',
            fasting: 'Non-Fasting',
            estPrice: '₹299'
          },
          {
            name: 'Winter Smog Advanced Panel (Max Lab / Agilus)',
            reason: 'Includes Lung allergy markers, hs-CRP, CBC, Vitamin D, and Total IgE antibodies.',
            fasting: '8-10 Hours Fasting',
            estPrice: '₹1,299 (Discounted 55%)'
          }
        ],
        whatsAppPrompt: `I want to book the Winter Smog & Respiratory Panel in ${selectedCity}.`,
        suggestions: [
          'Can I consult an AIIMS Pulmonologist on video?',
          'Compare prices between Max Lab and Dr Lal',
          'Book on WhatsApp now'
        ]
      };
    }

    // 4. Lab Comparison (Agilus, Dr Lal, Thyrocare, Max, etc.)
    if (q.includes('compare') || q.includes('agilus') || q.includes('lal') || q.includes('thyrocare') || q.includes('max') || q.includes('redcliffe') || q.includes('apollo') || q.includes('difference')) {
      return {
        text: `Here is a transparent comparison of our certified NABL & CAP partner laboratories:\n\n` +
          `1. **Agilus Diagnostics (SRL)**: CAP & NABL accredited national reference lab. Best for specialized oncology, hormone panels, and express home visits (45 min arrival in NCR).\n` +
          `2. **Dr. Lal PathLabs**: India’s gold standard pathology brand since 1949. Highest reliability, widespread local collection centers, and same-day 6-hour report delivery.\n` +
          `3. **Thyrocare Technologies**: Fully automated mega-lab in Navi Mumbai. **Lowest price leader** for large thyroid and preventative packages (60-80 parameters).\n` +
          `4. **Max Lab**: Hospital-grade precision backed by Max Super Speciality Doctors. Excellent for cardiac risk and diabetic complications.\n\n` +
          `*Note: On AuraHealth, you pay ₹0 advance fee. You pay directly to your chosen lab upon sample collection!*`,
        whatsAppPrompt: `Please help me compare test prices for my prescription between Agilus, Dr Lal, and Thyrocare.`,
        suggestions: [
          'Which lab is best for CBC and Sugar?',
          'What is the price of Full Body Checkup?',
          'Send prescription to WhatsApp'
        ]
      };
    }

    // 5. Diabetes / Sugar / HbA1c
    if (q.includes('diabetes') || q.includes('sugar') || q.includes('hba1c') || q.includes('glucose') || q.includes('insulin')) {
      return {
        text: `For diabetes screening and routine monitoring, doctors in North India recommend the following core tests:`,
        recommendedTests: [
          {
            name: 'HbA1c (Glycated Hemoglobin)',
            reason: 'Measures your average 3-month blood sugar without daily fluctuation bias. Gold standard for diabetic control.',
            fasting: 'NO Fasting required',
            estPrice: '₹349 - ₹480'
          },
          {
            name: 'Fasting Blood Sugar (FBS) + PPBS Combo',
            reason: 'Fasting glucose and 2-hour post-meal glucose to check immediate insulin response.',
            fasting: '10-12 Hrs Fasting for FBS; Exactly 2 hrs post-food for PPBS',
            estPrice: '₹180 - ₹280'
          },
          {
            name: 'Diabetic Health Profile (Agilus / Dr Lal)',
            reason: 'Includes HbA1c, Average Blood Glucose, Urine Microalbumin, Lipid Profile, and Kidney Function.',
            fasting: '10-12 Hrs Overnight Fasting',
            estPrice: '₹1,199 (Save 48%)'
          }
        ],
        whatsAppPrompt: `I want to book a Diabetic Profile / HbA1c in ${selectedCity}.`,
        suggestions: [
          'Can I eat before HbA1c test?',
          'How does home collection work?',
          'Chat on WhatsApp (+91 98149 26491)'
        ]
      };
    }

    // 6. Full Body Packages / Whole body checkup
    if (q.includes('full body') || q.includes('whole body') || q.includes('package') || q.includes('routine') || q.includes('annual')) {
      return {
        text: `Our preventative Full Body Packages cover all vital organs with certified NABL test protocols:\n\n` +
          `• **Basic Health Checkup (45+ Tests)**: CBC, Lipid Profile, Liver Function, Kidney Function, Fasting Sugar — **From ₹799**.\n` +
          `• **Comprehensive Active Wellness (75+ Tests)**: Adds Vitamin D3, Vitamin B12, Thyroid (TSH), hs-CRP, Iron Profile, Urine Routine — **From ₹1,499**.\n` +
          `• **Senior Citizen Executive Panel (85+ Tests)**: Adds Cardiac Troponin/hs-CRP, Bone Minerals, Glycated HbA1c, and Free Doctor Video Review — **From ₹2,499**.\n\n` +
          `All packages include **Free Home Sample Collection** in ${selectedCity}.`,
        whatsAppPrompt: `I would like to book a Comprehensive Full Body Checkup in ${selectedCity}.`,
        suggestions: [
          'Do I need fasting for Full Body Package?',
          'Can my parents take this test together?',
          'Book on WhatsApp now'
        ]
      };
    }

    // 7. Doctor Teleconsultation / Second Opinion
    if (q.includes('doctor') || q.includes('consult') || q.includes('aiims') || q.includes('video') || q.includes('report review') || q.includes('prescription')) {
      return {
        text: `Yes! AuraHealth provides direct access to senior specialists from **AIIMS New Delhi, PGIMER Chandigarh, and Medanta** for instant 10-15 minute HD video report reviews and medical advice.\n\n` +
          `• **Free 10-Minute Report Review** when you book tests through AuraHealth.\n` +
          `• Digital NMC-verified e-prescription sent straight to your WhatsApp.\n` +
          `• Specialists available in Pulmonology, Diabetology, Cardiology, and General Medicine.`,
        whatsAppPrompt: `I want to schedule a Doctor Video Consultation to review my diagnostic reports.`,
        suggestions: [
          'How do I send my old reports?',
          'Book doctor consult on WhatsApp',
          'Which tests do I need before consult?'
        ]
      };
    }

    // 8. Direct WhatsApp request
    if (q.includes('whatsapp') || q.includes('phone') || q.includes('call') || q.includes('human') || q.includes('agent') || q.includes('contact') || q.includes('98149')) {
      return {
        text: `You can chat directly with our Operations & Medical Care Coordinator on WhatsApp at **+91 98149 26491**.\n\nOur team can help you:\n` +
          `✓ Book home sample collection slot for tomorrow morning\n` +
          `✓ Check prescription test codes with labs\n` +
          `✓ Dispatch Phlebotomist tracking details & official Lab Tokens`,
        whatsAppPrompt: `Hello AuraHealth, I would like to speak directly with an operations coordinator.`,
        suggestions: [
          'Tap here to open WhatsApp',
          'What tests for high cholesterol?',
          'Fasting rules for blood test'
        ]
      };
    }

    // Default Fallback
    return {
      text: `Thank you for asking! I can assist you with:\n\n` +
        `1. **Symptom Assessment**: Tell me what you are feeling (e.g., fatigue, cough, joint pain, hair fall).\n` +
        `2. **Fasting & Preparation**: Ask if any test requires empty stomach or water fasting.\n` +
        `3. **Lab Pricing & Speed**: Compare Agilus, Dr. Lal PathLabs, Thyrocare, and Max Lab.\n` +
        `4. **Doorstep Booking**: Get a certified phlebotomist at your home in ${selectedCity}.\n\n` +
        `Or click the button below to transfer this conversation straight to our WhatsApp team!`,
      whatsAppPrompt: `Hello AuraHealth! I need diagnostic assistance regarding: "${userQuery}".`,
      suggestions: [
        'Which tests for fatigue & weakness?',
        'Fasting rules for lipid & sugar tests',
        'Compare Agilus vs Dr Lal prices',
        'Chat with human team on WhatsApp'
      ]
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Realistic AI thinking delay
    setTimeout(() => {
      const aiReply = getAIResponse(query);
      const botMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedTests: aiReply.recommendedTests,
        suggestions: aiReply.suggestions,
        whatsAppPrompt: aiReply.whatsAppPrompt
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: `Conversation restarted! How can I help you today with your medical lab tests, fasting rules, or multi-lab pricing in ${selectedCity}?`,
        timestamp: 'Just now',
        suggestions: [
          'Which tests for fatigue & weakness?',
          'Fasting rules for lipid & sugar tests',
          'Compare Agilus vs Dr Lal prices',
          'Chat on WhatsApp (+91 98149 26491)'
        ]
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col sm:w-[420px] sm:h-[640px] max-h-screen sm:rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-fade-in font-sans">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-brand-navy via-brand-darkBlue to-brand-800 text-white p-4 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-teal to-emerald-400 flex items-center justify-center text-brand-navy shadow-inner">
              <Bot className="w-6 h-6 text-slate-900" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-brand-navy"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-tight text-white">AuraBot AI</span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Free 24x7
              </span>
            </div>
            <p className="text-[11px] text-slate-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Online · Diagnostics &amp; Fasting Guide</span>
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleResetChat}
            title="Restart Chat"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <a
            href={createWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            title="Skip directly to WhatsApp"
            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold transition shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span className="hidden xs:inline">WhatsApp</span>
          </a>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Trust Notice Bar */}
      <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-2 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-teal shrink-0" />
          <span>NABL &amp; ICMR protocol compliant AI suggestions</span>
        </span>
        <span className="text-slate-400 font-mono text-[10px]">{selectedCity}</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-brand-navy text-white rounded-br-xs font-medium'
                  : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80'
              }`}
            >
              {/* Message text with basic Markdown handling */}
              <div className="space-y-1.5 whitespace-pre-line">
                {msg.text.split('\n\n').map((para, i) => (
                  <p key={i}>
                    {para.split('**').map((segment, j) =>
                      j % 2 === 1 ? (
                        <strong key={j} className={msg.sender === 'user' ? 'text-brand-300' : 'text-brand-navy font-bold'}>
                          {segment}
                        </strong>
                      ) : (
                        segment
                      )
                    )}
                  </p>
                ))}
              </div>

              {/* Recommended Tests Cards (if present) */}
              {msg.recommendedTests && msg.recommendedTests.length > 0 && (
                <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Stethoscope className="w-3 h-3 text-brand-teal" />
                    <span>Recommended Tests:</span>
                  </div>

                  {msg.recommendedTests.map((test, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1 text-slate-700 hover:border-brand-500/40 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 text-xs">{test.name}</span>
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {test.estPrice}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{test.reason}</p>
                      <div className="flex items-center gap-2 pt-0.5 text-[10px]">
                        <span className="text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          ⏱️ {test.fasting}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Seamless WhatsApp Action inside message */}
              {msg.sender === 'ai' && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">Want to book these tests?</span>
                  <a
                    href={createWhatsAppUrl(msg.whatsAppPrompt || msg.text.slice(0, 150))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold transition shadow-xs shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>Book on WhatsApp</span>
                  </a>
                </div>
              )}
            </div>

            {/* Time label */}
            <span className="text-[9px] text-slate-400 px-1 mt-1">{msg.timestamp}</span>

            {/* Follow-up Suggestion Chips */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                {msg.suggestions.map((sug, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => {
                      if (sug.toLowerCase().includes('whatsapp')) {
                        window.open(createWhatsAppUrl(msg.text.slice(0, 100)), '_blank');
                      } else {
                        handleSend(sug);
                      }
                    }}
                    className="text-[11px] bg-white hover:bg-brand-50 text-slate-700 hover:text-brand-navy border border-slate-200 rounded-full px-2.5 py-1 font-medium transition shadow-2xs text-left"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-white p-3 rounded-2xl w-28 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-brand-teal animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-brand-teal animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 rounded-full bg-brand-teal animate-bounce [animation-delay:0.4s]"></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar & WhatsApp Handoff Bar */}
      <div className="p-3 bg-white border-t border-slate-200 space-y-2 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask symptoms, test name, or fasting rules..."
            className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 placeholder-slate-400"
          />

          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-2.5 bg-brand-navy hover:bg-brand-darkBlue text-white rounded-2xl transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Global One-Tap WhatsApp Transfer Button */}
        <a
          href={createWhatsAppUrl(inputValue || 'Diagnostic booking assistance inquiry')}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Chat with Lab Operations on WhatsApp (+91 98149 26491)</span>
        </a>
      </div>
    </div>
  );
};
