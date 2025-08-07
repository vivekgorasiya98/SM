import React, { useState } from 'react';

export default function ManualLogin({ setUser, backendURL }) {
  const [form, setForm] = useState({ email_or_username: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${backendURL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message || '');

      if (data.status === 'success') {
        localStorage.setItem('s_token', data.s_token);
        setUser({ u_token: data.u_token });
      }
    } catch (error) {
      setMessage('Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="text-start">
      {/* Email/Username Input */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Email or Username</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your email or username"
          value={form.email_or_username}
          onChange={(e) => setForm({ ...form, email_or_username: e.target.value })}
        />
      </div>

      {/* Password Input */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>

      {/* Login Button */}
      <div className="d-grid">
        <button
          onClick={handleLogin}
          className="btn btn-primary fw-bold"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="mt-3 text-center">
          <small
            className={`fw-bold ${
              message.toLowerCase().includes('success') ? 'text-success' : 'text-danger'
            }`}
          >
            {message}
          </small>
        </div>
      )}
    </div>
  );
}
