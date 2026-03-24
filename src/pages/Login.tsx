import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const apiHeaders = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    };

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!email) return setError('Please enter your email');
        if (!password) return setError('Please enter your password');
        setLoading(true);
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify({ email, password }),
            });
            const data = await parseApiResponse(res);
            if (!data.token) throw new Error('Login failed. Token missing from response.');
            login(data.token);
            navigate('/profile');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="max-w-md mx-auto px-4 py-20">
            <h2 className="text-2xl text-white mb-4">Login</h2>

            <form onSubmit={submit} className="grid gap-3 bg-white/5 p-6 rounded-lg border border-white/6">
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="p-3 rounded bg-black/30 border border-white/6 text-white transition-shadow focus:shadow-outline"
                />

                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full p-3 rounded bg-black/30 border border-white/6 text-white transition-shadow focus:shadow-outline"
                    />
                    <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2 top-2 text-sm text-gray-300">
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>

                <button disabled={loading} className={`mt-2 inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-3 text-white ${loading ? 'opacity-60' : ''}`}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                {error && <div className="text-red-400">{error}</div>}

                <p className="text-sm text-gray-300 mt-2">Don't have an account? <Link to="/register" className="text-indigo-300 underline">Register</Link></p>
            </form>
        </section>
    );
}
