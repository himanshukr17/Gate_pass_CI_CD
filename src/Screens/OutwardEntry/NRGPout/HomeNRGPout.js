import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SalesData } from '../../../redux/action/SalesOrder';
import { toast } from 'react-hot-toast';
import { connect } from 'react-redux';
import '../../../Stylesheet/EntryPage.css';

function HomeNRGPout(props) {
  const navigate = useNavigate();
  const [showName] = useState(() => localStorage.getItem('EMP_NAME') || 'User');
  const [data, setdata] = useState({ PO: '' });
  const [error, seterror] = useState({});

  const setValue = (val) => setdata({ ...data, ...val });

  const handleSubmit = () => {
    let hasErr = false;
    let err = { PO: null };
    if (!data.PO || data.PO === '') {
      hasErr = true;
      err.PO = 'This field is mandatory';
      toast.error('Please enter Bill number');
    }
    seterror(err);
    if (!hasErr) {
      props.SalesData({ po: data.PO })
        .then((response) => {
          if (response.status === 200) navigate('/Outward/NRGP/Details', { state: response.data });
        })
        .catch(() => toast.error('Please enter valid Bill number'));
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
        <div className="ep-page-header">
          <div className="ep-breadcrumb">
            <span>Dashboard</span><span className="ep-breadcrumb-sep">›</span>
            <span>Outward Gate Entry</span><span className="ep-breadcrumb-sep">›</span>
            <span className="ep-breadcrumb-current">Invoice / Challan</span>
          </div>
          <div className="ep-type-badge outward">
            <span className="ep-badge-dot"></span>OUTWARD
          </div>
          <h1 className="ep-page-title">Outward Gate Entry</h1>
          <p className="ep-page-subtitle">Against Invoice / Challan — enter the Billing Document Number to proceed</p>
        </div>

        <div className="ep-card">
          <div className="ep-form-section">
            <div className="ep-section-label">Invoice Details</div>
            <div className="ep-field-group" style={{ gridTemplateColumns: '1fr' }}>
              <div className="ep-field">
                <label>Invoice Number <span className="req">*</span></label>
                <input
                  className={`ep-input${error.PO ? ' error' : ''}`}
                  type="text"
                  placeholder="Please enter Billing Document Number"
                  onChange={(e) => { setValue({ PO: e.target.value }); seterror({ ...error, PO: '' }); }}
                />
                {error.PO && <span className="ep-field-error">{error.PO}</span>}
              </div>
            </div>
          </div>

          <div className="ep-actions">
            <button className="ep-cancel-btn" onClick={() => navigate('/Home')}>Cancel</button>
            <button className="ep-submit-btn outward-btn" onClick={handleSubmit}>
              Proceed
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default connect(null, { SalesData })(HomeNRGPout);