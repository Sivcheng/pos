-- ជា Schema សម្រាប់ប្រព័ន្ធ POS លក់សម្ភារៈដែក
-- Encoding: UTF-8 (គាំទ្រអក្សរខ្មែរពេញលេញ)

DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- ប្រភេទផលិតផល
-- type = 'variant'  -> ជ្រើសរើសពីជម្រើសដែលមានស្រាប់ (ទំហំ/លេខ)
-- type = 'custom'   -> វាយបញ្ចូលទំហំ/តម្លៃដោយផ្ទាល់ (ប្រវែង, ទទឹង, កម្រាស់ដែក, តម្លៃ)
CREATE TABLE products (
    id          SERIAL PRIMARY KEY,
    code        VARCHAR(30) UNIQUE NOT NULL,
    name_kh     VARCHAR(150) NOT NULL,
    type        VARCHAR(10) NOT NULL CHECK (type IN ('variant', 'custom')),
    unit        VARCHAR(30) DEFAULT 'ដុំ',
    has_shape   BOOLEAN DEFAULT FALSE,     -- ជីឡាវ: មានជម្រើស កាច់ / ត្រង់
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ជម្រើសនីមួយៗសម្រាប់ផលិតផលប្រភេទ variant
-- label = ស្លាកជម្រើស (ឧ. "ធំ", "35", "45")
-- shape = 'ART' (កាច់) ឬ 'STRAIGHT' (ត្រង់) សម្រាប់ជីឡាវ, NULL បើគ្មាន
CREATE TABLE product_variants (
    id          SERIAL PRIMARY KEY,
    product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    label       VARCHAR(50) NOT NULL,
    shape       VARCHAR(10) CHECK (shape IN ('ART', 'STRAIGHT') OR shape IS NULL),
    price       NUMERIC(12,2) NOT NULL DEFAULT 0,
    is_active   BOOLEAN DEFAULT TRUE,
    UNIQUE(product_id, label, shape)
);

-- វិក្កយបត្រ / Invoice
CREATE TABLE orders (
    id              SERIAL PRIMARY KEY,
    invoice_no      VARCHAR(30) UNIQUE NOT NULL,
    customer_name   VARCHAR(150) DEFAULT 'អតិថិជនទូទៅ',
    customer_phone  VARCHAR(30),
    subtotal        NUMERIC(14,2) NOT NULL DEFAULT 0,
    discount        NUMERIC(14,2) NOT NULL DEFAULT 0,
    total           NUMERIC(14,2) NOT NULL DEFAULT 0,
    paid            NUMERIC(14,2) NOT NULL DEFAULT 0,
    change_due      NUMERIC(14,2) NOT NULL DEFAULT 0,
    payment_method  VARCHAR(20) DEFAULT 'CASH',
    cashier         VARCHAR(100),
    status          VARCHAR(20) DEFAULT 'COMPLETED',
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ធាតុនីមួយៗក្នុងវិក្កយបត្រ
CREATE TABLE order_items (
    id            SERIAL PRIMARY KEY,
    order_id      INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id    INTEGER REFERENCES products(id),
    description   VARCHAR(255) NOT NULL,   -- ឧ. "ប៉ោតស្រោច - ធំ" ឬ "ទរទឹក 3ម x 0.5ម កម្រាស់ 0.5mm"
    length_m      NUMERIC(10,3),
    width_m       NUMERIC(10,3),
    thickness     VARCHAR(30),
    unit_price    NUMERIC(12,2) NOT NULL,
    quantity      NUMERIC(10,2) NOT NULL DEFAULT 1,
    line_total    NUMERIC(14,2) NOT NULL
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_variants_product_id ON product_variants(product_id);
