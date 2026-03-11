import React, { useState, useEffect } from 'react';
import {
  getVisitors,
  getAnalyticsSummary,
  clearAllVisitors,
  exportVisitorData,
  verifyAdminPassword,
} from '../services/visitorTracker';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [visitors, setVisitors] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const refreshData = () => {
    setVisitors(getVisitors());
    setSummary(getAnalyticsSummary());
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (verifyAdminPassword(password)) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleClearData = () => {
    if (clearAllVisitors(password)) {
      refreshData();
      setShowClearConfirm(false);
      setSelectedVisitor(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="analytics-login">
        <div className="login-card">
          <h2>Analytics Dashboard</h2>
          <p>Enter admin password to access visitor data</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit">Login</button>
          </form>
          <p className="hint">Default password: admin123</p>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="analytics-dashboard">
      <header className="dashboard-header">
        <h1>Visitor Analytics Dashboard</h1>
        <div className="header-actions">
          <button onClick={refreshData} className="btn-refresh">
            Refresh
          </button>
          <button onClick={exportVisitorData} className="btn-export">
            Export JSON
          </button>
          <button onClick={() => setShowClearConfirm(true)} className="btn-danger">
            Clear Data
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Clear All Data?</h3>
            <p>This action cannot be undone. All visitor data will be permanently deleted.</p>
            <div className="modal-actions">
              <button onClick={() => setShowClearConfirm(false)} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleClearData} className="btn-danger">
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <nav className="dashboard-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'visitors' ? 'active' : ''}
          onClick={() => setActiveTab('visitors')}
        >
          All Visitors ({visitors.length})
        </button>
        <button
          className={activeTab === 'locations' ? 'active' : ''}
          onClick={() => setActiveTab('locations')}
        >
          Locations
        </button>
      </nav>

      <main className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && summary && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Visits</h3>
                <span className="stat-number">{summary.totalVisits}</span>
              </div>
              <div className="stat-card">
                <h3>Unique Visitors</h3>
                <span className="stat-number">{summary.uniqueVisitors}</span>
              </div>
              <div className="stat-card">
                <h3>New Visitors</h3>
                <span className="stat-number">{summary.newVisitors}</span>
              </div>
              <div className="stat-card">
                <h3>Returning Visitors</h3>
                <span className="stat-number">{summary.returningVisitors}</span>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3>Top Countries</h3>
                <div className="bar-chart">
                  {Object.entries(summary.countries)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([country, count]) => (
                      <div key={country} className="bar-item">
                        <span className="bar-label">{country}</span>
                        <div className="bar-wrapper">
                          <div
                            className="bar"
                            style={{
                              width: `${(count / summary.totalVisits) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="bar-count">{count}</span>
                      </div>
                    ))}
                  {Object.keys(summary.countries).length === 0 && (
                    <p className="no-data">No data yet</p>
                  )}
                </div>
              </div>

              <div className="chart-card">
                <h3>Browsers</h3>
                <div className="bar-chart">
                  {Object.entries(summary.browsers)
                    .sort(([, a], [, b]) => b - a)
                    .map(([browser, count]) => (
                      <div key={browser} className="bar-item">
                        <span className="bar-label">{browser}</span>
                        <div className="bar-wrapper">
                          <div
                            className="bar browser"
                            style={{
                              width: `${(count / summary.totalVisits) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="bar-count">{count}</span>
                      </div>
                    ))}
                  {Object.keys(summary.browsers).length === 0 && (
                    <p className="no-data">No data yet</p>
                  )}
                </div>
              </div>

              <div className="chart-card">
                <h3>Devices</h3>
                <div className="bar-chart">
                  {Object.entries(summary.devices)
                    .sort(([, a], [, b]) => b - a)
                    .map(([device, count]) => (
                      <div key={device} className="bar-item">
                        <span className="bar-label">{device}</span>
                        <div className="bar-wrapper">
                          <div
                            className="bar device"
                            style={{
                              width: `${(count / summary.totalVisits) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="bar-count">{count}</span>
                      </div>
                    ))}
                  {Object.keys(summary.devices).length === 0 && (
                    <p className="no-data">No data yet</p>
                  )}
                </div>
              </div>

              <div className="chart-card">
                <h3>Operating Systems</h3>
                <div className="bar-chart">
                  {Object.entries(summary.operatingSystems)
                    .sort(([, a], [, b]) => b - a)
                    .map(([os, count]) => (
                      <div key={os} className="bar-item">
                        <span className="bar-label">{os}</span>
                        <div className="bar-wrapper">
                          <div
                            className="bar os"
                            style={{
                              width: `${(count / summary.totalVisits) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="bar-count">{count}</span>
                      </div>
                    ))}
                  {Object.keys(summary.operatingSystems).length === 0 && (
                    <p className="no-data">No data yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Visitors Tab */}
        {activeTab === 'visitors' && (
          <div className="visitors-tab">
            <div className="visitors-layout">
              <div className="visitors-list">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date/Time</th>
                      <th>IP Address</th>
                      <th>Location</th>
                      <th>Device</th>
                      <th>Browser</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitors.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="no-data">
                          No visitors recorded yet
                        </td>
                      </tr>
                    ) : (
                      [...visitors].reverse().map((visitor, index) => (
                        <tr
                          key={visitor.id}
                          onClick={() => setSelectedVisitor(visitor)}
                          className={selectedVisitor?.id === visitor.id ? 'selected' : ''}
                        >
                          <td>{visitors.length - index}</td>
                          <td>{formatDate(visitor.visitTimestamp)}</td>
                          <td>{visitor.ip || 'Unknown'}</td>
                          <td>
                            {visitor.city && visitor.country
                              ? `${visitor.city}, ${visitor.country}`
                              : visitor.country || 'Unknown'}
                          </td>
                          <td>{visitor.deviceType || 'Unknown'}</td>
                          <td>{visitor.browserName || 'Unknown'}</td>
                          <td>
                            <span className={`badge ${visitor.isReturning ? 'returning' : 'new'}`}>
                              {visitor.isReturning ? 'Returning' : 'New'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Visitor Detail Panel */}
              {selectedVisitor && (
                <div className="visitor-detail">
                  <div className="detail-header">
                    <h3>Visitor Details</h3>
                    <button onClick={() => setSelectedVisitor(null)}>&times;</button>
                  </div>
                  <div className="detail-content">
                    <section>
                      <h4>Visit Information</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>Visit ID</label>
                          <span>{selectedVisitor.id}</span>
                        </div>
                        <div className="detail-item">
                          <label>Visitor ID</label>
                          <span>{selectedVisitor.visitorId}</span>
                        </div>
                        <div className="detail-item">
                          <label>Date & Time</label>
                          <span>{formatDate(selectedVisitor.visitTimestamp)}</span>
                        </div>
                        <div className="detail-item">
                          <label>Status</label>
                          <span>{selectedVisitor.isReturning ? 'Returning Visitor' : 'New Visitor'}</span>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h4>Location & Network</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>IP Address</label>
                          <span>{selectedVisitor.ip || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Country</label>
                          <span>{selectedVisitor.country || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Region</label>
                          <span>{selectedVisitor.region || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                          <label>City</label>
                          <span>{selectedVisitor.city || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Postal Code</label>
                          <span>{selectedVisitor.postal || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Coordinates</label>
                          <span>
                            {selectedVisitor.latitude && selectedVisitor.longitude
                              ? `${selectedVisitor.latitude}, ${selectedVisitor.longitude}`
                              : 'Unknown'}
                          </span>
                        </div>
                        <div className="detail-item">
                          <label>Timezone</label>
                          <span>{selectedVisitor.timezone || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                          <label>ISP</label>
                          <span>{selectedVisitor.isp || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Currency</label>
                          <span>{selectedVisitor.currency || 'Unknown'}</span>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h4>Device Information</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>Device Type</label>
                          <span>{selectedVisitor.deviceType || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Operating System</label>
                          <span>{selectedVisitor.os || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Platform</label>
                          <span>{selectedVisitor.platform || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Screen Resolution</label>
                          <span>
                            {selectedVisitor.screenWidth}x{selectedVisitor.screenHeight}
                          </span>
                        </div>
                        <div className="detail-item">
                          <label>Window Size</label>
                          <span>
                            {selectedVisitor.windowWidth}x{selectedVisitor.windowHeight}
                          </span>
                        </div>
                        <div className="detail-item">
                          <label>Pixel Ratio</label>
                          <span>{selectedVisitor.pixelRatio || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Touch Support</label>
                          <span>{selectedVisitor.touchSupport ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="detail-item">
                          <label>CPU Cores</label>
                          <span>{selectedVisitor.hardwareConcurrency || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Device Memory</label>
                          <span>{selectedVisitor.deviceMemory || 'Unknown'}</span>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h4>Browser Information</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>Browser</label>
                          <span>
                            {selectedVisitor.browserName} {selectedVisitor.browserVersion}
                          </span>
                        </div>
                        <div className="detail-item">
                          <label>Language</label>
                          <span>{selectedVisitor.language || 'Unknown'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Cookies Enabled</label>
                          <span>{selectedVisitor.cookiesEnabled ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Do Not Track</label>
                          <span>{selectedVisitor.doNotTrack || 'Not Set'}</span>
                        </div>
                        <div className="detail-item full-width">
                          <label>User Agent</label>
                          <span className="user-agent">{selectedVisitor.userAgent}</span>
                        </div>
                      </div>
                    </section>

                    {selectedVisitor.connection && (
                      <section>
                        <h4>Connection</h4>
                        <div className="detail-grid">
                          <div className="detail-item">
                            <label>Connection Type</label>
                            <span>{selectedVisitor.connection.effectiveType}</span>
                          </div>
                          <div className="detail-item">
                            <label>Downlink</label>
                            <span>{selectedVisitor.connection.downlink}</span>
                          </div>
                          <div className="detail-item">
                            <label>RTT</label>
                            <span>{selectedVisitor.connection.rtt}</span>
                          </div>
                          <div className="detail-item">
                            <label>Data Saver</label>
                            <span>{selectedVisitor.connection.saveData ? 'On' : 'Off'}</span>
                          </div>
                        </div>
                      </section>
                    )}

                    <section>
                      <h4>Referrer</h4>
                      <div className="detail-grid">
                        <div className="detail-item full-width">
                          <label>Came From</label>
                          <span>{selectedVisitor.referrer || 'Direct'}</span>
                        </div>
                        <div className="detail-item full-width">
                          <label>Page URL</label>
                          <span>{selectedVisitor.currentUrl}</span>
                        </div>
                      </div>
                    </section>

                    {selectedVisitor.battery && (
                      <section>
                        <h4>Battery</h4>
                        <div className="detail-grid">
                          <div className="detail-item">
                            <label>Level</label>
                            <span>{selectedVisitor.battery.level}</span>
                          </div>
                          <div className="detail-item">
                            <label>Charging</label>
                            <span>{selectedVisitor.battery.charging ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Locations Tab */}
        {activeTab === 'locations' && summary && (
          <div className="locations-tab">
            <div className="locations-grid">
              <div className="location-card">
                <h3>Countries</h3>
                <div className="location-list">
                  {Object.entries(summary.countries)
                    .sort(([, a], [, b]) => b - a)
                    .map(([country, count]) => (
                      <div key={country} className="location-item">
                        <span className="location-name">{country}</span>
                        <span className="location-count">{count} visits</span>
                      </div>
                    ))}
                  {Object.keys(summary.countries).length === 0 && (
                    <p className="no-data">No country data</p>
                  )}
                </div>
              </div>

              <div className="location-card">
                <h3>Cities</h3>
                <div className="location-list">
                  {Object.entries(summary.cities)
                    .sort(([, a], [, b]) => b - a)
                    .map(([city, count]) => (
                      <div key={city} className="location-item">
                        <span className="location-name">{city}</span>
                        <span className="location-count">{count} visits</span>
                      </div>
                    ))}
                  {Object.keys(summary.cities).length === 0 && (
                    <p className="no-data">No city data</p>
                  )}
                </div>
              </div>

              <div className="location-card">
                <h3>Referrers</h3>
                <div className="location-list">
                  {Object.entries(summary.topReferrers)
                    .sort(([, a], [, b]) => b - a)
                    .map(([referrer, count]) => (
                      <div key={referrer} className="location-item">
                        <span className="location-name referrer">{referrer}</span>
                        <span className="location-count">{count} visits</span>
                      </div>
                    ))}
                  {Object.keys(summary.topReferrers).length === 0 && (
                    <p className="no-data">No referrer data</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
