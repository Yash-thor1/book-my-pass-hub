import { useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BookingSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-14 w-14 text-primary" />
        </div>
        <h1 className="font-display font-bold text-3xl text-foreground mb-2">Pass Booked Successfully! 🎉</h1>
        <p className="text-muted-foreground mb-8">Your tickets have been confirmed. You'll receive a confirmation email shortly.</p>

        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
          <p className="font-mono font-bold text-foreground text-lg">BMP-{Date.now().toString(36).toUpperCase()}</p>
        </div>

        <div className="flex gap-3 justify-center mb-6">
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Download Pass</Button>
          <Button variant="outline" size="sm"><Share2 className="h-4 w-4 mr-1" /> Share</Button>
        </div>

        <div className="space-y-3">
          <Button onClick={() => navigate('/profile')} className="w-full brand-gradient text-primary-foreground border-0">View Booking History</Button>
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="w-full">Continue Browsing</Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
