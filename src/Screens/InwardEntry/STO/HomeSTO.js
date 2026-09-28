import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoData } from '../../../redux/action/StoData';
import { connect } from 'react-redux';
import { toast } from 'react-hot-toast';
import '../../../Stylesheet/EntryPage.css';

const HomeSTO = (props) => {
  const navigate = useNavigate();
  const [showName] = useState(() => localStorage.getItem('EMP_NAME') || 'User');
  const [data, setData] = useState({ PO: '' });
  const [error, setError] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [gateEntryDetails, setGateEntryDetails] = useState([]);
  const [gateEntrydata, setGateEntrydata] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const setValue = (val) => setData({ ...data, ...val });

  const handleSubmit = () => {
    let hasErr = false;
    let err = { PO: null };
    if (!data.PO.trim()) { hasErr = true; err.PO = 'This field is mandatory'; toast.error('Please enter Bill number'); }
    setError(err);
    if (!hasErr) {
      props.StoData({ po: data.PO })
        .then((response) => {
          if (response.status === 200) {
            const gateEntries = response.data[0]?.GateEntryDetails || [];
            if (gateEntries.length === 0) { toast.error('NO GATE ENTRY FOUND'); return; }
            setGateEntryDetails(gateEntries);
            setGateEntrydata(response.data);
            setModalOpen(true);
          }
        })
        .catch(() => toast.error('Please enter a valid Bill number'));
    }
  };

  const handleConfirm = () => {
    setModalOpen(false);
    navigate('/Inward/STO/DetailSTO', { state: { SelectedGateEntry: selectedEntry, GateEntrydata: gateEntrydata } });
  };

  return (
    <div className="ep-root">
      {/* Top Bar */}
      <header className="ep-topbar">
        <div className="ep-topbar-left">
          <button className="ep-back-btn" onClick={() => navigate('/Home')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <div className="ep-brand">
            <img src="/Images/Frame_logo.png" alt="Logo" className="ep-brand-logo" onClick={() => navigate('/Home')} />
            <div>
              <div className="ep-brand-name">GateAccess Pro</div>
              <div className="ep-brand-sub">YARD LOGISTICS OS</div>
            </div>
          </div>
        </div>
        <div className="ep-topbar-right">
          <div className="ep-user-chip">
            <div className="ep-avatar">{showName.charAt(0).toUpperCase()}</div>
            <span className="ep-user-name">{showName}</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="ep-main">
        <div className="ep-page-header">
          <div className="ep-breadcrumb">
            <span>Dashboard</span><span className="ep-breadcrumb-sep">›</span>
            <span>Inward Gate Entry</span><span className="ep-breadcrumb-sep">›</span>
            <span className="ep-breadcrumb-current">Against STO Invoice</span>
          </div>
          <div className="ep-type-badge inward">
            <span className="ep-badge-dot"></span>INWARD
          </div>
          <h1 className="ep-page-title">Inward Gate Entry</h1>
          <p className="ep-page-subtitle">Against STO Invoice — enter the Bill Number to proceed</p>
        </div>

        <div className="ep-card">
          <div className="ep-form-section">
            <div className="ep-section-label">STO Details</div>
            <div className="ep-field-group" style={{ gridTemplateColumns: '1fr' }}>
              <div className="ep-field">
                <label>Bill Number <span className="req">*</span></label>
                <input
                  className={`ep-input${error.PO ? ' error' : ''}`}
                  type="text"
                  placeholder="Please enter Bill Number"
                  onChange={(e) => { setValue({ PO: e.target.value }); setError({ ...error, PO: '' }); }}
                />
                {error.PO && <span className="ep-field-error">{error.PO}</span>}
              </div>
            </div>
          </div>

          <div className="ep-actions">
            <button className="ep-cancel-btn" onClick={() => navigate('/Home')}>Cancel</button>
            <button className="ep-submit-btn" onClick={handleSubmit}>
              Proceed
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </main>

      {/* Gate Entry Selection Modal */}
      {modalOpen && (
        <div className="ep-modal-overlay">
          <div className="ep-modal">
            <div className="ep-modal-title">Select Gate Entry</div>
            <div className="ep-modal-sub">Select the gate entry record to proceed with</div>
            <table className="ep-modal-table">
              <thead>
                <tr>
                  <th>Gate Entry No</th>
                  <th>Vehicle No</th>
                  <th>Driver Name</th>
                </tr>
              </thead>
              <tbody>
                {gateEntryDetails.length > 0 ? (
                  gateEntryDetails.map((entry, index) => (
                    <tr
                      key={index}
                      className={selectedEntry === entry ? 'selected' : ''}
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <td>{entry.GATE_ENTRY_NO}</td>
                      <td>{entry.VEHICLE_NO}</td>
                      <td>{entry.DRIVER_NAME}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3" style={{ textAlign: 'center', color: '#94a3b8' }}>No data available</td></tr>
                )}
              </tbody>
            </table>
            <div className="ep-modal-actions">
              <button className="ep-cancel-btn" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="ep-submit-btn" onClick={handleConfirm} disabled={!selectedEntry}>
                Confirm & Proceed
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default connect(null, { StoData })(HomeSTO);