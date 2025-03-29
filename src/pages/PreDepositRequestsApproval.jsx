import React, { useState, useEffect } from "react";
import { Table, Button, message, Modal, Spin } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import * as PreDepositRequestsService from "../services/PreDepositRequestsService";
import Can from "../components/Can";
import PERMISSIONS from "../constants/Permissions";
import NoPermission from "../components/NoPermission";
import { PreDepositRequestStatus } from "../constants/enums";
import FilePreview from '../components/FileViewer';


const { confirm } = Modal;

const PreDepositRequestsApproval = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await PreDepositRequestsService.GetAll();
            setRequests(data);
        } catch (error) {
            message.error(t("ErrorFetchingRequests"));
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        setLoading(true);
        try {
            const body = {
                status: action === "approve" ? PreDepositRequestStatus.APPROVED : PreDepositRequestStatus.REJECTED
            };
            await PreDepositRequestsService.ChangeStatus(id, body);
            message.success(action === "approve" ? t("RequestApprovedSuccessfully") : t("RequestRejectedSuccessfully"));
            fetchRequests();
        } catch (error) {
            message.error(t("ActionFailed"));
        } finally {
            setLoading(false);
        }
    };

    const showRejectConfirm = (id) => {
        confirm({
            title: t("ConfirmRejection"),
            icon: <ExclamationCircleOutlined />,
            content: t("AreYouSureToReject"),
            okText: t("Reject"),
            okType: "danger",
            cancelText: t("Cancel"),
            onOk() {
                handleAction(id, "reject");
            },
        });
    };

    const columns = [
        { title: t("AgentId"), dataIndex: ["agent", "id"], key: "agentId" },
        { title: t("AgentName"), dataIndex: ["agent", "name"], key: "agentName" },
        { title: t("Amount"), dataIndex: "amount", key: "amount" },
        {
            title: t("Actions"),
            key: "actions",
            render: (_, record) => (
                <>
                    <FilePreview documentId={record.documentId} />

                    <Can permission={PERMISSIONS.AGENTS.APPROVE_AGENTS_PREDEPOSITREQUESTS}>
                        <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            style={{ backgroundColor: "green", borderColor: "green", marginRight: 8 }}
                            onClick={() => handleAction(record.id, "approve")}
                            disabled={record.status !== PreDepositRequestStatus.PENDING || loading}
                        >
                            {t("Approve")}
                        </Button>
                    </Can>
                    <Can permission={PERMISSIONS.AGENTS.REJECT_AGENTS_PREDEPOSITREQUESTS}>
                        <Button
                            type="primary"
                            danger
                            icon={<CloseCircleOutlined />}
                            onClick={() => showRejectConfirm(record.id)}
                            disabled={record.status !== PreDepositRequestStatus.PENDING || loading}
                        >
                            {t("Reject")}
                        </Button>
                    </Can>
                </>
            ),
        },
    ];

    return (
        <Can permission={PERMISSIONS.AGENTS.SCREEN_AGENTS_PREDEPOSITREQUESTS_APPROVAL} fallback={<NoPermission />}>
            <Spin spinning={loading} size="large">
                <Table dataSource={requests} columns={columns} rowKey="id" />
            </Spin>
        </Can>
    );
};

export default PreDepositRequestsApproval;
