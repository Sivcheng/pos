import { useState } from 'react';
import { exportInvoiceToExcel } from '../utils/excelExport';

export default function InvoiceView({ order, onClose, onNewSale }) {
  const [mode, setMode] = useState('invoice'); // invoice | receipt

  const handlePrint = () => window.print();

  return (
    <div className="invoice-overlay">
      <div style={{ width: '100%', maxWidth: 560 }}>
        <div className="doc-actions no-print" style={{ marginBottom: 10 }}>
          <button
            className={`btn ${mode === 'invoice' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setMode('invoice')}
          >
            មើលជា Invoice
          </button>
          <button
            className={`btn ${mode === 'receipt' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setMode('receipt')}
          >
            មើលជា Receipt
          </button>
        </div>

        <div id="printable-area" className="invoice-doc">
          {mode === 'invoice' ? (
            <InvoiceDoc order={order} />
          ) : (
            <ReceiptDoc order={order} />
          )}
        </div>

        <div className="doc-actions no-print">
          <button className="btn btn-green" onClick={handlePrint}>
            🖨 ព្រីន {mode === 'invoice' ? 'Invoice' : 'Receipt'}
          </button>
          <button
            className="btn btn-outline"
            onClick={() => exportInvoiceToExcel(order)}
          >
            📊 Export Excel
          </button>
          <button className="btn btn-primary" onClick={onNewSale}>
            លក់ថ្មី
          </button>
          <button className="btn btn-outline" onClick={onClose}>
            បិទ
          </button>
        </div>
      </div>
    </div>
  );
}

function InvoiceDoc({ order }) {
  return (
    <>
      <div className="doc-header">
        <div>
          <h2>ហាងលក់សម្ភារៈដែក</h2>
          <div style={{ fontSize: 12, color: '#545b66' }}>
            អាសយដ្ឋាន៖ .................................<br />
            ទូរស័ព្ទ៖ .................................
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 13 }}>
          <strong>INVOICE</strong>
          <div>លេខ: {order.invoice_no}</div>
          <div>{new Date(order.created_at).toLocaleString('km-KH')}</div>
        </div>
      </div>

      <div style={{ fontSize: 13, marginBottom: 10 }}>
        អតិថិជន: <strong>{order.customer_name}</strong>
        {order.customer_phone ? ` — ${order.customer_phone}` : ''}
      </div>

      <table>
        <thead>
          <tr>
            <th>ល.រ</th>
            <th>បរិយាយទំនិញ</th>
            <th>ចំនួន</th>
            <th>តម្លៃឯកតា</th>
            <th>សរុប</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((it, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{it.description}</td>
              <td>{it.quantity}</td>
              <td>{Number(it.unit_price).toLocaleString()}</td>
              <td>{(it.unit_price * it.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="doc-totals">
        <div className="row">
          <span>សរុបរង</span>
          <span>{Number(order.subtotal).toLocaleString()} ៛</span>
        </div>
        <div className="row">
          <span>បញ្ចុះតម្លៃ</span>
          <span>-{Number(order.discount).toLocaleString()} ៛</span>
        </div>
        <div className="row grand">
          <span>សរុបចុងក្រោយ</span>
          <span>{Number(order.total).toLocaleString()} ៛</span>
        </div>
        <div className="row">
          <span>ប្រាក់ទទួល</span>
          <span>{Number(order.paid).toLocaleString()} ៛</span>
        </div>
        <div className="row">
          <span>ប្រាក់អាប់</span>
          <span>{Number(order.change_due).toLocaleString()} ៛</span>
        </div>
      </div>

      <p style={{ marginTop: 24, fontSize: 12, color: '#545b66' }}>
        សូមអរគុណសម្រាប់ការគាំទ្រ!
      </p>
    </>
  );
}

function ReceiptDoc({ order }) {
  return (
    <div className="receipt-narrow" style={{ fontSize: 12 }}>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <strong style={{ fontSize: 15 }}>ហាងលក់សម្ភារៈដែក</strong>
        <div>ទូរស័ព្ទ៖ .................</div>
      </div>
      <div>លេខ: {order.invoice_no}</div>
      <div>{new Date(order.created_at).toLocaleString('km-KH')}</div>
      <div>អតិថិជន: {order.customer_name}</div>
      <hr />
      {order.items.map((it, idx) => (
        <div key={idx} style={{ marginBottom: 4 }}>
          <div>{it.description}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              {it.quantity} x {Number(it.unit_price).toLocaleString()}
            </span>
            <span>{(it.unit_price * it.quantity).toLocaleString()}</span>
          </div>
        </div>
      ))}
      <hr />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>សរុបរង</span>
        <span>{Number(order.subtotal).toLocaleString()}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>បញ្ចុះតម្លៃ</span>
        <span>-{Number(order.discount).toLocaleString()}</span>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        <span>សរុប</span>
        <span>{Number(order.total).toLocaleString()} ៛</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>ប្រាក់ទទួល</span>
        <span>{Number(order.paid).toLocaleString()}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>ប្រាក់អាប់</span>
        <span>{Number(order.change_due).toLocaleString()}</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        សូមអរគុណ! សូមអញ្ជើញមកម្ដងទៀត
      </div>
    </div>
  );
}
