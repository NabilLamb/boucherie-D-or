"use client";
import React, { useState, useEffect } from "react";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { getImageSource } from "@/utils/images";
import { assets } from "@/assets/assets";

const COMPANY_INFO = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || "Boucherie D'or",
  logo: process.env.NEXT_PUBLIC_COMPANY_LOGO || assets.logo,
  address:
    process.env.NEXT_PUBLIC_COMPANY_ADDRESS ||
    "ZA Jonquier Morelle, Lavoisier Avenue, 84850 Camaret-sur-Aigues",
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "+33 4 90 62 49 06",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "contact@boucheriedor.com",
};

const getAbsoluteUrl = (path) => {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${path}`;
};

const currency = process.env.NEXT_PUBLIC_CURRENCY || "€";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2",
      fontWeight: "normal",
      format: "woff2",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 20,
  },
  container: {
    flext: 1,
    padding: 20,
  },
  logo: {
    width: 50,
    height: 50,
    objectFit: "contain",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  table: {
    width: "100%",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
  },
  tableCol: {
    width: "25%",
    paddingRight: 8,
  },
  totalContainer: {
    width: "50%",
    marginLeft: "auto",
  },
});

const InvoicePDF = ({ order = {}, companyInfo = COMPANY_INFO }) => {
  const safeOrder = {
    ...order,
    _id: order._id || 'N/A',
    date: order.date || Date.now(),
    amount: order.amount || 0,
    items: order.items || [],
    address: order.address || {
      fullName: 'Customer Name Not Available',
      address: 'Address Not Available',
      city: '',
      postalCode: '',
      phone: ''
    }
  };

  const logoUrl = getAbsoluteUrl(companyInfo.logo);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Invoice</Text>
            <Text style={{ fontSize: 10 }}>
              Date: {new Date(safeOrder.date).toLocaleDateString("fr-FR")}
            </Text>
            <Text style={{ fontSize: 10 }}>
              Invoice #: {safeOrder._id.toString().slice(-6).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={{ width: "45%" }}>
            <Text style={{ fontWeight: "bold" }}>{companyInfo.name}</Text>
            <Text>{companyInfo.phone}</Text>
            <Text>{companyInfo.email}</Text>
            <Text>{companyInfo.address}</Text>
          </View>

          <View style={{ width: "45%" }}>
            <Text style={{ fontWeight: "bold" }}>Billed To</Text>
            <Text>{safeOrder.address.fullName}</Text>
            <Text>{safeOrder.address.address}</Text>
            <Text>
              {safeOrder.address.city}, {safeOrder.address.postalCode}
            </Text>
            <Text>{safeOrder.address.phone}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCol, { fontWeight: "bold" }]}>Item</Text>
            <Text style={[styles.tableCol, { fontWeight: "bold" }]}>Price</Text>
            <Text style={[styles.tableCol, { fontWeight: "bold" }]}>Quantity</Text>
            <Text style={[styles.tableCol, { fontWeight: "bold" }]}>Total</Text>
          </View>

          {safeOrder.items.map((item, index) => {
            const snapshot = item.productSnapshot || {};
            const price = snapshot.offerPrice || snapshot.price || 0;
            const quantity = item.quantity || 0;
            
            return (
              <View key={`item-${index}`} style={styles.tableRow}>
                <Text style={styles.tableCol}>
                  {snapshot.name || "Product Name"}
                </Text>
                <Text style={styles.tableCol}>
                  {currency}
                  {price.toFixed(2)}
                </Text>
                <Text style={styles.tableCol}>
                  {quantity} {snapshot.unit || "unit"}
                </Text>
                <Text style={styles.tableCol}>
                  {currency}
                  {(price * quantity).toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.totalContainer}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text>Subtotal:</Text>
            <Text>
              {currency}
              {safeOrder.amount.toFixed(2)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text>Shipping:</Text>
            <Text>{currency}0.00</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderTopWidth: 1,
              borderTopColor: "#ccc",
              marginTop: 10,
              marginRight: 5,
              paddingTop: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Grand Total:</Text>
            <Text style={{ fontWeight: "bold" }}>
              {currency}
              {safeOrder.amount.toFixed(2)}
            </Text>
          </View>
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#ccc",
            paddingTop: 20,
            marginTop: 40,
            textAlign: "center",
          }}
        >
          <Text style={{ fontSize: 10 }}>
            {companyInfo.name} - Thank you for your business!
          </Text>
          <Text style={{ fontSize: 10 }}>
            For questions, contact {companyInfo.email}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const Invoice = ({ order }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDownload = async () => {
    if (!order) return;
    
    setIsLoading(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const { saveAs } = await import('file-saver');
      
      const instance = pdf(
        <InvoicePDF order={order} companyInfo={COMPANY_INFO} />
      );
      
      const blob = await instance.toBlob();
      saveAs(blob, `invoice-${order._id?.toString().slice(-6) || 'unknown'}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="text-center text-gray-500 p-8">
        No order data available
      </div>
    );
  }

  return (
    <div className="p-6">
      {isMounted && (
        <div className="mb-4 print:hidden" style={{ height: "600px" }}>
          <PDFViewer width="100%" height="100%">
            <InvoicePDF order={order} companyInfo={COMPANY_INFO} />
          </PDFViewer>
        </div>
      )}

      <button
        onClick={handleDownload}
        disabled={isLoading}
        className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Generating PDF...' : 'Download PDF'}
      </button>
    </div>
  );
};

export default Invoice;