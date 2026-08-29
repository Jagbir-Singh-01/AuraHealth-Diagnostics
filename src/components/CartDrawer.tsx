import React from 'react';
import {
  X,
  Trash2,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  FlaskConical,
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, curr) => acc + curr.item.discountPrice, 0);
  const freeThreshold = 800;
  const progressPercent = Math.min(100, (subtotal / freeThreshold) * 100);
  const diffForFree = Math.max(0, freeThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs animate-fade-in flex justify-end">
      <div className="w-full max-w-md bg-white shadow-2xl h-full flex flex-col justify-between border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-brand-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-sm">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-navy">Your Test Cart</h2>
              <p className="text-xs text-slate-500">{cartItems.length} items added</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Free Collection Meter */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-teal" /> Free Home Sample Collection
              </span>
              <span className="font-bold text-brand-navy">
                {diffForFree === 0 ? 'Unlocked 🎉' : `₹${subtotal} / ₹${freeThreshold}`}
              </span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                style={{ width: `${progressPercent}%` }}
                className="bg-brand-500 h-full rounded-full transition-all duration-300"
              />
            </div>

            {diffForFree > 0 ? (
              <p className="text-[11px] text-slate-500">
                Add tests worth <strong className="text-brand-navy">₹{diffForFree}</strong> more to get free doorstep sample collection!
              </p>
            ) : (
              <p className="text-[11px] text-emerald-600 font-semibold">
                You've unlocked 100% Free Doorstep Collection across North India!
              </p>
            )}
          </div>

          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <FlaskConical className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">Your Cart is Empty</div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Explore our popular health checkup packages or individual blood tests to book home sample collection.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((ci) => (
                <div
                  key={ci.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between gap-3 group"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                      {ci.type === 'PACKAGE' ? 'Health Package' : 'Blood Test'}
                    </span>
                    <h4 className="text-xs font-bold text-brand-navy mt-1 truncate">
                      {ci.item.name}
                    </h4>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      ⏳ {ci.item.tatHours}h Report • 🍽️ {ci.item.fastingRequired}
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-sm font-black text-brand-navy">
                        ₹{ci.item.discountPrice}
                      </span>
                      <span className="text-[11px] text-slate-400 line-through">
                        ₹{ci.item.originalPrice}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(ci.id)}
                    className="text-slate-300 hover:text-red-500 p-1 rounded-lg transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Home Collection</span>
                <span>{diffForFree === 0 ? 'FREE' : '₹150'}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-brand-navy">
                <span>Estimated Total</span>
                <span>₹{subtotal + (diffForFree === 0 ? 0 : 150)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-brand-coral to-amber-500 hover:from-brand-coral hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>Schedule Home Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>NABL Certified • 100% Barcoded Safety</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
