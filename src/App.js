import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';

import Indices from './components/Indices';
import Indice from './components/Indice';



import UManage from './components/UManage';
import Setup from './components/Setup';
import Topbar from './components/Topbar';
import Create from './components/Create';
import StockDetails from './components/StockDetails';
import StockDashboard from './components/StockDashboard';
import Logs from './components/Logs';
export default function App() {
  const [user, setUser] = useState(null);
  const [setupRequired, setSetupRequired] = useState(false);
  const [loading, setLoading] = useState(true);

  // const backendURL = 'https://ltv059lz-8000.inc1.devtunnels.ms';
  const backendURL = 'http://localhost:8000';


  useEffect(() => {
    const s_token = localStorage.getItem('s_token');
    if (s_token) {
      fetch(`${backendURL}/validate-session/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ s_token })
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            setUser({ u_token: data.u_token });

            fetch(`${backendURL}/check-setup/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ u_token: data.u_token })
            })
              .then(res => res.json())
              .then(setupData => {
                if (setupData.status === 'success' && !setupData.setup_complete) {
                  setSetupRequired(true);
                  localStorage.setItem('setup_required', 'true');
                } else {
                  setSetupRequired(false);
                  localStorage.removeItem('setup_required');
                }
                setLoading(false);
              });
          } else {
            setLoading(false);
          }
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setSetupRequired(false);
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={
            user ? (
              <Navigate to="/home" />
            ) : (
              <UManage
                backendURL={backendURL}
                setUser={(userObj) => {
                  setUser(userObj);
                  fetch(`${backendURL}/check-setup/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ u_token: userObj.u_token })
                  })
                    .then(res => res.json())
                    .then(data => {
                      if (data.status === 'success' && !data.setup_complete) {
                        localStorage.setItem('setup_required', 'true');
                        setSetupRequired(true);
                      } else {
                        localStorage.removeItem('setup_required');
                        setSetupRequired(false);
                      }
                    });
                }}
              />
            )
          }
        />

        {user && setupRequired && (
          <Route
            path="*"
            element={
              <Setup
                user={user}
                backendURL={backendURL}
                onComplete={() => {
                  localStorage.removeItem('setup_required');
                  setSetupRequired(false);
                  window.location.href = "/home";
                }}
              />
            }
          />
        )}

        {user && !setupRequired && (
          <Route
            path="*"
            element={
              <div className="">
                <Topbar
                  u_token={user.u_token}
                  backendURL={backendURL}
                  onLogout={() => {
                    handleLogout();
                    window.history.pushState({}, "", "/auth");
                    setUser(null);
                  }}
                />

                <div style={{ flex: 1, marginTop: '60px' }}>
                  <Routes>
                    <Route path="/home" element={<StockDashboard backendURL={backendURL} />} />
                    <Route path="/stocks/:symbol" element={<StockDetails backendURL={backendURL} />} />
                    <Route path="/indices" element={<Indices backendURL={backendURL} />} />
                    <Route path="/indices/:index" element={<Indice backendURL={backendURL} />} />
                    <Route
                      path="/create"
                      element={
                        user?.u_token === "eaa0f5c8-2b83-4175-8da0-15cd95c15b88" ? (
                          <Create u_token={user.u_token} backendURL={backendURL} />
                        ) : (
                          <Navigate to="/home" replace />
                        )
                      }
                    />
                    <Route path="/log" element={<Logs backendURL={backendURL} />} />
                    <Route path="*" element={<Navigate to="/home" />} />
                  </Routes>
                </div>
              </div>
            }
          />
        )}

        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}
