/**
 * Internship Assessment Certificate Generator
 * Produces high-resolution, printable/saveable proof of completion for internship mentors.
 */
class CertificateGenerator {
  constructor() {
    this.modal = null;
  }

  generateCredentialId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = 'APX-';
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  show(data) {
    const {
      candidateName = 'Internship Candidate',
      score = 1500,
      totalPossible = 1800,
      accuracy = 95,
      category = 'Full-Stack Development',
      grade = 'A+ Distinction'
    } = data;

    const certId = this.generateCredentialId();
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const certHTML = `
      <div class="certificate-wrapper" id="printable-certificate">
        <div class="certificate-border">
          <div class="certificate-inner-border">
            <div class="cert-corner top-left"></div>
            <div class="cert-corner top-right"></div>
            <div class="cert-corner bottom-left"></div>
            <div class="cert-corner bottom-right"></div>

            <div class="cert-header">
              <div class="cert-badge-tag">INTERNSHIP TASK 03 • OFFICIAL ASSESSMENT</div>
              <h1 class="cert-title">CERTIFICATE OF ACHIEVEMENT</h1>
              <p class="cert-subtitle">This certificate is awarded in recognition of outstanding technical competence and assessment mastery to</p>
            </div>

            <div class="cert-recipient">
              <h2 class="cert-name" id="cert-recipient-name">${candidateName}</h2>
              <div class="cert-line"></div>
            </div>

            <div class="cert-body">
              <p>For successfully completing the comprehensive <strong>Interactive Quiz Game Application</strong> technical evaluation across multi-disciplinary domains with distinguished merit.</p>
            </div>

            <div class="cert-metrics-row">
              <div class="cert-metric-pill">
                <span class="cert-metric-label">Domain</span>
                <span class="cert-metric-val">${category}</span>
              </div>
              <div class="cert-metric-pill">
                <span class="cert-metric-label">Score</span>
                <span class="cert-metric-val">${score} / ${totalPossible}</span>
              </div>
              <div class="cert-metric-pill">
                <span class="cert-metric-label">Accuracy</span>
                <span class="cert-metric-val">${accuracy}%</span>
              </div>
              <div class="cert-metric-pill highlight">
                <span class="cert-metric-label">Grade Awarded</span>
                <span class="cert-metric-val">${grade}</span>
              </div>
            </div>

            <div class="cert-footer">
              <div class="cert-sign-col">
                <div class="cert-signature-line">
                  <span class="sig-script">Antigravity AI</span>
                </div>
                <div class="cert-sign-title">Automated Assessment Engine</div>
                <div class="cert-sign-sub">Internship Evaluation Platform</div>
              </div>

              <div class="cert-seal-col">
                <div class="cert-gold-seal">
                  <svg viewBox="0 0 100 100" class="seal-svg">
                    <circle cx="50" cy="50" r="46" fill="#fbbf24" stroke="#d97706" stroke-width="3" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#78350f" stroke-width="1.5" stroke-dasharray="3,3" />
                    <polygon points="50,15 59,34 80,36 64,50 69,71 50,60 31,71 36,50 20,36 41,34" fill="#d97706" opacity="0.25"/>
                    <text x="50" y="44" text-anchor="middle" font-size="9" font-weight="bold" fill="#78350f" font-family="sans-serif">TASK 03</text>
                    <text x="50" y="55" text-anchor="middle" font-size="7.5" font-weight="900" fill="#78350f" font-family="sans-serif">VERIFIED</text>
                    <text x="50" y="65" text-anchor="middle" font-size="6.5" fill="#78350f" font-family="sans-serif">EXCELLENCE</text>
                  </svg>
                </div>
              </div>

              <div class="cert-sign-col">
                <div class="cert-date-line">${dateStr}</div>
                <div class="cert-sign-title">Date of Issue</div>
                <div class="cert-sign-sub">Credential ID: <code>${certId}</code></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const modalContainer = document.getElementById('certificate-modal-container');
    if (modalContainer) {
      modalContainer.innerHTML = `
        <div class="modal-overlay active" id="cert-modal-overlay">
          <div class="modal-dialog cert-dialog">
            <div class="cert-modal-toolbar no-print">
              <div class="cert-edit-name-wrap">
                <label for="input-edit-cert-name">Candidate Name:</label>
                <input type="text" id="input-edit-cert-name" value="${candidateName}" class="cert-input-name" placeholder="Enter Full Name" />
                <button class="btn btn-sm btn-secondary" id="btn-update-cert-name">Update Name</button>
              </div>
              <div class="cert-actions-group">
                <button class="btn btn-primary" id="btn-print-certificate">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                  Print / Save PDF
                </button>
                <button class="btn btn-ghost" id="btn-close-certificate">✕ Close</button>
              </div>
            </div>
            <div class="certificate-render-viewport">
              ${certHTML}
            </div>
          </div>
        </div>
      `;

      // Event listeners
      document.getElementById('btn-close-certificate').addEventListener('click', () => {
        modalContainer.innerHTML = '';
      });

      document.getElementById('btn-print-certificate').addEventListener('click', () => {
        window.print();
      });

      const updateNameBtn = document.getElementById('btn-update-cert-name');
      const inputName = document.getElementById('input-edit-cert-name');
      const nameDisplay = document.getElementById('cert-recipient-name');

      const applyName = () => {
        const val = inputName.value.trim() || 'Internship Candidate';
        nameDisplay.textContent = val;
        localStorage.setItem('apex_quiz_candidate_name', val);
      };

      updateNameBtn.addEventListener('click', applyName);
      inputName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') applyName();
      });
    }
  }
}

window.certificateGenerator = new CertificateGenerator();
