import { useState } from 'react';

export default function Cart({ items, onRemove, onCheckout }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paid, setPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  const subtotal = items.reduce(
    (s, it) => s + Number(it.unit_price) * Number(it.quantity || 1),
    0
  );
  const total = Math.max(subtotal - Number(discount || 0), 0);
  const change = Math.max(Number(paid || 0) - total, 0);

  const handleCheckout = () => {
    if (items.length === 0) return;
    onCheckout({
      customer_name: customerName || 'អតិថិជនទូទៅ',
      customer_phone: customerPhone,
      discount: Number(discount) || 0,
      paid: Number(paid) || total,
      payment_method: paymentMethod,
      items,
    });
  };

  return (
    <div className="cart-panel">
      <div className="section-title" style={{ margin: 0 }}>
        កន្ត្រកទំនិញ ({items.length})
      </div>

      <div className="cart-items">
        {items.length === 0 && (
          <p style={{ color: '#8a8f98', fontSize: 13 }}>មិនទាន់មានទំនិញនៅឡើយទេ</p>
        )}
        {items.map((it, idx) => (
          <div className="cart-row" key={idx}>
            <div className="desc">
              {it.description}
              <div className="sub">
                {it.quantity} x {Number(it.unit_price).toLocaleString()} ៛
              </div>
            </div>
            <div className="amount">
              {(it.unit_price * it.quantity).toLocaleString()} ៛
            </div>
            <button className="remove" onClick={() => onRemove(idx)}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="field-row">
        <label>ឈ្មោះអតិថិជន</label>
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="អតិថិជនទូទៅ"
        />
      </div>
      <div className="field-row">
        <label>លេខទូរស័ព្ទ</label>
        <input
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="012 xxx xxx"
        />
      </div>
      <div className="field-row">
        <label>វិធីបង់ប្រាក់</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="CASH">សាច់ប្រាក់</option>
          <option value="ABA">ABA / QR</option>
          <option value="CREDIT">ជំពាក់ (Credit)</option>
        </select>
      </div>
      <div className="field-row">
        <label>បញ្ចុះតម្លៃ (៛)</label>
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
      </div>
      <div className="field-row">
        <label>ប្រាក់ទទួល (៛)</label>
        <input
          type="number"
          value={paid}
          onChange={(e) => setPaid(e.target.value)}
          placeholder={String(total)}
        />
      </div>

      <div className="totals-block">
        <div className="row">
          <span>សរុបរង</span>
          <span>{subtotal.toLocaleString()} ៛</span>
        </div>
        <div className="row">
          <span>បញ្ចុះតម្លៃ</span>
          <span>-{Number(discount || 0).toLocaleString()} ៛</span>
        </div>
        <div className="row grand">
          <span>សរុប</span>
          <span>{total.toLocaleString()} ៛</span>
        </div>
        <div className="row">
          <span>ប្រាក់អាប់</span>
          <span>{change.toLocaleString()} ៛</span>
        </div>
      </div>

      <button
        className="btn btn-primary btn-block"
        style={{ marginTop: 12 }}
        disabled={items.length === 0}
        onClick={handleCheckout}
      >
        បង្កើតវិក្កយបត្រ
      </button>
    </div>
  );
}
