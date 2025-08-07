import React, { useState } from 'react';

export default function Setup({ user, backendURL, onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', number: '', bank: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const totalSteps = 3;

  const handleNext = () => {
    if (step === 1 && !form.name.trim()) return setError('Full Name is required.');
    if (step === 2 && !form.number.trim()) return setError('Phone Number is required.');
    if (step === 3 && !form.bank.trim()) return setError('Bank is required.');
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.number.trim() || !form.bank.trim()) {
      setError('All fields are required.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${backendURL}/setup-profile/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ u_token: user.u_token, ...form }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.status === 'success') {
        onComplete();
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch {
      setLoading(false);
      setError('Error submitting profile.');
    }
  };

  return (
    <div className="card shadow p-4 mt-5 mx-auto" style={{ maxWidth: '450px' }}>
      <h2 className="text-center mb-4">Complete Your Profile</h2>

      {/* Progress Bar */}
      <div className="progress mb-4" style={{ height: '8px' }}>
        <div
          className="progress-bar bg-primary"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        ></div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {step === 1 && (
        <div>
          <label className="form-label fw-semibold">Full Name *</label>
          <input
            type="text"
            className="form-control mb-3"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Enter your full name"
          />
          <button className="btn btn-primary w-100 fw-bold" onClick={handleNext}>
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="form-label fw-semibold">Phone Number *</label>
          <input
            type="text"
            className="form-control mb-3"
            value={form.number}
            onChange={e => setForm({ ...form, number: e.target.value })}
            placeholder="Enter your phone number"
          />
          <div className="d-flex justify-content-between gap-2">
            <button className="btn btn-secondary w-50" onClick={() => setStep(step - 1)}>Back</button>
            <button className="btn btn-primary w-50 fw-bold" onClick={handleNext}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <label className="form-label fw-semibold">Bank *</label>
          <textarea
            className="form-control mb-3"
            value={form.bank}
            onChange={e => setForm({ ...form, bank: e.target.value })}
            placeholder="Enter your bank details"
            rows="3"
          ></textarea>
          <div className="d-flex justify-content-between gap-2">
            <button className="btn btn-secondary w-50" onClick={() => setStep(step - 1)}>Back</button>
            <button
              className="btn btn-success w-50 fw-bold"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
