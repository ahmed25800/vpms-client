import React, { useEffect, useState } from "react";
import { Table, Button, message, Row, Col } from "antd";
import LoadingSpinner from "../../LoadingSpinner";
import { GetInvoice } from "../../../services/PaymentService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ISMALOGO from "../../../assets/ISMALOGO.png";
import NoData from "../../NoData";
import InvoiceReport from "./InvoiceReport";
import { useTranslation } from 'react-i18next';

const InvoiceTab = ({ invoiceId }) => {
    const { t } = useTranslation(); 
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (invoiceId) fetchInvoiceData();
    }, [invoiceId]);

    const fetchInvoiceData = async () => {
        try {
            setLoading(true);
            const data = await GetInvoice(invoiceId);
            setInvoiceData(data);
        } catch (error) {
            message.error(t("errorFetchingInvoice")); 
        } finally {
            setLoading(false);
        }
    };

    const exportPDF = () => {
        if (!invoiceData) {
            message.error(t("noDataAvailableToExport")); 
            return;
        }

        try {
            const doc = new jsPDF();
            let finalY = 10;

            doc.addImage(ISMALOGO, "png", 175, 5, 25, 25);
            doc.setFontSize(16);
            doc.text(t("invoice"), 15, 15); 
            doc.setFontSize(11);
            doc.text(t("invoiceGeneratedByISMASystem"), 15, 20); 
            doc.text(`${t("invoiceDate")}: ${invoiceData?.invoiceDate || "N/A"}`, 15, 25); 

            finalY += 25;

            doc.autoTable({
                startY: finalY,
                head: [[t("invoiceNo"), t("agentName"), t("vesselName"), t("portName"), t("totalAmount"), t("currency")]], 
                body: [[
                    invoiceData.invoiceNumber || "N/A",
                    invoiceData.agentName || "N/A",
                    invoiceData.vesselName || "N/A",
                    invoiceData.portName || "N/A",
                    invoiceData.totalAmount || "N/A",
                    invoiceData.currency || "N/A",
                ]],
            });

            finalY = doc.lastAutoTable.finalY + 10;

            if (invoiceData.invoiceDetails?.length) {
                doc.text(`${t("invoiceDetails")}`, 15, finalY); 
                finalY += 5;
                doc.autoTable({
                    startY: finalY,
                    head: [[t("itemName"), t("totalAmount")]], 
                    body: invoiceData.invoiceDetails.map(detail => [detail.itemName, detail.totalAmount]),
                });

                finalY = doc.lastAutoTable.finalY + 10;
            }

            doc.save("invoice_report.pdf");
            message.success(t("pdfDownloadedSuccessfully")); 
        } catch (error) {
            console.error("Error generating PDF:", error);
            message.error(t("errorGeneratingPDF")); 
        }
    };

    if (loading) return <LoadingSpinner loading={loading} />;
    if (!invoiceData) return <NoData />;

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>

              <InvoiceReport invoiceData={invoiceData}></InvoiceReport>
            </Col>
            <Col span={24}>
                <Table
                    title={() => t("invoice")} 
                    dataSource={[invoiceData]}
                    rowKey="id"
                    columns={[
                        { title: t("invoiceNo"), dataIndex: "invoiceNumber", key: "invoiceNumber" }, 
                        { title: t("agentName"), dataIndex: "agentName", key: "agentName" }, 
                        { title: t("vesselName"), dataIndex: "vesselName", key: "vesselName" }, 
                        { title: t("portName"), dataIndex: "portName", key: "portName" }, 
                        { title: t("totalAmount"), dataIndex: "totalAmount", key: "totalAmount" }, 
                        { title: t("currency"), dataIndex: "currency", key: "currency" }, 
                        { title: t("invoiceDate"), dataIndex: "invoiceDate", key: "invoiceDate" }, 
                    ]}
                    pagination={false}
                />
            </Col>
            {invoiceData.invoiceDetails?.length > 0 && (
                <Col span={24}>
                    <Table
                        title={() => t("invoiceDetail")} 
                        dataSource={invoiceData.invoiceDetails}
                        rowKey="id"
                        columns={[
                            { title: t("itemName"), dataIndex: "itemName", key: "itemName" }, 
                            { title: t("totalAmount"), dataIndex: "totalAmount", key: "totalAmount" }, 
                        ]}
                        pagination={false}
                        style={{ marginTop: 16 }}
                    />
                </Col>
            )}
        </Row>
    );
};

export default InvoiceTab;