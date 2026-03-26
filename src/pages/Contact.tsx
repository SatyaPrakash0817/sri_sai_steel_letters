import { useEffect, useState } from 'react';
import Title from '../components/Title';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../utils/api';

export default function Contact() {
    const { token } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        let mounted = true;

        async function loadProfile() {
            try {
                const res = await fetch(buildApiUrl('/api/profile'), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) return;
                const data = await res.json();

                if (mounted && data.user) {
                    setName(data.user.name || '');
                    setEmail(data.user.email || '');
                }
            } catch {
                // Keep form usable even if profile prefill fails.
            }
        }

        loadProfile();

        return () => {
            mounted = false;
        };
    }, [token]);

    async function submitContact(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!token) return setError('Please login to send a message');
        if (!name.trim()) return setError('Please enter your name');
        if (!email.trim()) return setError('Please enter your email');
        if (!message.trim()) return setError('Please enter your message');

        setLoading(true);

        try {
            const res = await fetch(buildApiUrl('/api/messages'), {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    subject: subject.trim() || 'Contact Form Message',
                    message: message.trim(),
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to send message');

            setSuccess('Message sent successfully. Admin will receive it shortly.');
            setSubject('');
            setMessage('');
        } catch (err: any) {
            setError(err.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    }

    return (
        <section id="contact" className="max-w-4xl mx-auto px-4 py-20">
            <Title title="Contact" heading="Get in touch" description="Send us a message or call for a quote. We'll get back to you shortly." />

            <div className="bg-white/5 border border-white/6 rounded-lg p-6">
                <p className="text-gray-300 mb-4">Email: <a href="mailto:nagireddylaxman@gmail.com" className="text-indigo-300">nagireddylaxman@gmail.com</a></p>
                <p className="text-gray-300 mb-4">Phone: <a href="tel:+919550809193" className="text-indigo-300">+91 95508 09193</a></p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form onSubmit={submitContact} className="grid grid-cols-1 gap-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="p-3 rounded bg-black/30 border border-white/6 text-white"
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email"
                            className="p-3 rounded bg-black/30 border border-white/6 text-white"
                        />
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Subject"
                            className="p-3 rounded bg-black/30 border border-white/6 text-white"
                        />
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Message"
                            className="p-3 rounded bg-black/30 border border-white/6 text-white h-32"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`mt-2 inline-flex items-center justify-center gap-2 rounded bg-indigo-600 px-4 py-3 text-white ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>

                        {error && <p className="text-sm text-red-400">{error}</p>}
                        {success && <p className="text-sm text-green-400">{success}</p>}
                    </form>

                    <div>
                        <h4 className="text-white font-semibold mb-2">Our Location</h4>
                        <div className="w-full h-64 rounded overflow-hidden border border-white/6">
                            <iframe
                                title="Sri Sai Steel Letters location"
                                src="https://maps.google.com/maps?q=16.721111,81.090639&z=17&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                            />
                            <div className="mt-2">
                                <a href="https://www.google.com/maps?q=16.721111,81.090639" target="_blank" rel="noopener noreferrer" className="text-indigo-300 underline">Open in Google Maps</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
