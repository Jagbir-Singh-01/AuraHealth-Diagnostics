import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppChatButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppChatButton: React.FC<WhatsAppChatButtonProps> = ({
  phoneNumber = '9814926491',
  defaultMessage = 'Hello AuraHealth! I would like to inquire about booking a diagnostic lab test or health package.',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const internationalNumber = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
  const whatsappUrl = `https://wa.me/${internationalNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <aside 
      aria-label="WhatsApp Support"
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group"
    >
      {/* Tooltip / Prompt popup on hover or desktop preview */}
      <div className="hidden sm:flex items-center gap-2 bg-white text-slate-800 text-xs px-3.5 py-2 rounded-2xl shadow-xl border border-slate-200/90 transition-all duration-300 opacity-95 group-hover:opacity-100 group-hover:-translate-y-0.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-bold text-slate-700">Chat with Lab Support</span>
        <span className="text-[10px] text-slate-400 font-mono">+91 98149 26491</span>
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with AuraHealth"
        className="relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 group/btn"
      >
        {/* Pulsing ring behind button */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400/30 blur-sm group-hover/btn:bg-emerald-400/50 transition"></span>

        {/* WhatsApp Icon */}
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-300 rounded-full border-2 border-emerald-600"></span>
        </div>

        {/* Button Text */}
        <div className="relative flex flex-col text-left">
          <span className="text-xs font-black tracking-wide leading-none">Chat on WhatsApp</span>
          <span className="text-[10px] text-emerald-100 font-medium leading-tight mt-0.5 hidden sm:inline">
            Direct 24x7 Assistance
          </span>
        </div>
      </a>
    </aside>
  );
};
