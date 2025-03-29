import React, { useEffect, useState } from "react";
import { Document, Page, Text, View, Image, PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Button, message } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import { GetReciept } from "../../../services/PaymentService";
import NoData from "../../NoData";
import LoadingSpinner from "../../LoadingSpinner";
import ISMALOGO from '../../../assets/ISMALOGO.png';
import styles from "./CommonStyle";

const ReceiptDocument = ({ receiptData }) => (
  <Document key={receiptData.receiptNumber}>
    <Page id="p_1" size="A4" wrap={false} style={styles.page}>
      <View style={styles.pageInner1}>
        <View style={styles.pageInner}>
          <View style={[styles.bullet, styles.bulletTopLeft]}><Text >.</Text></View>
          <View style={[styles.bullet, styles.bulletTopRight]}><Text>.</Text></View>
          <View style={[styles.bullet, styles.bulletBottomLeft]}><Text>.</Text></View>
          <View style={[styles.bullet, styles.bulletBottomRight]}><Text>.</Text></View>
          <View style={styles.logoContainer}>
            <View style={styles.leftHeader}>
              <Text >REPUBLIC OF IRAQ</Text>
              <Text >MINISTRY OF TRANSPORT</Text>
              <Text >IRAQ SUPREME MARITIME COMMISION</Text>
            </View>
            <View style={styles.centerHeader}>
              <Image src={`${window.location.origin}${ISMALOGO}`} style={styles.logo} />
              <Text style={styles.title}>ايصال سداد</Text>
              <Text style={[styles.title, { color: 'red' }]}>Payment Reciept</Text>

            </View>
            <View style={styles.rightHeader}>
              <Text >جمهورية العراق</Text>
              <Text >وزارة النقل</Text>
              <Text >الهيئة البحرية العراقية العليا</Text>
            </View>
          </View>
          <View style={styles.section}>
            <View style={[styles.row, { paddingLeft: 10, fontSize: 14, fontWeight: '600' }]} >
              <Text>Receipt Number :</Text>
              <Text >{receiptData.receiptNumber}</Text>
            </View>
            <View style={[styles.row, { paddingLeft: 20, fontSize: 14, fontWeight: '600' }]} >
              <Text >Transaction Date :</Text>
              <Text >{receiptData.receiptDate}</Text>
            </View>
          </View>



          <View style={styles.tableContainer}>
            <View style={styles.row}><Text style={styles.label}>Vessel’s Agent :</Text><Text style={styles.value}>{receiptData.invoice.agentName}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Invoice NO:</Text><Text style={styles.value}>{receiptData.invoice.invoiceNumber}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Vessel Name :</Text><Text style={styles.value}>{receiptData.invoice.vesselName}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Amount Paid :</Text><Text style={styles.value}>${receiptData.totalAmount}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Amount in Words :</Text><Text style={styles.value}>{receiptData.amountInWord} Only</Text></View>
            <View style={styles.row}><Text style={styles.label}>Port :</Text><Text style={styles.value}>{receiptData.invoice.portName}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Payment method :</Text><Text style={styles.value}>Wire transfer</Text></View>
            <View style={styles.row}><Text style={styles.label}>status :</Text><Text style={[styles.value, { color: (receiptData.isRefunded ? 'red' : 'green') }]}>{receiptData.isRefunded ? 'refunded' : "paid"}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Card Payment Transaction Reference :</Text><Text style={styles.value}>N/A</Text></View>
          </View>
          <View style={styles.footer}>
            <Text>This is a system-generated receipt . no signature is required. </Text>

          </View>

          <View style={styles.footer1}>
            <Text>Thank you for your payment!</Text>
          </View>
        </View>
      </View>

    </Page>
  </Document>
);

const Receipt = ({ transactionDetialId }) => {
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecieptData();

  }, []);

  const fetchRecieptData = async () => {
    try {
      setLoading(true);
      const data = await GetReciept(transactionDetialId);
      setReceiptData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Error fetching receipt data");
    }
  };

  if (!receiptData) return <NoData />;
  if (loading) return <LoadingSpinner loading={loading} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <PDFViewer key={`${receiptData.receiptNumber}`} showToolbar={false} style={{ width: '100%', minHeight: '500px' }}>
        <ReceiptDocument receiptData={receiptData} />
      </PDFViewer>
      <PDFDownloadLink data-testid="download_reciept" document={<ReceiptDocument receiptData={receiptData} />} fileName="payment_receipt.pdf">
        {({ loading }) => <Button type="primary" icon={<FilePdfOutlined />}>{loading ? "Loading document..." : "Download Receipt"}</Button>}
      </PDFDownloadLink>

    </div>
  );
};

export default Receipt;