// components/DownloadInvoiceButton.jsx

"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Download } from "react-feather";
import InvoiceDocument from "./Invoice/InvoiceDocument";

const DownloadInvoiceButton = ({ order, currency = "€" }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const blob = await pdf(
        <InvoiceDocument order={order} currency={currency} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const invoiceId = order._id?.toString().slice(-6).toUpperCase() || "invoice";
      link.href = url;
      link.download = `boucherie-dor-invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[INVOICE_DOWNLOAD_ERROR]", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-60 w-full"
    >
      <Download size={16} className={loading ? "animate-bounce" : ""} />
      {loading ? "Generating..." : "Download Invoice"}
    </button>
  );
};

export default DownloadInvoiceButton;
