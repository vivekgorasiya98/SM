import React, { useState } from 'react';

export default function ForgotPassword({ backendURL }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: '', otp: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${backendURL}/forgot-password/`, {
        method: 'POST',
        body: JSON.stringify({ email: form.email }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      if (data.status === 'otp_sent') {
        setMessage("✅ OTP sent to your email");
        setStep(2);
      } else {
        setMessage(data.message || "❌ Failed to send OTP");
      }
    } catch {
      setMessage("❌ Network error");
    }
    setLoading(false);
  };

  const reset = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${backendURL}/reset-password/`, {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      if (data.status === 'success') {
        setMessage("✅ Password reset successful! You can login now.");
        setStep(3);
      } else {
        setMessage(data.message || "❌ Error resetting password");
      }
    } catch {
      setMessage("❌ Network error");
    }
    setLoading(false);
  };

  return (
    <div className="card shadow-sm p-4" style={{ maxWidth: '400px', margin: 'auto' }}>
      <h3 className="text-center mb-3">Forgot Password</h3>

      {step === 1 && (
        <>
          <label className="form-label fw-semibold">Email Address</label>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter your email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <button
            className="btn btn-primary w-100 fw-bold"
            onClick={sendOTP}
            disabled={loading || !form.email}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <label className="form-label fw-semibold">Enter OTP</label>
          <input
            className="form-control mb-3"
            placeholder="Enter the OTP"
            value={form.otp}
            onChange={e => setForm({ ...form, otp: e.target.value })}
          />

          <label className="form-label fw-semibold">New Password</label>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter new password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />

          <button
            className="btn btn-success w-100 fw-bold"
            onClick={reset}
            disabled={loading || !form.otp || !form.password}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </>
      )}

      {step === 3 && (
        <div className="text-center">
          <p className="text-success fw-bold">{message}</p>
        </div>
      )}

      {message && step !== 3 && (
        <p className={`mt-3 text-center fw-semibold ${message.includes('✅') ? 'text-success' : 'text-danger'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
