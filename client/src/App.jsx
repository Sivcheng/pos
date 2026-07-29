import { useEffect, useState } from 'react';
import ProductGrid from './components/ProductGrid';
import VariantModal from './components/VariantModal';
import CustomModal from './components/CustomModal';
import Cart from './components/Cart';
import InvoiceView from './components/InvoiceView';
import { getProducts, createOrder, getOrders } from './api';
import { exportOrdersListToExcel } from './utils/excelExport';

export default function App() {
  const [products, setProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() =>
        setError(
          'មិនអាចភ្ជាប់ទៅ server/database បានទេ។ សូមប្រាកដថា backend កំពុងដំណើរការ។'
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const handleAddItem = (item) => setCartItems((prev) => [...prev, item]);
  const handleRemoveItem = (idx) =>
    setCartItems((prev) => prev.filter((_, i) => i !== idx));

  const handleCheckout = async (payload) => {
    try {
      const created = await createOrder(payload);
      setOrder(created);
      setCartItems([]);
    } catch (err) {
      alert(err?.response?.data?.error || 'មានបញ្ហាក្នុងការបង្កើតវិក្កយបត្រ');
    }
  };

  const handleExportHistory = async () => {
    const orders = await getOrders();
    exportOrdersListToExcel(orders);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>ប្រព័ន្ធលក់ទំនិញ (POS) — សម្ភារៈដែក</h1>
          <div className="tagline">
            ប៉ោតស្រោច · ឆ្នាំងគុយទាវ · ហឹបដែក · ជីឡាវ · ទរទឹក
          </div>
        </div>
      </header>
      <div className="corrugated-strip" />

      <div className="toolbar">
        <button className="btn btn-outline" onClick={handleExportHistory}>
          📊 Export ប្រវត្តិលក់ជា Excel
        </button>
      </div>

      <div className="main-layout">
        <div>
          {loading && <p>កំពុងផ្ទុកទិន្នន័យ...</p>}
          {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
          {!loading && !error && (
            <ProductGrid products={products} onSelect={setActiveProduct} />
          )}
        </div>

        <Cart
          items={cartItems}
          onRemove={handleRemoveItem}
          onCheckout={handleCheckout}
        />
      </div>

      {activeProduct && activeProduct.type === 'variant' && (
        <VariantModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAdd={handleAddItem}
        />
      )}
      {activeProduct && activeProduct.type === 'custom' && (
        <CustomModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAdd={handleAddItem}
        />
      )}

      {order && (
        <InvoiceView
          order={order}
          onClose={() => setOrder(null)}
          onNewSale={() => setOrder(null)}
        />
      )}
    </div>
  );
}
