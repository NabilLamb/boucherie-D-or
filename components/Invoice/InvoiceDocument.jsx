// components/Invoice/InvoiceDocument.jsx

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 40,
    backgroundColor: "#ffffff",
    color: "#1a1a1a",
  },
  // Header row with logo + invoice info
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 45,
    objectFit: "contain",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginVertical: 16,
  },
  // Addresses
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  addressBlock: {
    width: "45%",
  },
  addressLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    color: "#111827",
  },
  addressText: {
    fontSize: 9,
    color: "#4b5563",
    lineHeight: 1.6,
    marginBottom: 1,
  },
  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: "8 10",
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: "row",
    padding: "7 10",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  colItem:     { width: "40%", fontFamily: "Helvetica-Bold", fontSize: 9 },
  colPrice:    { width: "20%", textAlign: "right", fontFamily: "Helvetica-Bold", fontSize: 9 },
  colQty:      { width: "20%", textAlign: "center", fontFamily: "Helvetica-Bold", fontSize: 9 },
  colTotal:    { width: "20%", textAlign: "right", fontFamily: "Helvetica-Bold", fontSize: 9 },
  colItemVal:  { width: "40%", fontSize: 9, color: "#374151" },
  colPriceVal: { width: "20%", textAlign: "right", fontSize: 9, color: "#374151" },
  colQtyVal:   { width: "20%", textAlign: "center", fontSize: 9, color: "#374151" },
  colTotalVal: { width: "20%", textAlign: "right", fontSize: 9, color: "#374151" },
  // Totals
  totalsSection: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    width: "45%",
    paddingVertical: 3,
  },
  totalLabel: {
    flex: 1,
    fontSize: 9,
    color: "#6b7280",
    textAlign: "right",
    paddingRight: 12,
  },
  totalValue: {
    width: 70,
    fontSize: 9,
    color: "#374151",
    textAlign: "right",
  },
  grandTotalRow: {
    flexDirection: "row",
    width: "45%",
    paddingVertical: 6,
    borderTopWidth: 1.5,
    borderTopColor: "#1a1a1a",
    marginTop: 4,
  },
  grandTotalLabel: {
    flex: 1,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    paddingRight: 12,
  },
  grandTotalValue: {
    width: 70,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
});

const InvoiceDocument = ({ order, currency = "€" }) => {
  const address = order.address || {};
  const items = order.items || [];

  // FIX: use productSnapshot not product
  const subtotal = items.reduce((sum, item) => {
    const snap = item.productSnapshot || {};
    const price = snap.offerPrice || snap.price || 0;
    const qty = item.quantity || 1;
    return sum + price * qty;
  }, 0);

  const shipping = 0;
  // Use order.amount if available (server-calculated), fall back to subtotal
  const grandTotal = order.amount || subtotal + shipping;

  const invoiceId = order._id?.toString().slice(-6).toUpperCase() || "N/A";
  const date = new Date(order.date || order.createdAt || Date.now())
    .toLocaleDateString("en-GB");

  const companyName = "Boucherie D'or";
  const companyPhone = "+33 4 90 62 49 06";
  const companyEmail = "contact.boucheriedor@gmail.com";
  const companyAddress = "ZA Jonquier Morelle, Lavoisier Avenue\n84850 Camaret-sur-Aigues";

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header: Logo left, Invoice info right */}
        <View style={styles.headerRow}>
          {/* Try to load logo — if it fails react-pdf skips it gracefully */}
          <Image
            style={styles.logo}
            src="/logo.png"
          />
          <View style={styles.headerRight}>
            <Text style={styles.title}>Invoice</Text>
            <Text style={styles.subtitle}>Date: {date}</Text>
            <Text style={styles.subtitle}>Invoice #: {invoiceId}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Addresses */}
        <View style={styles.addressRow}>
          {/* From */}
          <View style={styles.addressBlock}>
            <Text style={styles.addressLabel}>{companyName}</Text>
            <Text style={styles.addressText}>{companyPhone}</Text>
            <Text style={styles.addressText}>{companyEmail}</Text>
            <Text style={styles.addressText}>{companyAddress}</Text>
          </View>

          {/* To — FIX: correct Address model fields */}
          <View style={styles.addressBlock}>
            <Text style={styles.addressLabel}>Billed To</Text>
            {address.fullName ? (
              <Text style={styles.addressText}>{address.fullName}</Text>
            ) : null}
            {address.area ? (
              <Text style={styles.addressText}>{address.area}</Text>
            ) : null}
            {address.city ? (
              <Text style={styles.addressText}>
                {address.city}{address.zipcode ? `, ${address.zipcode}` : ""}
              </Text>
            ) : null}
            {address.state ? (
              <Text style={styles.addressText}>{address.state}</Text>
            ) : null}
            {address.phoneNumber ? (
              <Text style={styles.addressText}>{address.phoneNumber}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Table header */}
        <View style={styles.tableHeader}>
          <Text style={styles.colItem}>Item</Text>
          <Text style={styles.colPrice}>Price</Text>
          <Text style={styles.colQty}>Quantity</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>

        {/* Table rows — FIX: use productSnapshot */}
        {items.map((item, index) => {
          const snap = item.productSnapshot || {};
          const price = snap.offerPrice || snap.price || 0;
          const qty = item.quantity || 1;
          const unit = snap.unit || "";
          const lineTotal = price * qty;

          return (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colItemVal}>
                {snap.name || "Unknown Product"}
              </Text>
              <Text style={styles.colPriceVal}>
                {currency}{price.toFixed(2)}
              </Text>
              <Text style={styles.colQtyVal}>
                {qty}{unit ? ` ${unit}` : ""}
              </Text>
              <Text style={styles.colTotalVal}>
                {currency}{lineTotal.toFixed(2)}
              </Text>
            </View>
          );
        })}

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{currency}{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping:</Text>
            <Text style={styles.totalValue}>Free</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total:</Text>
            <Text style={styles.grandTotalValue}>{currency}{grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{companyName} — Thank you for your business!</Text>
          <Text>For questions, contact {companyEmail}</Text>
        </View>

      </Page>
    </Document>
  );
};

export default InvoiceDocument;