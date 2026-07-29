import { useMemo, useState } from 'react';

const SHAPE_LABEL = { ART: 'កាច់', STRAIGHT: 'ត្រង់' };

export default function VariantModal({ product, onClose, onAdd }) {
  const [shape, setShape] = useState(product.has_shape ? 'ART' : null);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);

  const options = useMemo(() => {
    if (!product.has_shape) return product.variants;
    return product.variants.filter((v) => v.shape === shape);
  }, [product, shape]);

  const handleAdd = () => {
    if (!selected) return;
    const label = product.has_shape
      ? `${selected.label} - ${SHAPE_LABEL[selected.shape]}`
      : selected.label;
    onAdd({
      product_id: product.id,
      description: `${product.name_kh} (${label})`,
      unit_price: Number(selected.price),
      quantity: Number(qty) || 1,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>{product.name_kh}</h2>

        {product.has_shape && (
          <div className="shape-toggle">
            {['ART', 'STRAIGHT'].map((s) => (
              <button
                key={s}
                className={shape === s ? 'active' : ''}
                onClick={() => {
                  setShape(s);
                  setSelected(null);
                }}
              >
                {SHAPE_LABEL[s]}
              </button>
            ))}
          </div>
        )}

        <div className="section-title" style={{ margin: 0 }}>
          ជម្រើសទំហំ
        </div>
        <div className="variant-options">
          {options.map((v) => (
            <div
              key={v.id}
              className={`variant-btn ${selected?.id === v.id ? 'selected' : ''}`}
              onClick={() => setSelected(v)}
            >
              {v.label}
              <span className="price">{Number(v.price).toLocaleString()} ៛</span>
            </div>
          ))}
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

        <div className="btn-row">
          <button className="btn btn-outline" onClick={onClose}>
            បោះបង់
          </button>
          <button
            className="btn btn-primary btn-block"
            disabled={!selected}
            onClick={handleAdd}
          >
            បញ្ចូលក្នុងកន្ត្រក
          </button>
        </div>
      </div>
    </div>
  );
}
