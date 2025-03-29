import React, { useState } from 'react';
import { Document, Page, Text, View, Image, StyleSheet, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { Button, Modal } from 'antd';
import ISMALOGO from '../../../assets/ISMALOGO.png';
import CommonStyle from './CommonStyle';

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
  header: { textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#000' },
  table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#000', marginBottom: 20 },
  row: { flexDirection: 'row' },
  cell: { borderWidth: 1, color: '#000', padding: 8, fontSize: 13, flexGrow: 1, textAlign: 'center', width: '16.66%' },
  bold: { fontWeight: '600', color: '#000', textAlign: 'center' },
  total: { fontWeight: 'bold', fontSize: 14, marginTop: 10, textAlign: 'right' },
  twoColumn: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { width: '48%' },
  contactInfo: { fontSize: 14 },
  amountInWords: { fontSize: 14, marginTop: 5 },
  footer: { border: '1px solid #000', textAlign: "center", fontSize: 13, margin: '25 0', padding: 10 },
});

const InvoicePage = ({ invoiceData }) => (
  <Document key={Math.random()}>
    <Page key={Math.random()} id='p_0' size="A4" style={CommonStyle.page}>
      <View style={CommonStyle.pageInner1}>
        <View style={CommonStyle.pageInner}>
          <View style={[CommonStyle.bullet, CommonStyle.bulletTopLeft]}><Text >.</Text></View>
          <View style={[CommonStyle.bullet, CommonStyle.bulletTopRight]}><Text>.</Text></View>
          <View style={[CommonStyle.bullet, CommonStyle.bulletBottomLeft]}><Text>.</Text></View>
          <View style={[CommonStyle.bullet, CommonStyle.bulletBottomRight]}><Text>.</Text></View>
          <View style={CommonStyle.logoContainer}>
            <View style={CommonStyle.leftHeader}>
              <Text >REPUBLIC OF IRAQ</Text>
              <Text >MINISTRY OF TRANSPORT</Text>
              <Text >IRAQ SUPREME MARITIME COMMISION</Text>
            </View>
            <View style={CommonStyle.centerHeader}>
              <Image src={`${window.location.origin}${ISMALOGO}`} style={CommonStyle.logo} />
            </View>
            <View style={CommonStyle.rightHeader}>
              <Text >جمهورية العراق</Text>
              <Text >وزارة النقل</Text>
              <Text >الهيئة البحرية العراقية العليا</Text>
            </View>
          </View>

          <View style={[styles.section, styles.twoColumn]}>
            <View style={[styles.column, styles.contactInfo]}>
              <Text>Bill To: {invoiceData.agentName}</Text>
              <Text>Address: {invoiceData.agentAddress}</Text>
              <Text>Email: {invoiceData.agentEmail}</Text>
              <Text>Phone: {invoiceData.agentPhone}</Text>
            </View>
            <View key={Math.random()} style={[styles.column, styles.contactInfo, { textAlign: 'right' }]}>
              <Text key={Math.random()} >Date: {invoiceData.invoiceDate}</Text>
              <Text key={Math.random()} >Invoice Number: {invoiceData.invoiceNumber}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={[styles.cell, styles.bold]}>Vessel Name</Text>
              <Text style={[styles.cell, styles.bold]}>IMO</Text>
              <Text style={[styles.cell, styles.bold]}>Vessel GRT</Text>
              <Text style={[styles.cell, styles.bold]}>Vessel Type</Text>
              <Text style={[styles.cell, styles.bold]}>Port of Arrival</Text>
              <Text style={[styles.cell, styles.bold]}>Flag</Text>
            </View>
            <View key={Math.random()} style={styles.row}>
              <Text key={Math.random()} style={styles.cell}>{invoiceData.vesselName}</Text>
              <Text key={Math.random()} style={styles.cell}>{invoiceData.vesselImoNumber}</Text>
              <Text key={Math.random()} style={styles.cell}>{invoiceData.vesselNetTonnage}</Text>
              <Text key={Math.random()} style={styles.cell}>{invoiceData.vesselType}</Text>
              <Text key={Math.random()} style={styles.cell}>{invoiceData.portOfArrival}</Text>
              <Text key={Math.random()} style={styles.cell}>{invoiceData.vesselFlag}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={[styles.cell, styles.bold]}>Estimated Date of Arrival</Text>
              <Text style={[styles.cell, styles.bold]}>Estimated Date of Departure</Text>
            </View>
            <View key={Math.random()} style={styles.row}>
              <Text key={Math.random()} style={styles.cell}>{invoiceData.vesselArrivalDate}</Text>
              <Text key={Math.random()} style={styles.cell}>{invoiceData.departureDate}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={[styles.cell, styles.bold]}>Serial NO</Text>
              <Text style={[styles.cell, styles.bold]}>Description</Text>
              <Text style={[styles.cell, styles.bold]}>Amount</Text>
            </View>
            {invoiceData.invoiceDetails.map((item, index) => (
              <View key={Math.random()} style={styles.row}>
                <Text key={Math.random()} style={styles.cell}>{index + 1}</Text>
                <Text key={Math.random()} style={styles.cell}>{item.itemName}</Text>
                <Text key={Math.random()} style={styles.cell}>{item.totalAmount} USD</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.amountInWords}>Amount in words: {invoiceData.amountInWord}</Text>
            <Text style={styles.total}>TOTAL: {invoiceData.totalAmount} {invoiceData.currency}</Text>
          </View>
          <View style={styles.footer}>
            <Text>This is a system-generated invoice . no signature is required. </Text>
            <Text style={{ color: 'red' }}>هذه الفاتورة مستخرجة من نظام التصاريح ولا تحتاج الي توقيع</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const InvoiceReport = ({ invoiceData }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>

      <Button data-testid="preview_invoice" type="default" style={{ marginLeft: 10 }} onClick={() => setVisible(true)}>Preview PDF</Button>

      <Modal title="Invoice Preview" open={visible} onCancel={() => setVisible(false)} footer={null} width={800}>
        <PDFViewer key={`${invoiceData.invoiceNumber}`} showToolbar={false} width="100%" height="600px">
          <InvoicePage invoiceData={invoiceData} />
        </PDFViewer>
        <PDFDownloadLink key={Math.random()} document={<InvoicePage key={Math.random()} invoiceData={invoiceData} />} fileName="invoice.pdf">
          {({ loading }) => (
            <Button data-testid="download_invoice" type="primary">{loading ? 'Loading...' : 'Download'}</Button>
          )}
        </PDFDownloadLink>
      </Modal>
    </div>
  );
};

export default InvoiceReport;
