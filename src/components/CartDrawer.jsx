import React from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const handleWhatsAppOrder = () => {
    let orderText = `Hello Tisha Restro, I would like to place an order:\n\n`;
    items.forEach((item, idx) => {
      const spiceTag = item.customSpice === 0 ? 'Mild' : item.customSpice === 1 ? 'Royal' : 'Heritage Heat';
      orderText += `${idx + 1}. ${item.quantity}x ${item.name} (${spiceTag}) — $${item.price * item.quantity}\n`;
    });
    orderText += `\nSubtotal: $${subtotal}\nTax: $${tax}\nEstimated Total: $${total}\n\nPlease confirm availability and delivery/table seating details.`;

    window.open(`https://wa.me/917008665245?text=${encodeURIComponent(orderText)}`, '_blank');
  };

  return (
    <div className="drawer-backdrop">
      <div className="w-full max-w-md h-full bg-[#14100e] border-l border-[var(--border-brass)] flex flex-col justify-between shadow-[0_0_60px_rgba(0,0,0,0.9)]">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[var(--brass-400)]" />
            <h3 className="font-display text-xl text-[var(--ivory-50)]">Your Table Order</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(197,155,39,0.15)] text-[var(--brass-300)] font-mono">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-[var(--border-subtle)] text-[var(--ivory-muted)] hover:text-white"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <ShoppingBag className="w-12 h-12 text-[var(--ivory-muted)] stroke-1 mb-3 opacity-40" />
              <h4 className="font-display text-lg text-[var(--ivory-200)] mb-1">
                Your order is currently empty
              </h4>
              <p className="text-xs text-[var(--ivory-muted)] font-editorial italic max-w-xs mb-6">
                Explore our Awadhi Dum Biryani, Smoked Butter Chicken, and craft cocktails to begin.
              </p>
              <button
                onClick={onClose}
                className="btn-outline-brass text-xs !py-2.5 !px-6"
              >
                <span>Browse Menu</span>
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[rgba(18,15,13,0.7)] flex gap-4 items-center justify-between"
              >
                <div className="w-14 h-14 rounded overflow-hidden shrink-0 border border-[var(--border-subtle)]">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h5 className="font-display text-sm text-[var(--ivory-50)] truncate">
                    {item.name}
                  </h5>
                  <span className="text-xs text-[var(--brass-300)] font-mono block">
                    ${item.price} × {item.quantity} = ${item.price * item.quantity}
                  </span>
                  <span className="text-[0.68rem] text-[var(--ivory-muted)] font-editorial italic">
                    Spice: {item.customSpice === 0 ? 'Mild' : item.customSpice === 1 ? 'Royal' : 'Heritage'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 rounded border border-[var(--border-subtle)] flex items-center justify-center text-xs hover:border-[var(--brass-500)] text-[var(--ivory-300)]"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-mono text-white w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded border border-[var(--border-subtle)] flex items-center justify-center text-xs hover:border-[var(--brass-500)] text-[var(--ivory-300)]"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="ml-1 p-1 text-[var(--ivory-muted)] hover:text-red-400"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[var(--border-subtle)] bg-[rgba(20,16,13,0.95)] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[var(--ivory-300)]">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[var(--ivory-muted)]">
                <span>Service & State Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[var(--ivory-50)] pt-2 border-t border-[var(--border-subtle)] font-display">
                <span>Estimated Total</span>
                <span className="text-[var(--brass-300)]">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleWhatsAppOrder}
                className="btn-brass-primary w-full !py-3 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-black" />
                <span>Send Order via WhatsApp</span>
              </button>

              <button
                onClick={onClearCart}
                className="w-full text-center text-[0.68rem] uppercase tracking-wider text-[var(--ivory-muted)] hover:text-white pt-1"
              >
                Clear Entire Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
