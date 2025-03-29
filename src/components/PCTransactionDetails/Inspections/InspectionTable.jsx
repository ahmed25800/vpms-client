import React from "react";
import { Table, Tag, Button } from "antd";
import { ApprovalStatus } from "../../../constants/enums";
import { useTranslation } from 'react-i18next'; 
import Can from "../../Can";
import PERMISSIONS from "../../../constants/Permissions";



const InspectionTable = ({ inspections, OnPaymentClicked }) => {
    const { t } = useTranslation(); 
    const approvalStatusMap = {
      [ApprovalStatus.Pending]: { label: t("Pending"), color: "orange" },
      [ApprovalStatus.Approved]: { label: t("Approved"), color: "green" }, 
      [ApprovalStatus.Rejected]: { label: t("rejected"), color: "red" }, 
      [ApprovalStatus.Excepted]: { label: t("exception"), color: "cyan" }, 
    };
    const columns = [
        {
            title: t("status"), 
            key: "status",
            render: (_, record) => {
                const { label, color } = approvalStatusMap[record.approvalStatus] || {
                    label: t("unknown"), 
                    color: "gray",
                };

                return (
                    <>
                        <Tag color={color}>{t(label)}</Tag> 
                        {record.approvalStatus == ApprovalStatus.Rejected && <Tag color={color}>{record.rejectionReason}</Tag>}
                        {record.approvalStatus == ApprovalStatus.Excepted && <Tag color={color}>{record.exceptionReason}</Tag>}
                        {record.needPayment && <Tag color={record.isPayed ? "green" : (record.isPaymentRejected ? "red" : "orange")}>
                            {record.isPayed ? t("paid") : (record.isPaymentRejected ? t("paymentRejected") : t("pendingPayment"))} 
                        </Tag>}

                    </>
                );
            },
        },
        {
            title: t("inspectionDate"), 
            dataIndex: "inspectionDate",
            key: "inspectionDate",
        },
        {
            title: t("actions"), 
            key: "actions",
            render: (_, record) =>
                record.needPayment ? (
                   <Can permission={PERMISSIONS.INSPECTION_PAYMENT.CREATE}>
                        <Button data-testid="inspection_payment_btn" type="primary" onClick={() => handlePayment(record)}>
                            {t("payment")} 
                        </Button>
                   </Can>
                ) : (
                    <span>{t("noPaymentNeeded")}</span> 
                ),
        },
    ];

    const handlePayment = (record) => {
        OnPaymentClicked(record);
    };

    return (
        <Table
            columns={columns}
            dataSource={inspections}
            rowKey="pcTransactionDetailId"
            pagination={{ pageSize: 5 }}
        />
    );
};

export default InspectionTable;