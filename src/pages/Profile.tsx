import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, MapPin, Clock, Flame, Trophy, Users, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { getCategoryGradient } from '@/data/items';

const Profile = () => {
  const { user, bookings, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) { navigate('/'); return null; }

  const totalSpent = bookings.reduce((acc, b) => acc + b.totalPrice, 0);
  const streak = bookings.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="brand-gradient">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display font-bold text-xl text-primary-foreground">My Profile</h1>
        </div>
        <div className="max-w-4xl mx-auto px-4 pb-8 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-3xl">{user.name[0].toUpperCase()}</span>
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-primary-foreground">{user.name}</h2>
            <p className="text-primary-foreground/70 flex items-center gap-1"><Mail className="h-4 w-4" />{user.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 -mt-10 mb-8">
          <div className="card-elevated bg-card rounded-xl p-4 text-center border border-border">
            <p className="font-display font-bold text-2xl text-primary">{bookings.length}</p>
            <p className="text-xs text-muted-foreground">Bookings</p>
          </div>
          <div className="card-elevated bg-card rounded-xl p-4 text-center border border-border">
            <p className="font-display font-bold text-2xl text-accent">₹{totalSpent.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </div>
          <div className="card-elevated bg-card rounded-xl p-4 text-center border border-border">
            <p className="font-display font-bold text-2xl text-foreground">{streak}🔥</p>
            <p className="text-xs text-muted-foreground">Streak</p>
          </div>
        </div>

        {/* Challenge */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <Trophy className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-foreground">
              {streak >= 3 ? '🎉 Congrats! You earned a free snack coupon!' : `Book ${3 - streak} more to earn a free snack coupon!`}
            </p>
            <div className="w-full bg-secondary rounded-full h-2 mt-1">
              <div className="bg-accent h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (streak / 3) * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Invite Friends */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-sm text-foreground">Invite Friends & Split Payments</p>
              <p className="text-xs text-muted-foreground">Share bookings and split costs with friends</p>
            </div>
          </div>
          <Button variant="outline" size="sm"><Share2 className="h-4 w-4 mr-1" /> Share</Button>
        </div>

        {/* Booking History */}
        <h3 className="font-display font-bold text-xl text-foreground mb-4">Booking History</h3>
        {bookings.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <Calendar className="h-12 w-12 text-muted mx-auto mb-3" />
            <p className="text-muted-foreground">No bookings yet. Start exploring!</p>
            <Button onClick={() => navigate('/dashboard')} className="mt-4 brand-gradient text-primary-foreground border-0">Browse Events</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {[...bookings].reverse().map(booking => (
              <div key={booking.id} className="card-elevated bg-card border border-border rounded-xl p-4 flex items-center gap-4 animate-fade-in">
                <div className={`w-14 h-14 rounded-lg ${getCategoryGradient(booking.item.category)} flex items-center justify-center shrink-0`}>
                  <span className="text-primary-foreground font-display font-bold text-lg">{booking.item.title[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{booking.item.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(booking.bookedAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{booking.item.location}</span>
                    <span>{booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-primary">₹{booking.totalPrice.toLocaleString()}</p>
                  <span className="text-xs bg-secondary text-primary px-2 py-0.5 rounded-full font-medium">Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => { logout(); navigate('/'); }} className="text-destructive border-destructive/30 hover:bg-destructive/5">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
