import { useMemo, useState } from 'react';

export default function CustomModal({ product, onClose, onAdd }) {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [thickness, setThickness] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState(1);

  const hasArea = Number(length) > 0 && Number(width) > 0;

  // ប្រសិនបើមានទាំងប្រវែងនិងទទឹង -> គណនាតម្លៃតាមផ្ទៃ (ប្រវែង x ទទឹង x តម្លៃ/ឯកតា)
  // ប្រសិនបើគ្មាន -> ចាត់ទុកតម្លៃដែលបញ្ចូលជាតម្លៃចុងក្រោយសម្រាប់មួយឯកតា
  const unitPrice = useMemo(() => {
    if (!price) return 0;
    return hasArea ? Number(length) * Number(width) * Number(price) : Number(price);
  }, [length, width, price, hasArea]);

  const lineTotal = unitPrice * (Number(qty) || 1);

  const canAdd = Number(price) > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    const dims = hasArea ? `ប្រវែង ${length}ម x ទទឹង ${width}ម` : '';
    const thick = thickness ? ` កម្រាស់ដែក ${thickness}` : '';
    const desc = `${product.name_kh}${dims ? ' - ' + dims : ''}${thick}`;
    onAdd({
      product_id: product.id,
      description: desc,
      length_m: hasArea ? Number(length) : null,
      width_m: hasArea ? Number(width) : null,
      thickness: thickness || null,
      unit_price: unitPrice,
      quantity: Number(qty) || 1,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>{product.name_kh}</h2>

        <div className="field-row">
          <label>ប្រវែង (ម៉ែត្រ)</label>
          <input
            type="number"
            step="0.01"
            placeholder="ឧ. 3"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        </div>

        <div className="field-row">
          <label>ទទឹង (ម៉ែត្រ)</label>
          <input
            type="number"
            step="0.01"
            placeholder="ឧ. 0.5"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
        </div>

        <div className="field-row">
          <label>កម្រាស់ដែក</label>
          <input
            type="text"
            placeholder="ឧ. 0.5mm / 0.8mm"
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
          />
        </div>

        <div className="field-row">
          <label>
            {hasArea ? 'តម្លៃក្នុងមួយម៉ែត្រការ៉េ (៛)' : 'តម្លៃសរុបក្នុងមួយឯកតា (៛)'}
          </label>
          <input
            type="number"
            placeholder="ឧ. 15000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="field-row">
          <label>ចំនួន</label>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
        </div>

        <div className="calc-preview">
          តម្លៃសរុប
          <div className="value">{lineTotal.toLocaleString()} ៛</div>
        </div>

        <div className="btn-row">
          <button className="btn btn-outline" onClick={onClose}>
            បោះបង់
          </button>
          <button
            className="btn btn-primary btn-block"
            disabled={!canAdd}
            onClick={handleAdd}
          >
            បញ្ចូលក្នុងកន្ត្រក
          </button>
        </div>
      </div>
    </div>
  );
}
