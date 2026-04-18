const PDFDocument = require('pdfkit');

const generateInvoicePDF = (invoice, res) => {
  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=invoice-${invoice._id}.pdf`
  );

  doc.pipe(res);

  // 🧾 TITLE
  doc.fontSize(20).text('INVOICE', { align: 'center' });

  doc.moveDown();

  // 👤 CUSTOMER
  doc.fontSize(12).text(`Customer: ${invoice.customerName}`);
  doc.text(`Date: ${new Date(invoice.createdAt).toLocaleString()}`);

  doc.moveDown();

  // 📦 ITEMS
  doc.text('Items:');

  invoice.items.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.title} | Qty: ${item.quantity} | Price: ₹${item.price} | Total: ₹${item.total}`
    );
  });

  doc.moveDown();

  // 💰 TOTAL
  doc.text(`Subtotal: ₹${invoice.subtotal}`);
  doc.text(`Tax: ₹${invoice.tax}`);
  doc.text(`Total: ₹${invoice.totalAmount}`);

  doc.end();
};

module.exports = generateInvoicePDF;