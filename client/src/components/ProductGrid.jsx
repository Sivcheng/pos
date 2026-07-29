export default function ProductGrid({ products, onSelect }) {
  return (
    <div>
      <div className="section-title">ជ្រើសរើសទំនិញ</div>
      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card" onClick={() => onSelect(p)}>
            <div className="icon-bar" />
            <div className="name">{p.name_kh}</div>
            <span className="tag">
              {p.type === 'variant' ? 'ជ្រើសរើសទំហំ' : 'វាយបញ្ចូលទំហំ'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
