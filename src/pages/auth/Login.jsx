import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axiosConfig';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('login', { email, password });
      const { token, user } = response.data;
      login(user, token);
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau password salah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex overflow-hidden z-50 bg-white font-['Open_Sans']">

      {/* LEFT SIDE - 60% Illustration Panel (NO BOXES) */}
      <div className="hidden lg:flex lg:w-[60%] bg-gradient-to-br from-[#f0f2ff] via-[#e6e9ff] to-[#f5f7ff] relative overflow-hidden items-center justify-center">

        {/* Simple Background Decorations - Circles Only */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-40 w-12 h-12 bg-purple-400 rounded-full opacity-10"></div>
        <div className="absolute bottom-40 left-32 w-20 h-20 bg-indigo-300 opacity-10 rounded-full"></div>
        <div className="absolute bottom-60 right-24 w-10 h-10 bg-pink-300 rounded-full opacity-10"></div>

        {/* Brand Logo - Top Left (No Overlap) */}
        <div className="absolute top-8 left-8 flex items-center gap-3 z-50">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
            {/* Food/Restaurant Icon */}
            <svg className="w-7 h-7 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 9H9V2H7V9H5V2H3V9C3 11.12 4.66 12.84 6.75 12.97V22H9.25V12.97C11.34 12.84 13 11.12 13 9V2H11V9ZM16 6V14H18.5V22H21V2C18.24 2 16 4.24 16 6Z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-[#566a7f]">POS RFID</span>
        </div>

        {/* Main Illustration - Centered */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
          <img
            src="https://demos.themeselection.com/sneat-bootstrap-html-laravel-admin-template/demo/assets/img/illustrations/boy-with-rocket-light.png"
            alt="Illustration"
            className="max-w-[80%] max-h-[80%] object-contain drop-shadow-xl"
          />
        </div>
      </div>

      {/* RIGHT SIDE - 40% Login Form Panel (NO BOXES, FULL BG) */}
      <div className="flex-1 lg:w-[40%] flex items-center justify-center bg-white relative">
        <div className="w-full max-w-md px-8 py-10">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 9H9V2H7V9H5V2H3V9C3 11.12 4.66 12.84 6.75 12.97V22H9.25V12.97C11.34 12.84 13 11.12 13 9V2H11V9ZM16 6V14H18.5V22H21V2C18.24 2 16 4.24 16 6Z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#566a7f]">POS RFID</span>
          </div>

          {/* Welcome Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#566a7f] mb-2">Welcome to POS RFID! 👋</h2>
            <p className="text-[#a1acb8]">Please sign-in to your account and start the adventure</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#566a7f] mb-1.5 uppercase tracking-wide">
                Email or Username
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#d9dee3] rounded-lg focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-[#697a8d] placeholder-gray-400"
                placeholder="Enter your email or username"
                required
                autoFocus
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-[#566a7f] uppercase tracking-wide">
                  Password
                </label>
                <a href="#" className="text-sm text-primary hover:text-[#5f61e6] font-medium transition-colors">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-4 outline-none transition-all text-[#697a8d] pr-12 placeholder-gray-400 ${password.length > 0 && password.length <= 6
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                    : 'border-[#d9dee3] focus:border-primary focus:ring-primary/10'
                    }`}
                  placeholder="············"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a1acb8] hover:text-[#697a8d] transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password.length > 0 && password.length <= 6 && (
                <p className="text-red-500 text-xs mt-1.5">
                  Password must be more than 6 characters
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#d9dee3] text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2.5 text-sm text-[#697a8d] select-none cursor-pointer hover:text-[#566a7f]">
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-[#5f61e6] text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>SIGNING IN...</span>
                </>
              ) : 'SIGN IN'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="bg-gradient-to-r from-[#f0f2ff] to-[#fef5f7] rounded-lg p-4 border border-primary/10">
              <p className="text-xs font-bold text-[#697a8d] uppercase mb-3 text-center tracking-wider">Demo Access</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm py-1.5 px-2 bg-white/60 rounded-lg">
                  <span className="font-semibold text-gray-600">Admin</span>
                  <span className="font-mono text-[#697a8d] text-xs">admin@pos.com / admin123</span>
                </div>
                <div className="flex justify-between items-center text-sm py-1.5 px-2 bg-white/60 rounded-lg">
                  <span className="font-semibold text-gray-600">Kasir</span>
                  <span className="font-mono text-[#697a8d] text-xs">kasir@pos.com / kasir123</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
