import React from 'react';
import {
  X,
  Trash2,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Building2,
  Clock,
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

  const subtotal = cartItems.reduce(
    (sum, ci) => sum + (ci.selectedLabOffering?.discountPrice || ci.item.discountPrice),
    0
  );
  const totalOriginal = cartItems.reduce(
    (sum, ci) => sum + (ci.selectedLabOffering?.originalPrice || ci.item.originalPrice),
    0
  );
  const totalSavings = totalOriginal - subtotal;
  const freeCollectionThreshold = 800;
  const isFreeCollection = subtotal >= freeCollectionThreshold;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-navy" />
              <h2 className="text-base font-bold text-brand-navy">Your Diagnostic Cart</h2>
              <span className="text-xs bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {/* Free Home Collection Progress Meter */}
            <div className="bg-brand-50/70 p-3.5 rounded-2xl border border-brand-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
                  {isFreeCollection
                    ? '🎉 Free Home Sample Collection Unlocked!'
                    : `Add ₹${freeCollectionThreshold - subtotal} more for FREE Home Collection`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-teal to-emerald-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (subtotal / freeCollectionThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {cartItems.map((cartItem) => {
              const lab = cartItem.selectedLabOffering;
              const price = lab ? lab.discountPrice : cartItem.item.discountPrice;
              const original = lab ? lab.originalPrice : cartItem.item.originalPrice;

              return (
                <div
                  key={cartItem.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                        {cartItem.type === 'PACKAGE' ? 'Health Package' : 'Pathology Test'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-800 mt-1 leading-snug">
                        {cartItem.item.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => onRemoveItem(cartItem.id)}
                      className="text-slate-400 hover:text-red-500 p-1 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Selected Lab Details */}
                  {lab && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-brand-teal" />
                        <span className="font-bold text-slate-800">{lab.labName}</span>
                      </div>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {lab.tatText}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-400 text-[11px]">
                      {cartItem.item.parametersCount} Parameters
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-brand-navy">₹{price}</span>
                      <span className="text-xs text-slate-400 line-through">₹{original}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {cartItems.length === 0 && (
              <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">Your Cart is Empty</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Type any test name or browse health checkup packages to compare labs and add to cart.
                </p>
              </div>
            )}
          </div>

          {/* Footer with Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Item Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Total Discount Savings:</span>
                  <span>-₹{totalSavings}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Home Sample Collection:</span>
                  <span className={isFreeCollection ? 'text-emerald-600 font-bold' : ''}>
                    {isFreeCollection ? 'FREE' : '₹150'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-brand-navy pt-2 border-t border-slate-200">
                  <span>Pay Directly to Lab Phlebotomist:</span>
                  <span>₹{isFreeCollection ? subtotal : subtotal + 150}</span>
                </div>
                <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg font-bold flex items-center justify-between">
                  <span>✓ ₹0 Advance Platform Fee</span>
                  <span>Pay on Home Collection (UPI/Cash)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3 bg-gradient-to-r from-brand-coral to-amber-500 hover:from-brand-coral hover:to-amber-600 text-white font-black text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Select Fasting Slot &amp; Request Booking</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
