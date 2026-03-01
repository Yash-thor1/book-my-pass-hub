import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill all fields'); return; }
    const success = login(email, password);
    if (success) navigate('/dashboard');
    else setError('Invalid email or password');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 brand-gradient items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-primary-foreground" style={{
              width: `${Math.random() * 200 + 50}px`, height: `${Math.random() * 200 + 50}px`,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.3
            }} />
          ))}
        </div>
        <div className="relative text-center px-12">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center mx-auto mb-6">
            <span className="text-primary-foreground font-display font-black text-3xl">B</span>
          </div>
          <h1 className="font-display font-black text-5xl text-primary-foreground mb-4">BookMyPass</h1>
          <p className="text-primary-foreground/80 text-lg">Your gateway to movies, events, sports & unforgettable experiences</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden mb-8 text-center">
            <div className="w-14 h-14 rounded-xl brand-gradient flex items-center justify-center mx-auto mb-3">
              <span className="text-primary-foreground font-display font-bold text-2xl">B</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-foreground">BookMyPass</h1>
          </div>
          <h2 className="font-display font-bold text-3xl text-foreground mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Sign in to continue booking</p>

          {error && <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full brand-gradient text-primary-foreground border-0 py-6 text-base font-semibold">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
