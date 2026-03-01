import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, CreditCard, Smartphone, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getCategoryGradient } from '@/data/items';

const Checkout = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user, addBooking } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);

  if (!user) { navigate('/'); return null; }

  const handlePayment = () => {
    if (cart.length === 0) return;
    setProcessing(true);
    setTimeout(() => {
      cart.forEach(c => addBooking({ item: c.item, quantity: c.quantity, totalPrice: c.item.price * c.quantity, paymentMethod }));
      clearCart();
      navigate('/booking-success');
    }, 1500);
  };

  const paymentMethods = [
    { key: 'upi', label: 'UPI', icon: Smartphone, desc: 'GPay, PhonePe, Paytm' },
    { key: 'card', label: 'Card', icon: CreditCard, desc: 'Debit / Credit Card' },
    { key: 'netbanking', label: 'Net Banking', icon: Building, desc: 'All major banks' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display font-bold text-xl text-foreground">Checkout</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
            <Button onClick={() => navigate('/dashboard')} className="brand-gradient text-primary-foreground border-0">Browse Events</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <h3 className="font-display font-bold text-lg text-foreground mb-2">Your Tickets</h3>
              {cart.map(c => (
                <div key={c.item.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 animate-fade-in">
                  <div className={`w-14 h-14 rounded-lg ${getCategoryGradient(c.item.category)} flex items-center justify-center shrink-0`}>
                    <span className="text-primary-foreground font-display font-bold text-lg">{c.item.title[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground truncate">{c.item.title}</h4>
                    <p className="text-xs text-muted-foreground">{c.item.date} • {c.item.location}</p>
                    <p className="text-sm font-bold text-primary mt-1">₹{c.item.price} × {c.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-secondary rounded-lg">
                      <button onClick={() => updateQuantity(c.item.id, c.quantity - 1)} className="p-1.5 text-muted-foreground hover:text-foreground"><Minus className="h-3 w-3" /></button>
                      <span className="text-sm font-semibold text-foreground w-6 text-center">{c.quantity}</span>
                      <button onClick={() => updateQuantity(c.item.id, c.quantity + 1)} className="p-1.5 text-muted-foreground hover:text-foreground"><Plus className="h-3 w-3" /></button>
                    </div>
                    <button onClick={() => removeFromCart(c.item.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}

              {/* Payment Method */}
              <h3 className="font-display font-bold text-lg text-foreground mt-6 mb-2">Payment Method</h3>
              <div className="space-y-2">
                {paymentMethods.map(pm => (
                  <button key={pm.key} onClick={() => setPaymentMethod(pm.key)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-colors ${paymentMethod === pm.key ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-secondary'}`}>
                    <pm.icon className={`h-5 w-5 ${paymentMethod === pm.key ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="text-left">
                      <p className="font-medium text-sm text-foreground">{pm.label}</p>
                      <p className="text-xs text-muted-foreground">{pm.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="bg-card border border-border rounded-xl p-5 sticky top-4">
                <h3 className="font-display font-bold text-lg text-foreground mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  {cart.map(c => (
                    <div key={c.item.id} className="flex justify-between text-muted-foreground">
                      <span className="truncate mr-2">{c.item.title} ×{c.quantity}</span>
                      <span className="text-foreground font-medium">₹{(c.item.price * c.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold text-foreground">
                    <span>Total</span>
                    <span className="text-primary text-lg">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <Button onClick={handlePayment} disabled={processing} className="w-full mt-4 brand-gradient text-primary-foreground border-0 py-6 text-base font-semibold">
                  {processing ? 'Processing...' : `Pay ₹${totalPrice.toLocaleString()}`}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
