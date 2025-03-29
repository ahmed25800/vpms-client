import React, { useState, useEffect } from "react";
import { Table, Button, message, Modal, Input, Upload, Spin } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import * as PreDepositRequestsService from "../services/PreDepositRequestsService";
import * as AgentService from "../services/AgentService";
import Can from "../components/Can";
import PERMISSIONS from "../constants/Permissions";
import NoPermission from "../components/NoPermission";
import { translateEnum } from "../utils/enumHelper"

const PreDepositRequestsManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [amount, setAmount] = useState("");
    const [file, setFile] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await AgentService.GetCurrentAgentPreDepositRequests();
            setRequests(data);
        } catch (error) {
            message.error(t("ErrorFetchingRequests"));
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = (file) => {
        setFile(file);
        return false;
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (value === "" || (Number(value) >= 0 && !isNaN(value))) {
            setAmount(value);
        }
    };

    const handleSubmit = async () => {
        if (!amount || !file) {
            message.error(t("PleaseProvideAmountAndDocument"));
            return;
        }

        setSubmitting(true);

        const formData = new FormData();
        formData.append("PreAmount", amount);
        formData.append("Document", file);

        try {
            await PreDepositRequestsService.Create(formData);
            message.success(t("RequestSubmittedSuccessfully"));
            fetchRequests();
            setIsModalVisible(false);
            setAmount("");
            setFile(null);
        } catch (error) {
            message.error(t("RequestSubmissionFailed"));
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        { title: t("AgentId"), dataIndex: ["agent", "id"], key: "agentId" },
        { title: t("AgentName"), dataIndex: ["agent", "name"], key: "agentName" },
        { title: t("Amount"), dataIndex: "amount", key: "amount" },
        {
            title: t("Status"),
            dataIndex: "status",
            key: "status",
            render: (status) => translateEnum(status, "PreDepositRequestStatus"),
        },
        { title: t("ApprovalDate"), dataIndex: "approvalDate", key: "approvalDate" },
    ];

    return (
        <Can permission={PERMISSIONS.AGENTS.VIEW_AGENTS_PREDEPOSITREQUESTS} fallback={<NoPermission />}>
            <div>
                <Can permission={PERMISSIONS.AGENTS.CREATE_AGENTS_PREDEPOSITREQUESTS}>
                    <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={() => setIsModalVisible(true)}>
                        {t("AddRequest")}
                    </Button>
                </Can>
                <Table dataSource={requests} columns={columns} rowKey="id" loading={loading} />

                <Modal
                    title={t("AddPreDepositRequest")}
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onOk={handleSubmit}
                    maskClosable={false}
                    confirmLoading={submitting}
                >
                    <Input
                        type="number"
                        placeholder={t("EnterAmount")}
                        value={amount}
                        onChange={handleAmountChange}
                        min="1"
                        style={{ marginBottom: 16 }}
                        disabled={submitting}
                    />
                    <Upload beforeUpload={handleUpload} showUploadList={true} disabled={submitting}>
                        <Button icon={<UploadOutlined />} disabled={submitting}>{t("UploadDocument")}</Button>
                    </Upload>

                    {submitting && (
                        <div style={{ textAlign: "center", marginTop: 16 }}>
                            <Spin />
                        </div>
                    )}
                </Modal>
            </div>
        </Can>
    );
};

export default PreDepositRequestsManagement;
