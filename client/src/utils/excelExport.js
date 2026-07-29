import * as XLSX from 'xlsx';

// XLSX/SheetJS stores strings as UTF-8 internally, so Khmer Unicode text
// exports correctly. Khmer glyphs will render properly in Excel as long as
// the viewer's system/cell font supports Khmer script (e.g. Khmer OS, Leelawadee UI,
// or Noto Sans Khmer) -- widen the columns and pick a Khmer-capable font in Excel if needed.
export function exportInvoiceToExcel(order) {
  const header = [
    ['វិក្កយបត្រលក់ទំនិញ'],
    [`លេខវិក្កយបត្រ: ${order.invoice_no}`],
    [`ថ្ងៃខែ: ${new Date(order.created_at).toLocaleString('km-KH')}`],
    [`អតិថិជន: ${order.customer_name}${order.customer_phone ? ' (' + order.customer_phone + ')' : ''}`],
    [],
    ['ល.រ', 'បរិយាយទំនិញ', 'ចំនួន', 'តម្លៃឯកតា', 'តម្លៃសរុប'],
  ];

  const rows = order.items.map((it, idx) => [
    idx + 1,
    it.description,
    Number(it.quantity),
    Number(it.unit_price),
    Number(it.unit_price) * Number(it.quantity),
  ]);

  const footer = [
    [],
    ['', '', '', 'សរុបរង', Number(order.subtotal)],
    ['', '', '', 'បញ្ចុះតម្លៃ', Number(order.discount)],
    ['', '', '', 'សរុបចុងក្រោយ', Number(order.total)],
  ];

  const sheetData = [...header, ...rows, ...footer];
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 42 },
    { wch: 10 },
    { wch: 14 },
    { wch: 14 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoice');
  XLSX.writeFile(workbook, `${order.invoice_no}.xlsx`, { bookType: 'xlsx' });
}

export function exportOrdersListToExcel(orders) {
  const header = [
    ['លេខវិក្កយបត្រ', 'ថ្ងៃខែ', 'អតិថិជន', 'សរុប', 'វិធីបង់ប្រាក់'],
  ];
  const rows = orders.map((o) => [
    o.invoice_no,
    new Date(o.created_at).toLocaleString('km-KH'),
    o.customer_name,
    Number(o.total),
    o.payment_method,
  ]);
  const worksheet = XLSX.utils.aoa_to_sheet([...header, ...rows]);
  worksheet['!cols'] = [
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 14 },
    { wch: 14 },
  ];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
  XLSX.writeFile(workbook, `orders-${Date.now()}.xlsx`, { bookType: 'xlsx' });
}
