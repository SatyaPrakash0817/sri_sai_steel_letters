import { MenuIcon, XIcon, LogOut, User, LayoutDashboard } from 'lucide-react';
import { PrimaryButton } from './Buttons';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Our Works', href: '/our-works' },
        { name: 'Our Products', href: '/products' },
        { name: 'Contact', href: '/contact' },
    ];

    const handleContactClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isAuthenticated) {
            navigate('/contact');
        } else {
            navigate('/login');
        }
        setIsOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    return (
        <motion.nav className='fixed top-5 left-0 right-0 z-50 px-4'
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
        >
            <div className='max-w-6xl mx-auto flex items-center justify-between bg-black/50 backdrop-blur-md border border-white/4 rounded-2xl p-3'>
                <Link to='/'>
                    <img src='/logo.png' alt="Sri Sai Steel Letters logo" className="h-8" />
                </Link>

                <div className='hidden md:flex items-center gap-8 text-sm font-medium text-gray-300'>
                    {navLinks.map((link) => (
                        link.name === 'Contact' ? (
                            <button 
                                key={link.name}
                                onClick={handleContactClick}
                                className="hover:text-white transition"
                            >
                                {link.name}
                            </button>
                        ) : (
                            <Link to={link.href} key={link.name} className="hover:text-white transition">
                                {link.name}
                            </Link>
                        )
                    ))}
                </div>

                <div className='hidden md:flex items-center gap-3'>
                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <>
                                    <Link to='/admin/dashboard' className='flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition px-3 py-2 rounded hover:bg-blue-500/10'>
                                        <LayoutDashboard size={16} />
                                        Admin
                                    </Link>
                                    <span className='text-xs text-gray-600'>|</span>
                                </>
                            )}
                            <Link to='/profile' className='flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition px-3 py-2 rounded hover:bg-white/5'>
                                <User size={16} />
                                Profile
                            </Link>
                            <span className='text-xs text-gray-600'>|</span>
                            <button 
                                onClick={handleLogout}
                                className='flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-red-400 transition'
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to='/login' className='text-sm font-medium text-gray-300 hover:text-white transition max-sm:hidden'>
                                Sign in
                            </Link>
                            <span className='text-xs text-gray-600'>|</span>
                            <Link to='/admin/login' className='text-xs font-medium text-gray-400 hover:text-blue-400 transition'>
                                Admin
                            </Link>
                            <Link to='/register' className='max-sm:text-xs hidden sm:inline-block'>
                                <PrimaryButton>Get Started</PrimaryButton>
                            </Link>
                        </>
                    )}
                </div>

                <button onClick={() => setIsOpen(!isOpen)} className='md:hidden'>
                    <MenuIcon className='size-6' />
                </button>
            </div>
            <div className={`flex flex-col items-center justify-center gap-6 text-lg font-medium fixed inset-0 bg-black/40 backdrop-blur-md z-50 transition-all duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                {navLinks.map((link) => (
                    link.name === 'Contact' ? (
                        <button 
                            key={link.name}
                            onClick={handleContactClick}
                        >
                            {link.name}
                        </button>
                    ) : (
                        <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)}>
                            {link.name}
                        </Link>
                    )
                ))}

                {isAuthenticated ? (
                    <>
                        {isAdmin && (
                            <Link to='/admin/dashboard' onClick={() => setIsOpen(false)} className='flex items-center gap-2 font-medium text-blue-400 hover:text-blue-300 transition'>
                                <LayoutDashboard size={18} />
                                Admin Dashboard
                            </Link>
                        )}
                        <Link to='/profile' onClick={() => setIsOpen(false)} className='flex items-center gap-2 font-medium text-gray-300 hover:text-white transition'>
                            <User size={18} />
                            My Profile
                        </Link>
                        <button 
                            onClick={handleLogout}
                            className='flex items-center gap-2 font-medium text-gray-300 hover:text-red-400 transition'
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to='/login' onClick={() => setIsOpen(false)} className='font-medium text-gray-300 hover:text-white transition'>
                            Sign in
                        </Link>
                        <Link to='/admin/login' onClick={() => setIsOpen(false)} className='text-sm font-medium text-gray-400 hover:text-blue-400 transition'>
                            Admin Portal
                        </Link>
                        <PrimaryButton onClick={() => setIsOpen(false)}>Get Started</PrimaryButton>
                    </>
                )}

                <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-md bg-white p-2 text-gray-800 ring-white active:ring-2"
                >
                    <XIcon />
                </button>
            </div>
        </motion.nav>
    );
};