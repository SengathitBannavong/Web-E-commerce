import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useStoreContext } from '../contexts/StoreContext.jsx';

function Login() {
  const navigate = useNavigate();
  const { API, setAppToken, token, setAdminName, setAdminEmail } = useStoreContext();

  useEffect(() => {
    if (token) navigate('/');
  }, [token]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
        const body = {
          Email: email,
          Password: password,
        };
      const res = await axios.post(`${API}users/login`, body);
      // adjust token path according to your API
      const token = res?.data?.token || res?.data?.accessToken || null;
      const adminName = res?.data?.user.name || 'Admin';
      const adminEmail = res?.data?.user.email || email;
      setAdminName(adminName);
      setAdminEmail(adminEmail);
      if (token) {
        // store token in app memory only
        setAppToken(token);
        toast.success('Logged in successfully');
        navigate('/');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
        <p className="text-sm text-slate-500 mb-6">Sign in with your admin account to manage the store.</p>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-md font-medium hover:shadow-lg"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
