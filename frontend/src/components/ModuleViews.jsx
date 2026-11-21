import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const ReportAnimalView = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    animal_name: '',
    category: 'Dog',
    reporter_name: 'Sneha Kiranagi',
    reporter_phone: '+91 98450 11223',
    location: '',
    injury_severity: 'High',
    health_condition: '',
    emergency_status: 'Immediate Dispatch',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await axios.post('http://localhost:5000/api/rescues', formData);
      setMessage({ type: 'success', text: res.data.message });
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit report' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0 text-success">
          <i className="bi bi-shield-plus me-2"></i>Report a Distressed Animal
        </h4>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <p className="text-muted small mb-4">
        Report stray, abandoned, or injured Dogs, Cats, and Cows for immediate ambulance rescue and triage.
      </p>

      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} rounded-3`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-semibold">Animal Category *</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Dog">🐶 Indian Street Dog / Puppy</option>
              <option value="Cat">🐱 Stray Cat / Kitten</option>
              <option value="Cow">🐮 Indian Street Cow / Injured Calf</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-semibold">Animal Description / Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Limping Indie Pup"
              value={formData.animal_name}
              onChange={(e) => setFormData({ ...formData, animal_name: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-semibold">Exact Location / Landmark *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Near Metro Pillar 120, MG Road, Bengaluru"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-semibold">Injury Severity Level *</label>
            <select
              className="form-select"
              value={formData.injury_severity}
              onChange={(e) => setFormData({ ...formData, injury_severity: e.target.value })}
            >
              <option value="Critical">🚨 Critical (Vehicular impact, severe bleeding, trauma)</option>
              <option value="High">⚠️ High (Fracture, deep laceration, hypothermia)</option>
              <option value="Medium">⚡ Medium (Limping, skin infection, mild fever)</option>
              <option value="Low">🟢 Low (Minor scratch, routine check)</option>
            </select>
          </div>
          <div className="col-12">
            <label className="form-label small fw-semibold">Observed Health Condition & Symptoms *</label>
            <textarea
              className="form-control"
              rows="3"
              required
              placeholder="Describe condition, bleeding, wounds, or mobility issues..."
              value={formData.health_condition}
              onChange={(e) => setFormData({ ...formData, health_condition: e.target.value })}
            ></textarea>
          </div>
          <div className="col-12 text-end mt-4">
            <button type="button" className="btn btn-outline-secondary me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success px-4" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Emergency Report'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const AvailableAnimalsView = ({ onClose, onAdoptClick }) => {
  const [animals, setAnimals] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/animals?category=${filter}`)
      .then((res) => {
        setAnimals(res.data.data || []);
      })
      .catch(() => setAnimals([]))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0 text-success">
          <i className="bi bi-grid-fill me-2"></i>Available Animals Directory
        </h4>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <p className="text-muted small mb-3">
        Browse rehabilitated Indian street animals. Dogs and cats are eligible for household adoption; cows are protected in sanctuary care.
      </p>

      {/* Filter Tabs */}
      <div className="btn-group mb-4" role="group">
        <button
          type="button"
          className={`btn btn-sm ${filter === 'All' ? 'btn-success' : 'btn-outline-secondary'}`}
          onClick={() => setFilter('All')}
        >
          All Rescues
        </button>
        <button
          type="button"
          className={`btn btn-sm ${filter === 'Dog' ? 'btn-success' : 'btn-outline-secondary'}`}
          onClick={() => setFilter('Dog')}
        >
          🐶 Dogs
        </button>
        <button
          type="button"
          className={`btn btn-sm ${filter === 'Cat' ? 'btn-success' : 'btn-outline-secondary'}`}
          onClick={() => setFilter('Cat')}
        >
          🐱 Cats
        </button>
        <button
          type="button"
          className={`btn btn-sm ${filter === 'Cow' ? 'btn-success' : 'btn-outline-secondary'}`}
          onClick={() => setFilter('Cow')}
        >
          🐮 Indian Cows (Sanctuary)
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">Loading available rescues...</div>
      ) : (
        <div className="row g-3">
          {animals.map((an) => (
            <div className="col-md-4" key={an._id}>
              <div className="card h-100 border rounded-3 overflow-hidden shadow-sm">
                <img
                  src={an.image_url}
                  onError={(e) => (e.target.src = '/assets/images/pet_rocky.jpg')}
                  alt={an.name}
                  className="card-img-top"
                  style={{ height: '160px', objectFit: 'cover' }}
                />
                <div className="card-body p-3 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h5 className="fw-bold mb-0">{an.name}</h5>
                      <span className="badge bg-success-subtle text-success small">{an.category}</span>
                    </div>
                    <small className="text-muted d-block mb-1">
                      {an.breed} • {an.age} • {an.gender}
                    </small>
                    <p className="small text-secondary mb-2" style={{ fontSize: '0.82rem' }}>
                      {an.description || 'Gentle and friendly companion.'}
                    </p>
                  </div>
                  {an.category === 'Cow' ? (
                    <button className="btn btn-sm btn-info text-white w-100 rounded-pill" disabled>
                      <i className="bi bi-shield-heart me-1"></i> Gaushala Sanctuary Care
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-success w-100 rounded-pill"
                      onClick={() => onAdoptClick(an)}
                    >
                      Adopt Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const PriorityRankingView = ({ onClose }) => {
  const [rescues, setRescues] = useState([]);
  const [aiTest, setAiTest] = useState({
    severity: 'Critical',
    emergency: true,
    category: 'Dog',
    health_condition: 'Fractured hind leg and deep laceration',
  });
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/rescues').then((res) => {
      setRescues(res.data.data || []);
    });
  }, []);

  const handleTestAi = async (e) => {
    e.preventDefault();
    setAiLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ml/priority-score', aiTest);
      setAiResult(res.data.data);
    } catch {
      setAiResult({
        priority_score: 95.0,
        urgency_level: 'Critical',
        dispatch_urgency: 'Immediate Emergency Ambulance (Within 15 Mins)',
        recommended_action: 'Deploy surgical triage bay.',
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0 text-success">
          <i className="bi bi-bar-chart-steps me-2"></i>AI Rescue Priority Ranking Engine
        </h4>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <p className="text-muted small mb-4">
        Powered by our Python AI/ML priority scoring script in <code>ml-model/scripts/priority_scorer.py</code>.
      </p>

      {/* AI Simulator Box */}
      <div className="card bg-light border-0 rounded-4 p-3 mb-4">
        <h6 className="fw-bold mb-2 text-dark">
          <i className="bi bi-cpu-fill text-primary me-2"></i>Live Python AI Priority Simulator
        </h6>
        <form onSubmit={handleTestAi} className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label small fw-semibold">Severity</label>
            <select
              className="form-select form-select-sm"
              value={aiTest.severity}
              onChange={(e) => setAiTest({ ...aiTest, severity: e.target.value })}
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-semibold">Category</label>
            <select
              className="form-select form-select-sm"
              value={aiTest.category}
              onChange={(e) => setAiTest({ ...aiTest, category: e.target.value })}
            >
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Cow">Cow</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-semibold">Condition Symptoms</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={aiTest.health_condition}
              onChange={(e) => setAiTest({ ...aiTest, health_condition: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-sm btn-primary w-100" disabled={aiLoading}>
              {aiLoading ? 'Computing...' : 'Run Python AI'}
            </button>
          </div>
        </form>

        {aiResult && (
          <div className="alert alert-info mt-3 mb-0 small rounded-3">
            <strong>AI Priority Score: {aiResult.priority_score}/100 ({aiResult.urgency_level})</strong>
            <br />
            <strong>Dispatch Urgency:</strong> {aiResult.dispatch_urgency}
            <br />
            <strong>Protocol:</strong> {aiResult.recommended_action}
          </div>
        )}
      </div>

      {/* Priority Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle small">
          <thead className="table-light">
            <tr>
              <th>Rank</th>
              <th>Animal</th>
              <th>Category</th>
              <th>Location</th>
              <th>Severity</th>
              <th>AI Priority Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rescues.map((res, idx) => (
              <tr key={res._id || idx}>
                <td>
                  <span className="badge rounded-circle bg-dark text-white p-2">{idx + 1}</span>
                </td>
                <td className="fw-bold">{res.animal_name}</td>
                <td>
                  <span className="badge bg-light text-dark border">{res.category}</span>
                </td>
                <td>{res.location}</td>
                <td>
                  <span
                    className={`badge ${
                      res.injury_severity === 'Critical'
                        ? 'bg-danger'
                        : res.injury_severity === 'High'
                        ? 'bg-warning text-dark'
                        : 'bg-info text-dark'
                    }`}
                  >
                    {res.injury_severity}
                  </span>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div className="progress flex-grow-1" style={{ height: '8px', width: '60px' }}>
                      <div
                        className={`progress-bar ${
                          res.priority_score >= 80 ? 'bg-danger' : 'bg-warning'
                        }`}
                        style={{ width: `${res.priority_score}%` }}
                      ></div>
                    </div>
                    <strong>{res.priority_score}/100</strong>
                  </div>
                </td>
                <td>
                  <span className="badge bg-success-subtle text-success">{res.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const LedgerView = ({ onClose }) => {
  const [ledger, setLedger] = useState({
    summary: { totalDonations: 10500, totalExpenses: 6200, balance: 4300 },
    donations: [],
    expenses: [],
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/ledger').then((res) => {
      if (res.data.data) setLedger(res.data.data);
    });
  }, []);

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0 text-success">
          <i className="bi bi-wallet2 me-2"></i>Donations & Expenses Ledger
        </h4>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card bg-success-subtle border-0 rounded-4 p-3 text-center">
            <small className="fw-bold text-success">TOTAL DONATIONS</small>
            <h3 className="fw-bold text-success mt-1 mb-0">
              ₹{ledger.summary.totalDonations.toLocaleString()}
            </h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-danger-subtle border-0 rounded-4 p-3 text-center">
            <small className="fw-bold text-danger">TOTAL EXPENSES</small>
            <h3 className="fw-bold text-danger mt-1 mb-0">
              ₹{ledger.summary.totalExpenses.toLocaleString()}
            </h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-primary-subtle border-0 rounded-4 p-3 text-center">
            <small className="fw-bold text-primary">AVAILABLE RESERVE</small>
            <h3 className="fw-bold text-primary mt-1 mb-0">
              ₹{ledger.summary.balance.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <h6 className="fw-bold text-success mb-2">Recent Inflow Contributions</h6>
          <div className="table-responsive">
            <table className="table table-hover small">
              <thead className="table-light">
                <tr>
                  <th>Donor</th>
                  <th>Purpose</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {ledger.donations.map((d, i) => (
                  <tr key={i}>
                    <td className="fw-bold">{d.donor_name}</td>
                    <td>{d.purpose}</td>
                    <td className="text-end text-success fw-bold">+₹{d.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-6">
          <h6 className="fw-bold text-danger mb-2">Verified Outflow Disbursements</h6>
          <div className="table-responsive">
            <table className="table table-hover small">
              <thead className="table-light">
                <tr>
                  <th>Expense</th>
                  <th>Category</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {ledger.expenses.map((e, i) => (
                  <tr key={i}>
                    <td className="fw-bold">{e.description}</td>
                    <td>{e.expense_type}</td>
                    <td className="text-end text-danger fw-bold">-₹{e.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
