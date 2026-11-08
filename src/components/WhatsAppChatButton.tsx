import React, { useState } from 'react';
import { MessageCircle, Bot, Sparkles, X, ChevronUp } from 'lucide-react';

interface WhatsAppChatButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
  isAiChatOpen: boolean;
  onToggleAiChat: () => void;
}

export const WhatsAppChatButton: React.FC<WhatsAppChatButtonProps> = ({
  phoneNumber = '9814926491',
  defaultMessage = 'Hello AuraHealth! I would like to inquire about booking a diagnostic lab test or health package.',
  isAiChatOpen,
  onToggleAiChat,
}) => {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const internationalNumber = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
  const whatsappUrl = `https://wa.me/${internationalNumber}?text=${encodeURIComponent(defaultMessage)}`;

  if (isAiChatOpen) {
    // Hide floating button while modal is open on mobile to prevent overlapping
    return null;
  }

  return (
    <aside
      aria-label="Free AI Assistant & WhatsApp Support"
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 font-sans"
    >
      {/* Top Floating Prompt Preview */}
      <div className="hidden sm:flex items-center gap-2 bg-white text-slate-800 text-xs px-3.5 py-2 rounded-2xl shadow-xl border border-slate-200/90 transition-all duration-300 hover:shadow-2xl">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-bold text-slate-800">Free AI Health Assistant</span>
        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          24x7 Active
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Direct WhatsApp Quick Shortcut */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Direct WhatsApp chat (+91 98149 26491)"
          className="hidden xs:flex p-3 bg-white hover:bg-emerald-50 text-emerald-600 rounded-full shadow-lg border border-slate-200/90 hover:border-emerald-300 transition-all duration-200 hover:scale-105 group"
          aria-label="Direct WhatsApp Link"
        >
          <MessageCircle className="w-5 h-5 fill-emerald-500 text-emerald-500 group-hover:scale-110 transition-transform" />
        </a>

        {/* Main Floating Trigger: Opens Free AI Chatbot */}
        <button
          onClick={onToggleAiChat}
          aria-label="Open Free AI Health Chatbot"
          className="relative flex items-center gap-3 bg-gradient-to-r from-brand-navy via-brand-darkBlue to-emerald-700 hover:from-brand-darkBlue hover:to-emerald-600 text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 group"
        >
          {/* Subtle glowing animated backdrop */}
          <span className="absolute -inset-1 rounded-full bg-emerald-400/25 blur-sm group-hover:bg-emerald-400/40 transition"></span>

          {/* Double Icon Badge: Bot + WhatsApp */}
          <div className="relative flex items-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-teal to-emerald-400 text-slate-900 flex items-center justify-center font-bold shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-brand-navy flex items-center justify-center">
              <MessageCircle className="w-2.5 h-2.5 text-white fill-white" />
            </div>
          </div>

          {/* Text Labels */}
          <div className="relative flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-wide leading-none">Free AI Health Chat</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-900">
                New
              </span>
            </div>
            <span className="text-[10px] text-emerald-200 font-medium leading-tight mt-0.5 hidden sm:inline">
              Symptom Advice · WhatsApp +91 98149 26491
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};
