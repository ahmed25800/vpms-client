import React, { useState } from "react";
import { Table, Tag, Button, Tooltip, message } from "antd";
import { ApprovalStatus } from "../../../constants/enums";
import { useTranslation } from 'react-i18next'; 
import Can from "../../Can";
import PERMISSIONS from "../../../constants/Permissions";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { ApproveEntryPermitPaymentRefund, RejectTransactionDetail } from "../../../services/PCTransactionsService";
import RejectionModal from "../RejectionModal";

const RefundTable = ({ paymentRefundRequests, OnApprove }) => {
    const { t } = useTranslation(); 
    const [loading, setLoading] = useState({});
    const [rejectionRecord, setRejectionRecord] = useState({ rejectionModal: false, record: null });
    const approvalStatusMap = {
      [ApprovalStatus.Pending]: { label: t("Pending"), color: "orange" },
      [ApprovalStatus.Approved]: { label: t("refunded"), color: "#7190ad" }, 
      [ApprovalStatus.Rejected]: { label: t("rejected"), color: "red" }, 
      [ApprovalStatus.Excepted]: { label: t("exception"), color: "cyan" }, 
    };
    const columns = [
        {
            title: t("refundReason"), 
            dataIndex: "refundReason",
            key: "refundReason",
        },
        {
            title: t("status"), 
            key: "approvalStatus",
            render: (_, record) => {
                const { label, color } = approvalStatusMap[record.approvalStatus] || {
                    label: t("unknown"), 
                    color: "gray",
                };

                return (
                    <>
                        <Tag color={color}>{t(label)}</Tag> 
                        {record.approvalStatus == ApprovalStatus.Rejected && <Tag color={color}>{record.rejectionReason}</Tag>}

                    </>
                );
            },
        },
        {
            title: t("actions"), 
            key: "actions",
            render: (_, record) =>{
                debugger;

            return <>
               {record.approvalStatus == ApprovalStatus.Pending && (
                    <>
                        <Can permission={PERMISSIONS.ENTRY_PERMIT_PAYMENT_REFUND.APPROVE}><Tooltip title={t("approve")}>
                            <Button data-testid="approve_payment_refundd" loading={loading[record.id]} 
                            icon={<CheckOutlined />} 
                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} size="medium" type="primary" 
                            onClick={() => handleApproveRefund(record)} />
                        </Tooltip></Can>
                
                        <Can permission={PERMISSIONS.ENTRY_PERMIT_PAYMENT_REFUND.REJECT}><Tooltip title={t("reject")}>
                            <Button
                                icon={<CloseOutlined />}
                                style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f", color: "#fff", margin: 2 }}
                                size="medium"
                                type="primary"
                                data-testid="approve_payment_refundd" 
                                onClick={() => setRejectionRecord({ rejectionModal: true, record: record })}
                            />
                        </Tooltip></Can>
                    </>
                    )}
               </>
            }
        },
    ];
    const handleApproveRefund = async (record) => {
        try {
            setLoading((prev) =>({ ...prev, [record.id]: true }));
            await ApproveEntryPermitPaymentRefund({ RequestId: record.id });
            message.success(t("approvedSuccessfully"));
            OnApprove();
        } catch (error) {
            message.error(t("errorApproveRefund"));
        } finally {
            setLoading((prev) =>({ ...prev, [record.id]: false }));
        }
    };
    const handleReject = async (reason) => {
        await RejectTransactionDetail({ Id: rejectionRecord.record.detailId, Reason: reason });
        setRejectionRecord({ rejectionModal: false })
        fetchEntryPermitData();
    };

    return (<>
    {rejectionRecord.rejectionModal && (
                <RejectionModal
                    key={rejectionRecord.record.detailId}
                    visible={rejectionRecord.rejectionModal}
                    title={t("rejectRefund")}
                    onCancel={() => setRejectionRecord({ rejectionModal: false, record: null })}
                    onConfirm={handleReject}
                />
            )}
    <Table
            columns={columns}
            dataSource={paymentRefundRequests}
            rowKey="id"
        />
    </>
        
    );
};

export default RefundTable;