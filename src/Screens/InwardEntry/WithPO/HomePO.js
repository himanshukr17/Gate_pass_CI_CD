import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogContent, DialogActions, TextField } from '@mui/material';
import { PoData, AsnData } from '../../../redux/action/PoData';
import { connect } from 'react-redux';
import toast from 'react-hot-toast';
import '../../../Stylesheet/EntryPage.css';

const apiURL = process.env.REACT_APP_API_URL;

function HomePO(props) {
  const navigate = useNavigate();

  const [entryMode, setEntryMode] = useState('PO');
  const [details, setDetails] = useState(null);
  const [plantOptions, setPlantOptions] = useState([]);
  const [plantName, setPlantName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [error, seterror] = useState({});
  const [showName] = useState(() => localStorage.getItem('EMP_NAME') || 'User');
  const [data, setdata] = useState({ PLANT: '', PO: [], LINEITEM: [] });
  const [multiPO, setMultiPO] = useState(data.PO);

  let n = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  let podata = [...multiPO];

  const setValue = (val) => setdata({ ...data, ...val });

  useEffect(() => {
    const persistRoot = localStorage.getItem('persist:root');
    if (persistRoot) {
      try {
        const parsed = JSON.parse(persistRoot);
        const lr = JSON.parse(parsed.loginreducer);
        setDetails(lr.details);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (!details) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiURL}Employee/allocated_plant?id=${details}`);
        const newData = await res.json();
        const options = newData.map((p) => ({ label: p.PLANT_NAME, value: p.PLANT_ID }));
        setPlantOptions(options);
        if (options.length > 0) { setPlantName(options[0].value); setValue({ PLANT: options[0].value }); }
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, [details]);

  const handleSubmit = () => {
    if (entryMode === 'ASN') {
      const asn = multiPO[0];
      if (!asn) { toast.error('ASN Number is required'); return; }
      props.AsnData({ asn })
        .then((response) => {
          if (response.status === 200 && response.data.length > 0) navigate('/Inward/ASN/Details', { state: response.data });
          else toast.error(response.data.message || 'ASN not found');
        })
        .catch((err) => toast.error(err.message || 'Error fetching ASN data'));
      return;
    }
    let hasErr = false;
    let err = { PLANT: '', PO: '', LINEITEM: '' };
    ['PLANT', 'PO'].forEach((field) => {
      if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) { hasErr = true; err[field] = 'This field is mandatory'; }
    });
    seterror(err);
    if (!hasErr) {
      props.PoData({ plant: plantName, po: multiPO })
        .then((response) => {
          if (response.status === 200 && response.data.length > 0 && response.data[0].FLAG === 0)
            navigate('/Inward/PO/Details', { state: response.data });
          else if (response.data[0].FLAG === 1) toast.error('PO Not Approved');
          else if (response.status === 404) toast.error('Data not found');
        })
        .catch(() => toast.error('Error fetching PO data'));
    }
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
        {/* Page Header */}
        <div className="ep-page-header">
          <div className="ep-breadcrumb">
            <span>Dashboard</span><span className="ep-breadcrumb-sep">›</span>
            <span>Inward Gate Entry</span><span className="ep-breadcrumb-sep">›</span>
            <span className="ep-breadcrumb-current">With Reference to PO / ASN</span>
          </div>
          <div className="ep-type-badge inward">
            <span className="ep-badge-dot"></span>INWARD
          </div>
          <h1 className="ep-page-title">Inward Gate Entry</h1>
          <p className="ep-page-subtitle">With reference to {entryMode === 'PO' ? 'Purchase Order (PO)' : 'Advance Shipment Notice (ASN)'}</p>
        </div>

        {/* Card */}
        <div className="ep-card">
          {/* Toggle PO / ASN */}
          <div className="ep-toggle-row">
            <button className={`ep-toggle-btn${entryMode === 'PO' ? ' active' : ''}`} onClick={() => setEntryMode('PO')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              PO Number
            </button>
            <button className={`ep-toggle-btn${entryMode === 'ASN' ? ' active' : ''}`} onClick={() => setEntryMode('ASN')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              ASN
            </button>
          </div>

          {entryMode === 'PO' && (
            <>
              <div className="ep-form-section">
                <div className="ep-section-label">Plant & PO Details</div>
                <div className="ep-field-group">
                  <div className="ep-field">
                    <label>Plant <span className="req">*</span></label>
                    <select
                      className={`ep-select${error.PLANT ? ' error' : ''}`}
                      value={plantName}
                      onChange={(e) => { setPlantName(e.target.value); setValue({ PLANT: e.target.value }); }}
                    >
                      <option value="">Select Plant</option>
                      {plantOptions.map((p) => (
                        <option key={p.value} value={p.value}>{p.value} ({p.label})</option>
                      ))}
                    </select>
                    {error.PLANT && <span className="ep-field-error">{error.PLANT}</span>}
                  </div>

                  <div className="ep-field">
                    <label>PO Number <span className="req">*</span></label>
                    <input
                      className={`ep-input${error.PO ? ' error' : ''}`}
                      type="text"
                      placeholder="Enter Purchasing Document Number"
                      onChange={(e) => { const updatedPO = [e.target.value]; setMultiPO(updatedPO); setValue({ PO: updatedPO }); }}
                    />
                    {error.PO && <span className="ep-field-error">{error.PO}</span>}
                    <button className="ep-add-more" onClick={() => setIsOpen(true)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add More PO Numbers
                    </button>
                  </div>
                </div>
              </div>

              <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogContent>
                  {n.map((item, index) => (
                    <TextField
                      key={index}
                      label="Purchasing Document No."
                      value={data.PO[index]}
                      onChange={(e) => { podata[0] = data.PO[0]; podata[index] = e.target.value; setMultiPO(podata); }}
                      size="small"
                      style={{ width: '45%', marginRight: '5%', marginTop: '3%' }}
                    />
                  ))}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsOpen(false)} color="primary">Done</Button>
                </DialogActions>
              </Dialog>
            </>
          )}

          {entryMode === 'ASN' && (
            <div className="ep-form-section">
              <div className="ep-section-label">ASN Details</div>
              <div className="ep-field-group" style={{ gridTemplateColumns: '1fr' }}>
                <div className="ep-field">
                  <label>ASN Number <span className="req">*</span></label>
                  <input
                    className="ep-input"
                    type="text"
                    placeholder="Enter ASN Number"
                    onChange={(e) => { setMultiPO([e.target.value]); setValue({ PO: [e.target.value] }); }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="ep-actions">
            <button className="ep-cancel-btn" onClick={() => navigate('/Home')}>Cancel</button>
            <button className="ep-submit-btn" onClick={handleSubmit}>
              Proceed
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default connect(null, { PoData, AsnData })(HomePO);
