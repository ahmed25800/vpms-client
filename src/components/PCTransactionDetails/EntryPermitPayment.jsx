import React, { useEffect, useState } from "react";
import { Row, Tabs, message, Col, Button, Tag } from "antd";
import { ApprovalStatus, GetKeyByValue } from '../../constants/enums';
import LoadingSpinner from "../LoadingSpinner";
import { GetEntryPermitPayment, RejectTransactionDetail, ApproveEntryPermitPayment, CreateEntryPermitPaymentRefund } from "../../services/PCTransactionsService";
import InvoiceTab from "./Payment/InvoiceTab";
import PaymentTab from "./Payment/PaymentTab";
import NoData from "../NoData";
import { useTranslation } from 'react-i18next'; 
import PERMISSIONS from "../../constants/Permissions";
import VesselEntryPermitReport from "./Reports/EntryPermitReport";


const EntryPermitPayment = ({ transactionId, handleOnApprove }) => {
    const { t } = useTranslation(); 
    const [loading, setLoading] = useState({ dataLoading: true, approveDetail: false });
    const [paymentData, setPaymentData] = useState(null);
    const [activeKey, setActiveKey] = useState(1);
    const [activeTab, setActiveTab] = useState(1);

    useEffect(() => {
        fetchPayment();
    }, []);

    const fetchPayment = async () => {
        try {
            setLoading({ ...loading, dataLoading: true });
            const data = await GetEntryPermitPayment(transactionId);
            if (!data) throw data;
            setPaymentData(data);
            setLoading({ ...loading, dataLoading: false });
        } catch (error) {
            setLoading({ ...loading, dataLoading: false });
            message.error(t("errorFetchingPaymentData")); 
        }
    };

    const handleReject = async (reason) => {
        await RejectTransactionDetail({ Id: paymentData.transactionDetialId, Reason: reason });
        fetchPayment();
    };

    const handleRequestRefund = async (reason) => {
        debugger;
        await CreateEntryPermitPaymentRefund({ DetailId: paymentData.transactionDetialId, RefundReason: reason });
        fetchPayment();
    };
    const handleApprovDetail = async () => {
        try {

            var response = await ApproveEntryPermitPayment({ Id: paymentData.transactionDetialId });
            if (response.isSuccess) {
                message.success(t("entryPermitApproved")); 
            }
            if (handleOnApprove) handleOnApprove();
        } catch (err) {
            setApproveLoading(false);
            message.error(t("errorApprovingEntryPermitPayment")); 
        }
    };

    if (loading.dataLoading) {
        return <LoadingSpinner loading={loading.dataLoading} />;
    }
    if (!paymentData) return <NoData />;
    return (
        <Row gutter={[16, 16]}>
            <Col span={24} style={{ textAlign: 'left'}}>
            {paymentData.status == ApprovalStatus.Approved &&
                <Tag color='green'>{t('approved')}</Tag> 
           }
            {paymentData.status == ApprovalStatus.Rejected && <>
                <Tag color='red'>{t('rejected')}</Tag> 
                <Tag color='red'>{paymentData.rejectionReason}</Tag>
            </>}
                <Tabs
                    activeKey={`${activeTab}`}
                    defaultActiveKey={`${activeTab}`}
                    onChange = {(key)=>{ setActiveKey(activeKey+1); setActiveTab(key) }}
                    items={[
                        {
                            key: "1",
                            label: t("invoice"), 
                            children: <InvoiceTab key={activeKey} invoiceId={paymentData.invoiceId} />,
                        },
                        {
                            key: "2",
                            label: t("payment"), 
                            children: <PaymentTab 
                                key={activeKey}
                                refundModel={{canRequestRefund:paymentData.canRequestRefund,
                                    requestRefund:handleRequestRefund ,
                                    RefreshData : fetchPayment,
                                    paymentRefundRequests:paymentData.paymentRefundRequests,
                                    permissions:PERMISSIONS.ENTRY_PERMIT_PAYMENT_REFUND}}
                                PaymentPermissions={
                                {APPROVE:PERMISSIONS.ENTRY_PERMIT_PAYMENT.APPROVE , 
                                REJECT:PERMISSIONS.ENTRY_PERMIT_PAYMENT.REJECT , 
                                DOCUMENT:PERMISSIONS.ENTRY_PERMIT_PAYMENT.DOCUMENT , CREATE : PERMISSIONS.ENTRY_PERMIT_PAYMENT.CREATE}}
                                paymentMethod = {paymentData.paymentMethod}
                                OnReject={handleReject} OnApprove={handleApprovDetail}
                                transactionId={paymentData.transactionId}
                                hasApproval={paymentData.status == ApprovalStatus.Pending}
                                approvalStatus={paymentData.status}
                                onRefreshPayment = {async ()=>{await fetchPayment(); }}
                                transactionDetailId={paymentData.transactionDetialId} />,
                        },
                        {
                            key: "3",
                            label: t("entryPermitReport"), 
                            disabled :paymentData.status != ApprovalStatus.Approved||paymentData.isRefunded,
                            children: <VesselEntryPermitReport key={activeKey} detailId={paymentData.transactionDetialId}></VesselEntryPermitReport>
                        },
                    ]}
                />
            </Col>

        </Row>

    );
};

export default EntryPermitPayment;