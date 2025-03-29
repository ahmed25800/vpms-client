import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font, PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "antd";
import ISMALOGO from "../../../assets/ISMALOGO.png";
import LoadingSpinner from "../../LoadingSpinner";
import { GetEntryPermitReport } from "../../../services/PCTransactionsService";
import NoData from "../../NoData";
import { FilePdfOutlined } from "@ant-design/icons";



const VesselExitPermitReport = ({ detailId }) => {
  const [reportData, setReportData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  useEffect(() => {
    fetchExitPermitReportData();
  }, [detailId]);

  const fetchExitPermitReportData = async () => {
    try {
      debugger;
      setDataLoading(true);
      const data = await GetEntryPermitReport(detailId);
      setReportData(data);
      setDataLoading(false);
    } catch (error) {
      setDataLoading(false);
      console.error("Error fetching report data:", error);
    }
  };

  if (dataLoading) return <LoadingSpinner loading={dataLoading}></LoadingSpinner>;
  if (!reportData) return <NoData></NoData>;
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <div style={{ width: "100%", height: "800px", border: "1px solid #ccc" }}>
        <PDFViewer key={detailId} width="100%" height="100%" showToolbar={false}>
          <VesselExitPermitReportContent reportData={reportData} />
        </PDFViewer>
      </div>
      <PDFDownloadLink data-testid="download_exit_permit_report"
        document={<VesselExitPermitReportContent reportData={reportData} />}
        fileName="Vessel_Exit_Permit.pdf">
        {({ loading }) => <Button type="primary" icon={<FilePdfOutlined />}>{loading ? "Loading..." : "Download"}</Button>}
      </PDFDownloadLink>


    </div>
  );
};
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10, fontFamily: 'ReportCustomFont' },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8, alignItems: "center" },
  section: { marginBottom: 10, paddingBottom: 5, borderBottom: "1px solid #000" },
  header: { textAlign: "center", fontSize: 12, fontWeight: "bold" },
  column: { width: "48%" },
  label: { fontWeight: "bold" },
  rtl: { direction: "rtl", textAlign: 'right' },
  logo: { width: 60, height: 60 },
  box: { border: "1px solid black", padding: 5, marginBottom: 5 },
  centerText: { textAlign: "center", alignItems: "center", width: "100%" },

  container: { width: '100%', marginBottom: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  textBold: { fontSize: 12, fontWeight: 'bold' },
  textValue: { fontSize: 12, fontWeight: 'bold', textDecoration: 'underline' },
  textSpace: { width: '20%' },

  table: { border: '1px solid black', width: '100%' },
  rowHeader: { flexDirection: 'row', backgroundColor: '#d1e7fd', borderBottom: '1px solid black' },
  cell: { borderRight: '1px solid black', padding: 5, fontSize: 10, textAlign: 'center', flexGrow: 1 },
  cellDate: { flex: 1 },
  cellUser: { flex: 2 },
  cellComments: { flex: 3 },
  footer: { textAlign: "center", fontSize: 10, margin: '10 0', padding: 10 },

});


const VesselExitPermitReportContent = ({ reportData }) => (
  <Document deb key={reportData.transactionDetailId}>
    <Page size="A4" style={styles.page}>
      <View style={styles.row}>
        <Image src={`${window.location.origin}${ISMALOGO}`} style={styles.logo} />
        <View style={{ alignItems: "center" }}>
          <Text>الهيئة البحرية العراقية العليا</Text>
          <Text>Iraqi Supreme Maritime Authority</Text>
        </View>
      </View>

      <View style={[styles.centerText, { marginBottom: 20 }]}>
        <Text style={styles.header}>Vessel Departure Permit -</Text>
        <Text style={[styles.header, styles.rtl]}>تصريح مغادرة وحدة بحرية</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text><Text style={styles.label}>Permit Number: </Text>{reportData?.transactionDetailId || "N/A"}</Text>
            <Text><Text style={styles.label}>Issuance Date: </Text>{reportData?.createdDate || "N/A"}</Text>
            <Text><Text style={styles.label}>Vessel Name: </Text>{reportData?.vessel?.vesselName || "N/A"}</Text>
            <Text><Text style={styles.label}>Vessel Imo: </Text>{reportData?.vessel?.imoNumber || "N/A"}</Text>
            <Text><Text style={styles.label}>Classification Society: </Text>{reportData?.vessel?.vesselClass || "N/A"}</Text>
            <Text><Text style={styles.label}>Destination Port Name: </Text>{reportData?.transaction?.portName || "N/A"}</Text>
            <Text><Text style={styles.label}>Vessel Type: </Text>{reportData?.vessel?.vesselTypeName || "N/A"}</Text>
            <Text key={Math.random()} id="t_10"><Text key={Math.random()} style={styles.label}>Vessel GRT: </Text>{reportData?.vessel?.vesselNetTonnage || "N/A"}</Text>
          </View>

          <View style={[styles.column, styles.rtl]}>
            <Text>
              <Text style={styles.label}>رقم التصريح:&nbsp;</Text>
              <Text>{reportData?.transactionDetailId || "N/A"}</Text>
            </Text>
            <Text>
              <Text style={styles.label}>تاريخ الإصدار:&nbsp;</Text>
              <Text style={{ direction: "ltr" }}>{reportData?.createdDate || "N/A"}</Text>
            </Text>
            <Text>
              <Text>{reportData?.vessel?.vesselName || "N/A"}</Text>

              <Text style={styles.label}>&nbsp;: اسم السفينة</Text>
            </Text>
            <Text>
              <Text>{reportData?.vessel?.imoNumber || "N/A"}</Text>

              <Text style={styles.label}>&nbsp;: رقم السفينة</Text>
            </Text>
            <Text>
              <Text>{reportData?.vessel?.vesselClass || "N/A"}</Text>

              <Text style={styles.label}>&nbsp;: هيئة التصنيف </Text>
            </Text>
            <Text>
              <Text>{reportData?.transaction?.portName || "N/A"}</Text>

              <Text style={styles.label}>&nbsp;: اسم الميناء المتجه اليه</Text>
            </Text>
            <Text>
              <Text>{reportData?.vessel?.vesselTypeName || "N/A"}</Text>

              <Text style={styles.label}>&nbsp;: نوع السفينة</Text>
            </Text>

            <Text key={Math.random()} id="t_16">
              <Text key={Math.random()} >{reportData?.vessel?.vesselNetTonnage || "N/A"}</Text>
              <Text key={Math.random()} style={styles.label}>&nbsp;: الحمولة الطنية الاجمالية المسجلة</Text>
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text><Text style={styles.label}>Agency Name: </Text>{reportData?.agent?.fullName || "N/A"}</Text>
            <Text><Text style={styles.label}>Arrival Date: </Text>{new Date(reportData?.transaction?.arrivalDate).toLocaleDateString() || "N/A"}</Text>
          </View>

          <View style={[styles.column, styles.rtl]}>
            <Text>
              <Text>{reportData?.agent?.fullName || "N/A"}</Text>
              <Text style={styles.label}>&nbsp;: اسم الوكالة</Text>

            </Text>

            <Text>
              <Text style={styles.label}>تاريخ الوصول:&nbsp;</Text>
              <Text style={{ direction: "ltr" }}>
                {reportData?.transaction?.arrivalDate
                  ? new Date(reportData.transaction.arrivalDate).toLocaleDateString()
                  : "N/A"}
              </Text>
            </Text>
          </View>

        </View>
      </View>
      <View style={styles.section}>
        {/* العنوان */}
        <Text style={[styles.textBold, styles.rtl]}>
          يسمح  السفينة المذكورة اعلاه بالمغادرة من المياه العراقية الاقليمية
        </Text>
        <Text style={[styles.textBold]}>
          The above-mentioned vessel is allowed to Departure Iraqi waters.
        </Text>
      </View>
      <View style={[styles.row]}>
        <Text>This is a system-generated Document . no signature is required. </Text>
        <Text>هذه الوثيقة مستخرجة من النظام ولا تحتاج الي توقيع</Text>
      </View>
    </Page>
  </Document>
);


export default VesselExitPermitReport;
