import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ShoppingCart, User, LogOut, History, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { allLocations } from '@/data/items';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
}

const Header = ({ searchQuery, onSearchChange, selectedLocation, onLocationChange }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showLocations, setShowLocations] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">B</span>
          </div>
          <span className="font-display font-bold text-xl text-foreground hidden sm:block">BookMyPass</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search movies, events, sports..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary text-foreground placeholder:text-muted-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Location */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowLocations(!showLocations)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MapPin className="h-4 w-4 text-primary" />
            <span className="hidden md:inline">{selectedLocation}</span>
          </button>
          {showLocations && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
              {allLocations.map(loc => (
                <button
                  key={loc}
                  onClick={() => { onLocationChange(loc); setShowLocations(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${loc === selectedLocation ? 'text-primary font-medium' : 'text-foreground'}`}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cart */}
        <Link to="/checkout" className="relative shrink-0">
          <ShoppingCart className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Auth / Menu */}
        {user ? (
          <div className="relative shrink-0">
            <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">{user.name[0].toUpperCase()}</span>
              </div>
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                <div className="px-4 py-3 border-b border-border">
                  <p className="font-medium text-sm text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Link to="/profile" onClick={() => setShowMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                  <User className="h-4 w-4" /> My Profile
                </Link>
                <Link to="/profile" onClick={() => setShowMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                  <History className="h-4 w-4" /> Booking History
                </Link>
                <button onClick={() => { logout(); setShowMenu(false); navigate('/'); }} className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-secondary transition-colors w-full">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/">
            <Button size="sm" className="brand-gradient text-primary-foreground border-0 shrink-0">Sign In</Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
