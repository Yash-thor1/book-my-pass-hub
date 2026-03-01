import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, ArrowLeft, Plus, Minus, ShoppingCart, Tag, Users, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { allItems, getCategoryGradient } from '@/data/items';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ItemCard from '@/components/ItemCard';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('about');

  const item = allItems.find(i => i.id === id);
  if (!item) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Item not found</div>;

  const similarItems = allItems.filter(i => i.id !== item.id && (i.category === item.category || i.genre === item.genre)).slice(0, 6);
  const bundleItems = [
    { name: 'Popcorn + Drink Combo', price: 299, emoji: '🍿' },
    { name: 'Parking Pass', price: 150, emoji: '🅿️' },
    { name: 'Merchandise Pack', price: 499, emoji: '🎁' },
  ];

  const tabs = [
    { key: 'about', label: 'About' },
    { key: 'offers', label: 'Top Offers' },
    ...(item.cast && item.cast.length > 0 ? [{ key: 'cast', label: 'Cast & Crew' }] : []),
    { key: 'reviews', label: 'Reviews' },
    { key: 'similar', label: 'You Might Also Like' },
  ];

  const handleBookNow = () => {
    if (!user) { navigate('/'); return; }
    addToCart(item, quantity);
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    if (!user) { navigate('/'); return; }
    addToCart(item, quantity);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className={`relative h-72 md:h-96 ${getCategoryGradient(item.category)}`}>
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-background/20 backdrop-blur flex items-center justify-center text-primary-foreground hover:bg-background/30 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl font-display font-black text-primary-foreground/20">{item.title[0]}</span>
        </div>
        <div className="hero-overlay absolute inset-0 flex items-end p-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/90 text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">{item.genre}</span>
              <span className="flex items-center gap-1 text-primary-foreground/90 text-sm"><Star className="h-4 w-4 fill-accent text-accent" /> {item.rating}/5</span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-primary-foreground">{item.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-primary-foreground/70 text-sm">
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{item.duration}</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{item.location}</span>
              <span>{item.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Bar */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <span className="font-display font-bold text-2xl text-primary">₹{item.price}</span>
            <span className="text-muted-foreground text-sm ml-1">per ticket</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-secondary rounded-lg px-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1.5 text-muted-foreground hover:text-foreground"><Minus className="h-4 w-4" /></button>
              <span className="font-semibold text-foreground w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-1.5 text-muted-foreground hover:text-foreground"><Plus className="h-4 w-4" /></button>
            </div>
            <Button onClick={handleAddToCart} variant="outline" size="sm"><ShoppingCart className="h-4 w-4 mr-1" /> Add</Button>
            <Button onClick={handleBookNow} className="brand-gradient text-primary-foreground border-0">Book Now</Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-border mb-6">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'about' && (
            <div>
              <h3 className="font-display font-bold text-xl text-foreground mb-3">About</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-semibold text-foreground">{item.date}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold text-foreground">{item.duration}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-semibold text-foreground">{item.location}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">Genre</p>
                  <p className="font-semibold text-foreground">{item.genre}</p>
                </div>
              </div>

              {/* Bundle Offers */}
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <h4 className="font-display font-bold text-lg text-foreground">Bundle & Save</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {bundleItems.map(b => (
                    <div key={b.name} className="bg-card border border-border rounded-lg p-4 flex items-center gap-3 card-elevated cursor-pointer">
                      <span className="text-2xl">{b.emoji}</span>
                      <div>
                        <p className="font-medium text-sm text-foreground">{b.name}</p>
                        <p className="text-xs text-accent font-semibold">+₹{b.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'offers' && (
            <div>
              <h3 className="font-display font-bold text-xl text-foreground mb-3">Top Offers For You</h3>
              {item.offers && item.offers.length > 0 ? (
                <div className="space-y-3">
                  {item.offers.map((offer, i) => (
                    <div key={i} className="flex items-center gap-3 bg-accent/10 border border-accent/20 rounded-lg p-4">
                      <Tag className="h-5 w-5 text-accent shrink-0" />
                      <p className="text-sm text-foreground">{offer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No special offers available right now.</p>
              )}
            </div>
          )}

          {activeTab === 'cast' && (
            <div>
              <h3 className="font-display font-bold text-xl text-foreground mb-3">Cast & Crew</h3>
              <div className="flex flex-wrap gap-4">
                {item.cast?.map(member => (
                  <div key={member} className="flex items-center gap-3 bg-card border border-border rounded-lg p-3 pr-5">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-sm text-foreground">{member}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="font-display font-bold text-xl text-foreground mb-3">Top Reviews</h3>
              {item.reviews && item.reviews.length > 0 ? (
                <div className="space-y-4">
                  {item.reviews.map((review, i) => (
                    <div key={i} className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                          <span className="text-sm font-medium text-foreground">{review.user[0]}</span>
                        </div>
                        <span className="font-medium text-sm text-foreground">{review.user}</span>
                        <div className="flex items-center gap-0.5 ml-auto">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`h-3.5 w-3.5 ${j < review.rating ? 'fill-accent text-accent' : 'text-muted'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-10 w-10 text-muted mx-auto mb-2" />
                  <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'similar' && (
            <div>
              <h3 className="font-display font-bold text-xl text-foreground mb-3">You Might Also Like</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {similarItems.map(si => <ItemCard key={si.id} item={si} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
