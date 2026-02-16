/**
 * Utility to generate the HTML content for printing invoices.
 * Separates CSS and HTML structure from the main React components.
 */

export const generateInvoiceHtml = (transaction, orderId, method, date, subtotal, itemsHtml) => {
    return `
    <html>
      <head>
        <title>Invoice - ${orderId}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap');
          
          body { 
            font-family: 'Public Sans', -apple-system, sans-serif; 
            color: #566a7f;
            margin: 0;
            padding: 40px;
            line-height: 1.5;
            background: white;
          }

          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
          }

          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          }

          .brand {
            display: flex;
            align-items: flex-start;
            gap: 15px;
          }

          .logo {
            width: 48px;
            height: 48px;
            background: #696cff;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 900;
            font-size: 24px;
          }

          .brand-info h1 {
            font-size: 20px;
            font-weight: 700;
            color: #566a7f;
            margin: 0;
            text-transform: uppercase;
          }

          .brand-info p {
            font-size: 13px;
            color: #a1acb8;
            margin: 5px 0 0 0;
            max-width: 250px;
          }

          .invoice-meta {
            text-align: right;
          }

          .invoice-meta h2 {
            font-size: 18px;
            font-weight: 700;
            color: #566a7f;
            margin: 0 0 10px 0;
          }

          .meta-item {
            font-size: 13px;
            margin: 3px 0;
            color: #a1acb8;
          }

          .meta-item b {
            color: #566a7f;
          }

          .divider {
            height: 1px;
            background: #ebedef;
            margin: 30px 0;
          }

          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
          }

          .info-label {
            font-size: 11px;
            font-weight: 700;
            color: #a1acb8;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
          }

          .info-content p {
            margin: 4px 0;
            font-size: 14px;
          }

          .info-content .name {
            font-size: 15px;
            font-weight: 700;
            color: #566a7f;
            margin-bottom: 5px;
          }

          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }

          .items-table th {
            text-align: left;
            padding: 12px 15px;
            background: #f8f9fa;
            border-bottom: 1px solid #ebedef;
            font-size: 11px;
            font-weight: 700;
            color: #a1acb8;
            text-transform: uppercase;
          }

          .items-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #f0f2f4;
            font-size: 14px;
          }

          .footer-section {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
          }

          .footer-note {
            max-width: 300px;
            font-size: 12px;
            color: #a1acb8;
          }

          .totals {
            width: 280px;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
          }

          .grand-total {
            border-top: 2px solid #ebedef;
            margin-top: 10px;
            padding-top: 15px;
            font-weight: 800;
            font-size: 20px;
            color: #333;
          }

          @media print {
            body { padding: 0; }
            .invoice-container { width: 100%; }
            .items-table th { background: #f8f9fa !important; -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="brand">
              <div class="logo">R</div>
              <div class="brand-info">
                <h1>POS RFID System</h1>
                <p>Office 149, 450 South Brand Brooklyn, San Diego County, CA 91905, USA</p>
                <p>pos-rfid@support.com</p>
              </div>
            </div>
            <div class="invoice-meta">
              <h2>INVOICE #${orderId}</h2>
              <p class="meta-item">Date Created: <b>${date}</b></p>
              <p class="meta-item">Status: <b style="color: ${String(transaction.status).toLowerCase() === 'paid' ? '#71dd37' : '#ffab00'}">${String(transaction.status || 'PENDING').toUpperCase()}</b></p>
            </div>
          </div>

          <div class="divider"></div>

          <div class="info-grid">
            <div class="info-content">
              <div class="info-label">Bill To:</div>
              <p class="name">${transaction.user_name || 'Walk-in Customer'}</p>
              <p>ID: ${transaction.user_id || 'Guest'}</p>
              <p>Customer for RFID Services</p>
            </div>
            <div class="info-content" style="text-align: right;">
              <div class="info-label">Payment Information:</div>
              <p>Method: <b>${method}</b></p>
              <p>Reference: <b>${transaction.id ? String(transaction.id).slice(0, 8).toUpperCase() : 'N/A'}</b></p>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="footer-section">
            <div class="footer-note">
              <p style="font-weight: 700; color: #566a7f; margin-bottom: 10px;">POS RFID Transaction Record</p>
              <p>Generated on: ${new Date().toLocaleString('id-ID')}</p>
            </div>
            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span style="font-weight: 600;">Rp ${(subtotal || 0).toLocaleString('id-ID')}</span>
              </div>
              <div class="total-row grand-total">
                <span>GRAND TOTAL:</span>
                <span>Rp ${(transaction.total_amount || transaction.total_harga || 0).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;
};
