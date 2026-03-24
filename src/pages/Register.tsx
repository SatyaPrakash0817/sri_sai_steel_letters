import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

async function parseApiResponse(res: Response) {
    const raw = await res.text();
    let data: any = {};

    if (raw) {
        try {
            data = JSON.parse(raw);
        } catch {
            throw new Error(`Server returned an invalid response (${res.status})`);
        }
    }

    if (!res.ok) {
        throw new Error(data.message || `Request failed (${res.status})`);
    }

    return data;
}

export default function Register() {
    const [step, setStep] = useState<'details' | 'otp'>('details');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const apiHeaders = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    };

    async function sendOtp(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        
        if (!name) return setError('Please enter your name');
        if (!email) return setError('Please enter your email');
        if (!phone) return setError('Please enter your phone number');
        if (password.length < 6) return setError('Password must be at least 6 characters');
        
        setLoading(true);
        try {
            const res = await fetch('/api/send-otp', {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify({ email }), // Changed from phone + email to email only
            });
            await parseApiResponse(res);
            
            setStep('otp');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function verifyAndRegister(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        
        if (!otp) return setError('Please enter OTP');
        
        setLoading(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify({ name, email, phone, password, otp }),
            });
            await parseApiResponse(res);
            navigate('/login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (step === 'details') {
        return (
            <section className="max-w-md mx-auto px-4 py-20">
                <h2 className="text-2xl text-white mb-2">Create Account</h2>
                <p className="text-gray-400 text-sm mb-6">Step 1 of 2: Enter your details</p>
                <form onSubmit={sendOtp} className="grid gap-4 bg-white/5 p-6 rounded-lg border border-white/6">
                    <input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Full name" 
                        className="p-3 rounded bg-black/30 border border-white/6 text-white placeholder-gray-500 transition-shadow focus:shadow-outline" 
                    />
                    
                    <input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Email" 
                        type="email"
                        className="p-3 rounded bg-black/30 border border-white/6 text-white placeholder-gray-500 transition-shadow focus:shadow-outline" 
                    />

                    <input 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
                        placeholder="Phone number (10 digits)" 
                        maxLength={10}
                        className="p-3 rounded bg-black/30 border border-white/6 text-white placeholder-gray-500 transition-shadow focus:shadow-outline" 
                    />

                    <div className="relative">
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Password (min 6 characters)" 
                            className="w-full p-3 rounded bg-black/30 border border-white/6 text-white placeholder-gray-500 transition-shadow focus:shadow-outline" 
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(s => !s)} 
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button 
                        disabled={loading} 
                        className={`mt-2 inline-flex items-center justify-center gap-2 rounded bg-indigo-600 px-4 py-3 text-white font-medium hover:bg-indigo-700 transition ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                    
                    {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded">{error}</div>}

                    <p className="text-sm text-gray-300 mt-2">Already have an account? <Link to="/login" className="text-indigo-300 underline hover:text-indigo-200">Login</Link></p>
                </form>
            </section>
        );
    }

    return (
        <section className="max-w-md mx-auto px-4 py-20">
            <h2 className="text-2xl text-white mb-2">Verify Email</h2>
            <p className="text-gray-400 text-sm mb-6">Step 2 of 2: Enter the OTP sent to {email}</p>
            <form onSubmit={verifyAndRegister} className="grid gap-4 bg-white/5 p-6 rounded-lg border border-white/6">
                <div className="text-center mb-2">
                    <p className="text-gray-400 text-sm">OTP sent to {email}</p>
                </div>

                <input 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                    placeholder="Enter 6-digit OTP" 
                    maxLength={6}
                    className="p-4 rounded bg-black/30 border border-white/6 text-white placeholder-gray-500 text-center text-lg tracking-widest transition-shadow focus:shadow-outline" 
                />

                <button 
                    disabled={loading} 
                    className={`mt-2 inline-flex items-center justify-center gap-2 rounded bg-green-600 px-4 py-3 text-white font-medium hover:bg-green-700 transition ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Creating Account...' : 'Verify & Register'}
                </button>

                <button 
                    type="button"
                    onClick={() => {
                        setStep('details');
                        setOtp('');
                        setError(null);
                    }}
                    className="text-sm text-gray-400 hover:text-gray-300 underline"
                >
                    Back to details
                </button>
                
                {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded">{error}</div>}
            </form>
        </section>
    );
}
