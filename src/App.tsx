import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import OurWorks from './pages/OurWorks';
import Products from './pages/Products';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';
import SoftBackdrop from './components/SoftBackdrop';
import Footer from './components/Footer';
import LenisScroll from './components/lenis';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
	return (
		<BrowserRouter basename={import.meta.env.BASE_URL}>
			<AuthProvider>
				<SoftBackdrop />
				<LenisScroll />
				<Navbar />

				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/our-works" element={<OurWorks />} />
					<Route path="/products" element={<Products />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				<Route path="/contact" element={<PrivateRoute><Contact /></PrivateRoute>} />
				<Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
				<Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
				<Route path="/admin/login" element={<AdminLogin />} />
				<Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
			</Routes>

				<Footer />
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;