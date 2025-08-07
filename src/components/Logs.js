// Logs.js
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Logs({ backendURL }) {
  const [logs, setLogs] = useState([]);
  const [logType, setLogType] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendURL}/logs/?type=${logType}`);
      const data = await res.json();
      if (data.status === 'success') setLogs(data.logs);
    } catch (err) {
      console.error('Fetch failed');
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (id) => {
    await fetch(`${backendURL}/logs/`, {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchLogs();
  };

  const deleteAll = async () => {
    await fetch(`${backendURL}/logs/`, {
      method: 'DELETE',
      body: JSON.stringify({ all: true }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchLogs();
  };

  const deleteByType = async () => {
    await fetch(`${backendURL}/logs/`, {
      method: 'DELETE',
      body: JSON.stringify({ type: logType }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchLogs();
  };

  const toggleMark = async (id, currentMark) => {
    await fetch(`${backendURL}/logs/`, {
      method: 'PATCH',
      body: JSON.stringify({ id, mark: !currentMark }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchLogs();
  };

  useEffect(() => {
    fetchLogs();
  }, [logType]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h4>System Logs</h4>
        <div>
          <select
            className="form-select form-select-sm d-inline-block w-auto me-2"
            value={logType}
            onChange={(e) => setLogType(e.target.value)}
          >
            <option value="">All</option>
            <option value="UTs">UTs</option>
            <option value="err">Error</option>
            <option value="general">General</option>
          </select>
          <button className="btn btn-outline-secondary btn-sm me-2" onClick={fetchLogs}>Refresh</button>
          <button className="btn btn-outline-danger btn-sm me-2" onClick={deleteByType}>Delete By Type</button>
          <button className="btn btn-outline-danger btn-sm" onClick={deleteAll}>Delete All</button>
        </div>
      </div>

      {loading ? (
        <div className="alert alert-info">Loading logs...</div>
      ) : logs.length === 0 ? (
        <div className="alert alert-warning">No logs available.</div>
      ) : (
        <div className="list-group">
          {logs.map((log) => (
            <div key={log.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{log.type}</strong> — {log.log}
                <div><small className="text-muted">{log.timestamp}</small></div>
              </div>
              <div>
                <button
                  className={`btn btn-sm ${log.viewed ? 'btn-warning' : 'btn-success'} me-2`}
                  onClick={() => toggleMark(log.id, log.viewed)}
                >
                  {log.viewed ? 'Unmark' : 'Mark'}
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteLog(log.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
