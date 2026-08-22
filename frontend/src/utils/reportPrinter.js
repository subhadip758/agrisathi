/**
 * AgriSathi Official Enterprise Report Printer & PDF Exporter
 * Generates and prints complete, unclipped, beautifully formatted official reports.
 */

export const printOfficialReport = ({
  title = 'AgriSathi Official Report',
  subtitle = 'Verified Agricultural AI Diagnostic & Advisory Document',
  farmerName = null,
  location = null,
  elementId = null,
  htmlContent = ''
}) => {
  let profileName = farmerName;
  let profileLoc = location;

  try {
    const saved = localStorage.getItem('agrisathi_profile');
    if (saved) {
      const p = JSON.parse(saved);
      if (!profileName && p.name) profileName = p.name;
      if (!profileLoc && (p.address || p.farmLocation)) profileLoc = p.address || p.farmLocation;
    }
  } catch (_) {}

  const finalFarmerName = profileName || 'Subhadip Pal';
  const finalLocation = profileLoc || 'Barasat, District North 24 Parganas, West Bengal';
  let reportBody = htmlContent;

  if (elementId && !htmlContent) {
    const el = document.getElementById(elementId);
    if (el) reportBody = el.innerHTML;
  }

  // Create an iframe to isolate the printable report
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;

  const dateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - AgriSathi</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Inter', system-ui, sans-serif;
            color: #1e293b;
            background: #ffffff;
            padding: 24px;
            line-height: 1.5;
          }
          
          .report-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2.5px solid #059669;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .brand-logo {
            font-size: 28px;
          }
          .brand-name {
            font-size: 22px;
            font-weight: 800;
            color: #065f46;
          }
          .brand-sub {
            font-size: 11px;
            color: #047857;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .doc-meta {
            text-align: right;
            font-size: 11px;
            color: #64748b;
          }
          .doc-title {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 4px;
          }
          .doc-subtitle {
            font-size: 12px;
            color: #475569;
            margin-bottom: 16px;
          }
          
          .farmer-banner {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 12px;
            padding: 12px 16px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
          }
          .farmer-info strong { color: #166534; }

          /* Content formatting */
          h1, h2, h3, h4, h5 { color: #0f172a; margin-top: 12px; margin-bottom: 6px; }
          p { margin-bottom: 8px; font-size: 13px; color: #334155; }
          ul, ol { padding-left: 20px; margin-bottom: 12px; font-size: 13px; }
          li { margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
          th { background: #f8fafc; font-weight: 700; color: #0f172a; }
          
          /* Hide interactive components */
          button, .no-print, input, select { display: none !important; }
          
          .footer-note {
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            font-size: 10px;
            color: #94a3b8;
            text-align: center;
          }

          @page {
            size: A4 portrait;
            margin: 12mm;
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div class="brand">
            <span class="brand-logo">🌾</span>
            <div>
              <div class="brand-name">AgriSathi</div>
              <div class="brand-sub">Smart Agricultural Intelligence Platform</div>
            </div>
          </div>
          <div class="doc-meta">
            <div><strong>Date:</strong> ${dateStr}</div>
            <div><strong>Document Ref:</strong> AGY-RPT-${Math.floor(100000 + Math.random() * 900000)}</div>
          </div>
        </div>

        <div class="doc-title">${title}</div>
        <div class="doc-subtitle">${subtitle}</div>

        <div class="farmer-banner">
          <div class="farmer-info"><strong>Farmer Name:</strong> ${finalFarmerName}</div>
          <div class="farmer-info"><strong>Farm Location:</strong> ${finalLocation}</div>
        </div>

        <div class="report-content">
          ${reportBody}
        </div>

        <div class="footer-note">
          This is an official AI-assisted agricultural diagnostic and advisory report generated by AgriSathi System.
          For emergency support, contact AgriSathi Farmer Helpdesk.
        </div>
      </body>
    </html>
  `;

  doc.open();
  doc.write(fullHtml);
  doc.close();

  // Trigger print after iframe renders
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 500);
};
