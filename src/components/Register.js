import React, { useState } from 'react';

export default function Register({ backendURL, setUser }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: '', username: '', number: '', otp: '', password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${backendURL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.status === 'otp_sent') {
        setMessage('✅ OTP sent to your email.');
        setStep(2);
      } else {
        setMessage(data.message || '❌ Failed to send OTP.');
      }
    } catch {
      setMessage('❌ Network error.');
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${backendURL}/verify-otp/`, {
        method: 'POST',
        body: JSON.stringify({ email: form.email, otp: form.otp }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMessage('✅ OTP Verified. Set your password.');
        setStep(3);
      } else {
        setMessage(data.message || '❌ Invalid OTP.');
      }
    } catch {
      setMessage('❌ Network error.');
    }
    setLoading(false);
  };

  const setPassword = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${backendURL}/set-password/`, {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.status === 'registered') {
        setMessage('🎉 Registration successful! Logging in...');
        // ✅ Save session token & login user
        localStorage.setItem('s_token', data.s_token);
        setUser({ u_token: data.u_token });
      } else {
        setMessage(data.message || '❌ Registration failed.');
      }
    } catch {
      setMessage('❌ Network error.');
    }
    setLoading(false);
  };

  return (
    <div className="card shadow-sm p-4" style={{ maxWidth: '400px', margin: 'auto' }}>
      <h3 className="text-center mb-3">Register</h3>

      {step === 1 && (
        <>
          <label className="form-label fw-semibold">Email</label>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter your email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <label className="form-label fw-semibold">Username</label>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Choose a username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />

          <button
            className="btn btn-primary w-100 fw-bold"
            onClick={sendOTP}
            disabled={loading || !form.email || !form.username}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <label className="form-label fw-semibold">Enter OTP</label>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter the OTP"
            value={form.otp}
            onChange={e => setForm({ ...form, otp: e.target.value })}
          />
          <button
            className="btn btn-success w-100 fw-bold"
            onClick={verifyOTP}
            disabled={loading || !form.otp}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <label className="form-label fw-semibold">Set Password</label>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter a strong password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <button
            className="btn btn-success w-100 fw-bold"
            onClick={setPassword}
            disabled={loading || !form.password}
          >
            {loading ? 'Registering...' : 'Register & Login'}
          </button>
        </>
      )}

      {message && (
        <p
          className={`mt-3 text-center fw-semibold ${
            message.includes('✅') || message.includes('🎉')
              ? 'text-success'
              : 'text-danger'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
