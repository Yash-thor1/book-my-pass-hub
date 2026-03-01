import { useState, useMemo } from 'react';
import { Film, Calendar, Trophy, Bike, Gift, Percent, Sparkles, TrendingUp, Flame, Users } from 'lucide-react';
import Header from '@/components/Header';
import ItemCard from '@/components/ItemCard';
import { allItems, getItemsByCategory, Item } from '@/data/items';
import { useAuth } from '@/context/AuthContext';
import heroBanner from '@/assets/hero-banner.jpg';

const categories = [
  { key: 'all', label: 'All', icon: TrendingUp },
  { key: 'movies', label: 'Movies', icon: Film },
  { key: 'events', label: 'Events', icon: Calendar },
  { key: 'sports', label: 'Sports', icon: Trophy },
  { key: 'activities', label: 'Activities', icon: Bike },
];

const rightTabs = [
  { key: 'offers', label: 'Offers', icon: Percent },
  { key: 'giftcards', label: 'Gift Cards', icon: Gift },
];

const genres = ['All', 'Action', 'Comedy', 'Drama', 'Horror Comedy', 'Concert', 'Cricket', 'Adventure', 'Workshop', 'Festival', 'Stand-up Comedy'];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Mumbai');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeGenre, setActiveGenre] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const { user, bookings } = useAuth();

  const filteredItems = useMemo(() => {
    let items: Item[];
    if (activeCategory === 'offers') {
      items = allItems.filter(i => i.offers && i.offers.length > 0);
    } else if (activeCategory === 'giftcards') {
      return [];
    } else {
      items = activeCategory === 'all' ? allItems : getItemsByCategory(activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(q) || i.genre.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }

    if (activeGenre !== 'All') items = items.filter(i => i.genre === activeGenre);

    switch (sortBy) {
      case 'price-low': items = [...items].sort((a, b) => a.price - b.price); break;
      case 'price-high': items = [...items].sort((a, b) => b.price - a.price); break;
      case 'rating': items = [...items].sort((a, b) => b.rating - a.rating); break;
      default: items = [...items].sort((a, b) => b.rating - a.rating);
    }

    return items;
  }, [activeCategory, searchQuery, activeGenre, sortBy]);

  const recommendations = useMemo(() => {
    if (!user || bookings.length === 0) return allItems.slice(0, 6);
    const bookedCategories = [...new Set(bookings.map(b => b.item.category))];
    const bookedGenres = [...new Set(bookings.map(b => b.item.genre))];
    const bookedIds = new Set(bookings.map(b => b.item.id));
    let recs = allItems.filter(i => !bookedIds.has(i.id) && (bookedCategories.includes(i.category) || bookedGenres.includes(i.genre)));
    if (recs.length < 6) recs = [...recs, ...allItems.filter(i => !bookedIds.has(i.id) && !recs.includes(i))];
    return recs.slice(0, 6);
  }, [user, bookings]);

  const bookingStreak = bookings.length;

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} selectedLocation={selectedLocation} onLocationChange={setSelectedLocation} />

      {/* Hero Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={heroBanner} alt="BookMyPass Entertainment" className="w-full h-full object-cover" />
        <div className="hero-overlay absolute inset-0 flex items-end pb-6 px-6">
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-primary-foreground">Discover Amazing Experiences</h2>
            <p className="text-primary-foreground/70 text-sm mt-1">Book movies, events, sports & activities near you</p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-[61px] z-40 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between overflow-x-auto scrollbar-hide">
            <div className="flex gap-1">
              {categories.map(cat => (
                <button key={cat.key} onClick={() => { setActiveCategory(cat.key); setActiveGenre('All'); }}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeCategory === cat.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                  <cat.icon className="h-4 w-4" /> {cat.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1 border-l border-border pl-2 ml-2">
              {rightTabs.map(tab => (
                <button key={tab.key} onClick={() => setActiveCategory(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeCategory === tab.key ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                  <tab.icon className="h-4 w-4" /> {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Gift Cards Tab */}
        {activeCategory === 'giftcards' && (
          <div className="text-center py-16 animate-fade-in">
            <Gift className="h-16 w-16 text-accent mx-auto mb-4" />
            <h3 className="font-display font-bold text-2xl text-foreground mb-2">Gift Cards</h3>
            <p className="text-muted-foreground mb-6">Give the gift of entertainment! Choose from our curated gift cards.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[500, 1000, 2000].map(val => (
                <div key={val} className="card-elevated bg-card rounded-xl p-6 text-center border border-border">
                  <div className="w-16 h-16 rounded-full brand-gradient flex items-center justify-center mx-auto mb-3">
                    <Gift className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <p className="font-display font-bold text-xl text-foreground">₹{val}</p>
                  <p className="text-sm text-muted-foreground mt-1">Gift Card</p>
                  <button className="mt-3 text-sm font-semibold text-primary hover:underline">Buy Now</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeCategory !== 'giftcards' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
                {genres.map(g => (
                  <button key={g} onClick={() => setActiveGenre(g)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeGenre === g ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
                    {g}
                  </button>
                ))}
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="text-sm bg-secondary text-foreground border border-border rounded-lg px-3 py-1.5">
                <option value="popularity">Popular</option>
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low-High</option>
                <option value="price-high">Price: High-Low</option>
              </select>
            </div>

            {/* Challenges Banner */}
            {user && (
              <div className="bg-card border border-border rounded-xl p-4 mb-6 flex items-center gap-4 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Flame className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">
                    {bookingStreak >= 3 ? '🎉 You earned a free snack coupon!' : `Book ${3 - bookingStreak} more to earn a free snack coupon!`}
                  </p>
                  <div className="w-full bg-secondary rounded-full h-2 mt-1">
                    <div className="bg-accent h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (bookingStreak / 3) * 100)}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Invite friends</span>
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {user && (
              <div className="mb-8 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <h3 className="font-display font-bold text-lg text-foreground">Recommended For You</h3>
                </div>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                  {recommendations.map(item => (
                    <div key={item.id} className="w-40 shrink-0"><ItemCard item={item} /></div>
                  ))}
                </div>
              </div>
            )}

            {/* Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
              {filteredItems.map(item => <ItemCard key={item.id} item={item} />)}
            </div>
            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No items found. Try a different search or filter.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
