import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [error, setError] = useState('');
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    return hasUpper && hasLower && pass.length >= 6;
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      setError('Password must contain at least one uppercase, one lowercase letter and be at least 6 characters long.');
      toast.error('Invalid password');
      return;
    }

    const success = await register(name, email, password, photoURL);
    if (success) navigate('/login');
  };

  const handleGoogleLogin = async () => {
    const success = await loginWithGoogle();
    if (success) navigate('/');
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-10 rounded-3xl shadow">
      <h2 className="text-4xl font-bold text-center mb-8">Register</h2>

      <form onSubmit={handleEmailRegister} className="space-y-6">
        <input 
          type="text" 
          placeholder="Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="w-full px-6 py-4 border rounded-3xl" 
          required 
        />
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input 
          type="text" 
          placeholder="Photo URL (optional)" 
          value={photoURL} 
          onChange={(e) => setPhotoURL(e.target.value)} 
          className="w-full px-6 py-4 border rounded-3xl" 
        />

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-4 rounded-3xl text-xl font-semibold"
        >
          Register
        </button>
      </form>

      <div className="my-6 text-center text-gray-500">OR</div>

      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 border border-gray-300 py-4 rounded-3xl hover:bg-gray-50 transition"
      >
        <FcGoogle size={24} />
        <span className="font-medium">Continue with Google</span>
      </button>

      <p className="text-center mt-8">
        Already have an account? <Link to="/login" className="text-blue-600 font-medium">Login</Link>
      </p>
    </div>
  );
};

export default Register;