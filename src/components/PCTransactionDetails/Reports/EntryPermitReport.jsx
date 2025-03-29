import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, Image, PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "antd";
import ISMALOGO from "../../../assets/ISMALOGO.png";
import LoadingSpinner from "../../LoadingSpinner";
import { GetEntryPermitReport } from "../../../services/PCTransactionsService";
import NoData from "../../NoData";
import { FilePdfOutlined } from "@ant-design/icons";


const VesselEntryPermitReport = ({ detailId }) => {
  const [reportData, setReportData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  useEffect(() => {
    fetchEntryPermitReportData();
  }, [detailId]);

  const fetchEntryPermitReportData = async () => {
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
  if (Array.isArray(reportData)) return <NoData></NoData>;
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <div style={{ width: "100%", height: "800px", border: "1px solid #ccc" }}>
        <PDFViewer key={Math.random()} width="100%" height="100%" showToolbar={false}>
          <VesselEntryPermitReportContent key={Math.random()} reportData={reportData} />
        </PDFViewer>
      </div>

      <PDFDownloadLink key={Math.random()} data-testid="download_entry_permit_report"
        document={<VesselEntryPermitReportContent key={Math.random()} reportData={reportData} />}
        fileName="Vessel_Entry_Permit.pdf">
        {({ loading }) => <Button type="primary" icon={<FilePdfOutlined />}>{loading ? "Loading..." : "Download"}</Button>}
      </PDFDownloadLink>
    </div>
  );
};

let styles = StyleSheet.create({
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


const VesselEntryPermitReportContent = ({ reportData }) => (
  <Document key={Math.random()}>
    <Page id="p_1 " size="A4" style={styles.page}>
      <View key={Math.random()} style={styles.row} id="v_1">
        <Image src={`${window.location.origin}${ISMALOGO}`} style={styles.logo} id="v_2" />
        <View key={Math.random()} style={{ alignItems: "center" }} id="v_3">
          <Text key={Math.random()} id="t_1">الهيئة البحرية العراقية العليا</Text>
          <Text key={Math.random()} id="t_2">Iraqi Supreme Maritime Authority</Text>
        </View>
      </View>

      <View key={Math.random()} style={[styles.centerText, { marginBottom: 20 }]} id="v_4">
        <Text key={Math.random()} style={styles.header} id="t_3">Vessel Entry Permit -</Text>
        <Text key={Math.random()} style={[styles.header, styles.rtl]} id="t_4">تصريح دخول وحدة بحرية</Text>
      </View>

      <View key={Math.random()} style={styles.section} id="v_5">
        <View key={Math.random()} style={styles.row} id="v_6">
          <View key={Math.random()} style={styles.column} id="v_7">
            <Text key={Math.random()} id="t_5"><Text key={Math.random()} style={styles.label}>Permit Number: </Text>{reportData?.transactionDetailId || "N/A"}</Text>
            <Text key={Math.random()} id="t_6"><Text key={Math.random()} style={styles.label}>Issuance Date: </Text>{reportData?.createdDate || "N/A"}</Text>
            <Text key={Math.random()} id="t_11"><Text key={Math.random()} style={styles.label}>Vessel Name: </Text>{reportData?.vessel?.vesselName || "N/A"}</Text>
            <Text key={Math.random()} id="t_12"><Text key={Math.random()} style={styles.label}>Vessel IMO: </Text>{reportData?.vessel?.imoNumber || "N/A"}</Text>
            <Text key={Math.random()} id="t_8"><Text key={Math.random()} style={styles.label}>Classification society: </Text>{reportData?.vessel?.vesselClass || "N/A"}</Text>
            <Text key={Math.random()} id="t_9"><Text key={Math.random()} style={styles.label}>Destination Port Name: </Text>{reportData?.transaction?.portName || "N/A"}</Text>
            <Text key={Math.random()} id="t_10"><Text key={Math.random()} style={styles.label}>Vessel Type: </Text>{reportData?.vessel?.vesselTypeName || "N/A"}</Text>
            <Text key={Math.random()} id="t_10"><Text key={Math.random()} style={styles.label}>Vessel GRT: </Text>{reportData?.vessel?.vesselNetTonnage || "N/A"}</Text>

          </View>

          <View key={Math.random()} style={[styles.column, styles.rtl]} id="v_8">
            <Text key={Math.random()} id="t_11">
              <Text key={Math.random()} style={styles.label}>رقم التصريح:&nbsp;</Text>
              <Text key={Math.random()} >{reportData?.transactionDetailId || "N/A"}</Text>
            </Text>
            <Text key={Math.random()} id="t_12">
              <Text key={Math.random()} style={styles.label}>تاريخ الإصدار:&nbsp;</Text>
              <Text key={Math.random()} style={{ direction: "ltr" }}>{reportData?.createdDate || "N/A"}</Text>
            </Text>
            <Text key={Math.random()} id="t_17">
              <Text key={Math.random()} >{reportData?.vessel?.vesselName || "N/A"}</Text>
              <Text key={Math.random()} style={styles.label}>&nbsp;: اسم السفينة</Text>
            </Text>
            <Text key={Math.random()} id="t_18">
              <Text key={Math.random()} >{reportData?.vessel?.imoNumber || "N/A"}</Text>
              <Text key={Math.random()} style={styles.label}>&nbsp;: رقم السفينة</Text>
            </Text>
            <Text key={Math.random()} id="t_14">
              <Text key={Math.random()} >{reportData?.vessel?.vesselClass || "N/A"}</Text>
              <Text key={Math.random()} style={styles.label}>&nbsp;: هيئةالتصنيف</Text>
            </Text>
            <Text key={Math.random()} id="t_15">
              <Text key={Math.random()} >{reportData?.transaction?.portName || "N/A"}</Text>
              <Text key={Math.random()} style={styles.label}>&nbsp;:  اسم الميناء المتجه اليه</Text>
            </Text>
            <Text key={Math.random()} id="t_16">
              <Text key={Math.random()} >{reportData?.vessel?.vesselTypeName || "N/A"}</Text>
              <Text key={Math.random()} style={styles.label}>&nbsp;: نوع السفينة</Text>
            </Text>
            <Text key={Math.random()} id="t_16">
              <Text key={Math.random()} >{reportData?.vessel?.vesselNetTonnage || "N/A"}</Text>
              <Text key={Math.random()} style={styles.label}>&nbsp;: الحمولة الطنية الاجمالية المسجلة</Text>
            </Text>

          </View>
        </View>
        <View key={Math.random()} style={styles.row} id="v_10">
          <View key={Math.random()} style={styles.column} id="v_11">
            <Text key={Math.random()} id="t_17"><Text key={Math.random()} style={styles.label}>Agency Name: </Text>{reportData?.agent?.fullName || "N/A"}</Text>
            <Text key={Math.random()} id="t_20"><Text key={Math.random()} style={styles.label}>Arrival Date: </Text>{new Date(reportData?.transaction?.arrivalDate).toLocaleDateString() || "N/A"}</Text>
            <Text key={Math.random()} id="t_21"><Text key={Math.random()} style={styles.label}>Last Port: </Text>{reportData?.vessel?.lastPortOfCall || "N/A"}</Text>
          </View>

          <View key={Math.random()} style={[styles.column, styles.rtl]} id="v_12">
            <Text key={Math.random()} id="t_25">
              <Text key={Math.random()} >{reportData?.agent?.fullName || "N/A"}</Text>
              <Text key={Math.random()} style={styles.label}>&nbsp;: اسم الوكالة</Text>
            </Text>
            <Text key={Math.random()} id="t_28">
              <Text key={Math.random()} style={styles.label}>تاريخ الوصول:&nbsp;</Text>
              <Text key={Math.random()} style={{ direction: "ltr" }}>
                {reportData?.transaction?.arrivalDate
                  ? new Date(reportData.transaction.arrivalDate).toLocaleDateString()
                  : "N/A"}
              </Text>
            </Text>
            <Text key={Math.random()} id="t_29">
              <Text key={Math.random()} >{reportData?.vessel?.lastPortOfCall || "N/A"}</Text>
              <Text key={Math.random()} style={styles.label}>&nbsp;: قادمة من</Text>
            </Text>
          </View>
        </View>
      </View>



      <View key={Math.random()} style={styles.section} id="v_17">
        <Text key={Math.random()} style={[styles.textBold, styles.rtl]} id="t_39">
          يسمح للسفينة  المذكورة اعلاه بدخول المياه الاقليمية العراقية شريطة ان تتقيد بقوانين البلد و انظمته
        </Text>
        <Text key={Math.random()} style={[styles.textBold]} id="t_45">
          The above-mentioned vessel was allowed to enter Iraqi territorial waters, provided that he complies with the country's laws and regulations.
        </Text>
      </View>

      <View key={Math.random()} style={[styles.row]} id="v_20">
        <Text key={Math.random()} id="t_50">This is a system-generated Document . no signature is required. </Text>
        <Text key={Math.random()} id="t_51">هذه الوثيقة مستخرجة من نظام التصاريح ولا تحتاج الي توقيع</Text>
      </View>

    </Page>
  </Document>
);


export default VesselEntryPermitReport;
