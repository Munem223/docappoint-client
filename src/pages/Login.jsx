import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/');
  };

  const handleGoogleLogin = async () => {
    const success = await loginWithGoogle();
    if (success) navigate('/');
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-10 rounded-3xl shadow">
      <h2 className="text-4xl font-bold text-center mb-8">Login</h2>

      <form onSubmit={handleEmailLogin} className="space-y-6">
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full px-6 py-4 border rounded-3xl" 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full px-6 py-4 border rounded-3xl" 
          required 
        />
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-4 rounded-3xl text-xl font-semibold"
        >
          Login
        </button>
      </form>

      <div className="my-6 text-center text-gray-500">OR</div>

      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 border border-gray-300 py-4 rounded-3xl hover:bg-gray-50 transition text-lg font-medium"
      >
        🔵 Continue with Google
      </button>

      <p className="text-center mt-8">
        Don't have an account? <Link to="/register" className="text-blue-600 font-medium">Register</Link>
      </p>
    </div>
  );
};

export default Login;