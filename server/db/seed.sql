-- ទិន្នន័យគំរូ (កែតម្រូវតម្លៃបានតាមចង់)

-- 1. ប៉ោតស្រោច (ជម្រើសទំហំ ធំ / កណ្តាល / តូច)
INSERT INTO products (code, name_kh, type, unit) VALUES ('BUCKET', 'ប៉ោតស្រោច', 'variant', 'ដុំ');
INSERT INTO product_variants (product_id, label, price) VALUES
 (currval('products_id_seq'), 'ធំ', 8000),
 (currval('products_id_seq'), 'កណ្តាល', 6000),
 (currval('products_id_seq'), 'តូច', 4000);

-- 2. ឆ្នាំងគុយទាវ (ស្ដង់ដារ) - លេខ 35 / 45
INSERT INTO products (code, name_kh, type, unit) VALUES ('POT_STD', 'ឆ្នាំងគុយទាវ (ស្ដង់ដារ)', 'variant', 'ដុំ');
INSERT INTO product_variants (product_id, label, price) VALUES
 (currval('products_id_seq'), '35', 25000),
 (currval('products_id_seq'), '45', 35000);

-- 3. ហឹបដែក - លេខ 15 / 25 / 35 / 45
INSERT INTO products (code, name_kh, type, unit) VALUES ('IRONBOX', 'ហឹបដែក', 'variant', 'ដុំ');
INSERT INTO product_variants (product_id, label, price) VALUES
 (currval('products_id_seq'), '15', 15000),
 (currval('products_id_seq'), '25', 22000),
 (currval('products_id_seq'), '35', 30000),
 (currval('products_id_seq'), '45', 40000);

-- 4. ជីឡាវ (ស្ដង់ដារ) - ទំហំ ធំ/តូច x កាច់/ត្រង់
INSERT INTO products (code, name_kh, type, unit, has_shape) VALUES ('ROOF_STD', 'ជីឡាវ', 'variant', 'សន្លឹក', TRUE);
INSERT INTO product_variants (product_id, label, shape, price) VALUES
 (currval('products_id_seq'), 'ធំ', 'ART', 18000),
 (currval('products_id_seq'), 'ធំ', 'STRAIGHT', 16000),
 (currval('products_id_seq'), 'តូច', 'ART', 12000),
 (currval('products_id_seq'), 'តូច', 'STRAIGHT', 10000);

-- 5. ទរទឹក (កម្ម៉ង់តាមទំហំ)
INSERT INTO products (code, name_kh, type, unit) VALUES ('GUTTER_CUSTOM', 'ទរទឹក', 'custom', 'ម');

-- 6. ហឹបកម្ម៉ង់ (កម្ម៉ង់តាមទំហំ)
INSERT INTO products (code, name_kh, type, unit) VALUES ('BOX_CUSTOM', 'ហឹបកម្ម៉ង់', 'custom', 'ដុំ');

-- 7. ជីឡាវ កម្ម៉ង់ (កម្ម៉ង់តាមទំហំ)
INSERT INTO products (code, name_kh, type, unit) VALUES ('ROOF_CUSTOM', 'ជីឡាវ កម្ម៉ង់', 'custom', 'សន្លឹក');

-- 8. ឆ្នាំងគុយទាវ កម្ម៉ង់ (កម្ម៉ង់តាមទំហំ)
INSERT INTO products (code, name_kh, type, unit) VALUES ('POT_CUSTOM', 'ឆ្នាំងគុយទាវ កម្ម៉ង់', 'custom', 'ដុំ');
