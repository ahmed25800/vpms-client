import React, { useEffect, useState } from "react";
import { Row, Tabs, Col, Tag } from "antd";

import InvoiceTab from "../Payment/InvoiceTab";
import PaymentTab from "../Payment/PaymentTab";
import NoData from "../../NoData";
import { PayInvoice } from "../../../services/InspectionService";
import { RejectInspectionPayment } from "../../../services/PCTransactionsService";
import { useTranslation } from 'react-i18next'; 
import PERMISSIONS from "../../../constants/Permissions";

const InspectionPayment = ({ paymentData, OnApprove }) => {
    const { t } = useTranslation(); 

    const handleOnApprove = async () => {
        await PayInvoice({ InvoiceId: paymentData.invoiceId });
        OnApprove();
    }

    const handleReject = async (reason) => {
        await RejectInspectionPayment({ Id: paymentData.pcTransactionDetailId, Reason: reason });
        OnApprove();
    };


    if (!paymentData) return <NoData />;
    return (
        <Row gutter={[16, 16]}>
            {paymentData.isPayed && <Col>
                <Tag color='green'>{t("paid")}</Tag> 
            </Col>}
            {paymentData.isPaymentRejected && <Col>
                <Tag color='red'>{t("rejected")}</Tag> 
                <Tag color='red'>{paymentData.paymentRejectionReason}</Tag>
            </Col>}
            <Col span={24} style={{ textAlign: 'left', marginTop: '20px' }}>
                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            key: "1",
                            label: t("invoice"), 
                            children: <InvoiceTab invoiceId={paymentData.invoiceId} />,
                        },
                        {
                            key: "2",
                            label: t("payment"), 
                            children: <PaymentTab approvalStatus={(!paymentData.isPayed && !paymentData.isPaymentRejected)?1:2} OnReject={handleReject}
                                PaymentPermissions={{
                                APPROVE:PERMISSIONS.INSPECTION_PAYMENT.APPROVE,
                                REJECT:PERMISSIONS.INSPECTION_PAYMENT.REJECT,
                                DOCUMENT:PERMISSIONS.INSPECTION_PAYMENT.DOCUMENT
                                }}
                                paymentMethod={paymentData.paymentMethod}
                                OnApprove={handleOnApprove}
                                transactionId={paymentData.pcTransactionId}
                                hasApproval={!paymentData.isPaymentRejected && !paymentData.isPayed}
                                transactionDetailId={paymentData.pcTransactionDetailId}
                                onRefreshPayment={()=>{OnApprove("2")}}
                            />,
                        },
                    ]}
                />
            </Col>

        </Row>

    );
};

export default InspectionPayment;