import React, { useState } from 'react';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [selectedInbox, setSelectedInbox] = useState(null);
  const [catSrc, setCatSrc] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [sendStatus, setSendStatus] = useState(null);
  const [sendError, setSendError] = useState(null);
  const [checks, setChecks] = useState({ meals: false, okay: false, water: false });
  const [showAlbert, setShowAlbert] = useState(false);
  const [showPageCat, setShowPageCat] = useState(false);

  const checklistOptions = [
    { key: 'meals', label: 'Are you eating meals 3x a day?' },
    { key: 'okay', label: 'Are you okay?' },
    { key: 'water', label: "Don't forget to drink water, okay?" },
  ];

  const messages = {
    1: 'Hi maam, nice to meet you!!!, meow:)',
    2: 'cuteton ka madammm!!, but',
  };

  const subjects = {
    1: 'New message',
    2: 'New message',
  };

  const handleSendResponse = async () => {
    if (!responseText.trim()) return;
    setSendStatus('sending');
    setSendError(null);
    try {
      const res = await fetch(`${API_BASE}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: responseText,
          checklist: checklistOptions
            .filter((option) => checks[option.key])
            .map((option) => option.label),
        }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setSendStatus('sent');
      setResponseText('');
      setChecks({ meals: false, okay: false, water: false });
    } catch (err) {
      setSendStatus('error');
      setSendError(`${err.message} (${API_BASE})`);
    }
  };

  return (
    <div className="page-shell">
      <div className="bg-blob blob-one" />
      <div className="bg-blob blob-two" />
      <div className="bg-blob blob-three" />

      <div className="app-card">
        <header className="topbar">
          <div className="title-block">
            <p className="eyebrow">Messaging Madam</p>
          </div>
        </header>

        <main className="center-panel">
          <div className="avatar-ring">
            <img
              src="/madam.jpg"
              alt="Madam"
              className="avatar-image"
            />
          </div>
          <h2>Madam Ashley</h2>
          <p>cuteton eses HAAHA.</p>

          <div className="inbox-row">
            <button type="button" className="inbox-icon" aria-label="Inbox" onClick={() => setSelectedInbox(1)}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22,12 16,12 14,15 10,15 8,12 2,12" />
                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </svg>
              <span className="inbox-label">Inbox</span>
            </button>

            <button type="button" className="inbox-icon" aria-label="Inbox" onClick={() => setSelectedInbox(2)}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22,12 16,12 14,15 10,15 8,12 2,12" />
                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </svg>
              <span className="inbox-label">Inbox</span>
            </button>
          </div>

          <button type="button" className="from-albert" onClick={() => setShowAlbert(true)}>
            From Albert
          </button>
        </main>
      </div>

      {selectedInbox && (
        <div className="modal-overlay" onClick={() => setSelectedInbox(null)}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-label={subjects[selectedInbox]}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              aria-label="Close"
              onClick={() => setSelectedInbox(null)}
            >
              &times;
            </button>
            <div className="modal-avatar-ring">
              <img
                src="/madam.jpg"
                alt="Madam"
                className="modal-avatar"
              />
            </div>
            <p className="modal-eyebrow">To Madam</p>
            <h3>{subjects[selectedInbox]}</h3>
            {selectedInbox === 2 ? (
              <>
                <h3 className="modal-text modal-text-fancy">{messages[selectedInbox]}</h3>
                <div className="checklist">
                  {checklistOptions.map((option) => (
                    <label className="check-item" key={option.key}>
                      <input
                        type="checkbox"
                        checked={checks[option.key]}
                        onChange={(e) =>
                          setChecks((prev) => ({ ...prev, [option.key]: e.target.checked }))
                        }
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </>
            ) : (
              <h3 className="modal-text modal-text-fancy">{messages[selectedInbox]}</h3>
            )}
            <button
              type="button"
              className="modal-ok"
              onClick={() => {
                setCatSrc(selectedInbox === 2 ? '/cat2.jpg' : '/cat.jpg');
                setResponseText('');
                setSendStatus(null);
                setChecks({ meals: false, okay: false, water: false });
                setSelectedInbox(null);
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    {catSrc && (
        <div className="modal-overlay" onClick={() => setCatSrc(null)}>
          <div
            className="cat-card"
            role="dialog"
            aria-modal="true"
            aria-label="Cat"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              aria-label="Close"
              onClick={() => setCatSrc(null)}
            >
              &times;
            </button>
            <div className="cat-frame">
              <img
                src={catSrc}
                alt="Cute cat"
                className="cat-image"
              />
            </div>
            <h3 className="cat-title">meow:)</h3>
            <p className="cat-sub">
              {catSrc === '/cat2.jpg' ? 'para saimo talaga ini madam' : 'for you po madam'}
            </p>
            <div className="response-box">
              <input
                className="response-input"
                type="text"
                placeholder="Type your response..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendResponse();
                }}
              />
              <button
                type="button"
                className="modal-ok response-send"
                onClick={handleSendResponse}
                disabled={sendStatus === 'sending'}
              >
                {sendStatus === 'sending' ? 'Sending...' : 'Send'}
              </button>
            </div>
            {sendStatus === 'sent' && (
              <p className="response-status response-sent">Sent!</p>
            )}
            {sendStatus === 'error' && (
              <p className="response-status response-error">{sendError || 'Failed to send, try again'}</p>
            )}
            <button
              type="button"
              className="modal-ok"
              onClick={() => {
                setCatSrc(null);
                setResponseText('');
                setSendStatus(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    {showAlbert && (
        <div className="modal-overlay" onClick={() => setShowAlbert(false)}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-label="From Albert"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              aria-label="Close"
              onClick={() => setShowAlbert(false)}
            >
              &times;
            </button>
            <div className="modal-avatar-ring">
              <img
                src="/madam.jpg"
                alt="Madam"
                className="modal-avatar"
              />
            </div>
            <p className="modal-eyebrow">From Albert</p>
            <h3 className="modal-text modal-text-fancy">Congratsss madammm:)!!!</h3>
            <button
              type="button"
              className="modal-ok"
              onClick={() => {
                setShowAlbert(false);
                setShowPageCat(true);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showPageCat && (
        <div className="page-cat-overlay" onClick={() => setShowPageCat(false)}>
          <button
            type="button"
            className="overlay-back"
            aria-label="Back"
            onClick={() => setShowPageCat(false)}
          >
            &#8592; Back
          </button>
          <img
            src="/cat.jpg"
            alt="Cute cat filling the UI"
            className="page-cat-image"
          />
        </div>
      )}
    </div>
  );
}

export default App;