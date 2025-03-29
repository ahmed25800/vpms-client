import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Modal, Input, message } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from "@ant-design/icons";
import * as AgentService from "../services/AgentService";
import { CertificateStatus, AgentStatus } from "../constants/enums";
import * as AgentCertificateService from "../services/AgentCertificateService";
import FilePreview from '../components/FileViewer';
import { useTranslation } from "react-i18next";
import Can from "../components/Can";
import PERMISSIONS from "../constants/Permissions";
import NoPermission from "../components/NoPermission";
import { translateEnum } from "../utils/enumHelper"

const { TextArea } = Input;

const AgentsApproval = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCertificateId, setSelectedCertificateId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const agents = await AgentService.GetAllByStatus(AgentStatus.PENDING);
      setAgents(agents);
    } catch (error) {
      message.error(t('errorFetchingAgents'));
    }
    setLoading(false);
  };

  const approveAgent = async (id) => {
    try {
      await AgentService.SetAgentStatus(id, AgentStatus.APPROVED);
      message.success(t('agentapprovedsuccessfully'));

      fetchAgents();
    } catch (error) {
      message.error(t('failedtoapproveagent'));
    }
  };

  const approveCertificate = async (id) => {
    try {
      const status = CertificateStatus.Approved;
      await AgentCertificateService.SetCertificateStatus(id, status);
      message.success(t('CertificateApprovedSuccessfully'));
      fetchAgents();
    } catch (error) {
      message.error(t('FailedToApproveSuccessfully'));
    }
  };

  const rejectCertificate = async () => {
    if (!rejectionReason.trim()) {
      message.error(t('enterReasonError'));
      return;
    }

    try {
      const status = CertificateStatus.Rejected;
      await AgentCertificateService.SetCertificateStatus(selectedCertificateId, status, rejectionReason);
      message.success(t('CertificatedIsRejectedSuccessfully'));
      setIsModalVisible(false);
      setRejectionReason("");
      fetchAgents();
    } catch (error) {
      message.error(t('FailedToRejectCertificateSuccessfully'));
    }
  };

  const showRejectionModal = (id) => {
    setSelectedCertificateId(id);
    setIsModalVisible(true);
  };

  const canApproveAgent = (agent) => {
    return agent.certificates?.every(cert => cert.status === CertificateStatus.Approved);
  };

  const columns = [
    {
      title: t('name'),
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: t('phoneNumber'),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: t('email'),
      dataIndex: "email",
      key: "email",
      render: (email) => email,
    },
    {
      title: t('actions'),
      key: "actions",
      render: (_, record) =>
        canApproveAgent(record) && (
          <Can permission={PERMISSIONS.AGENTS.APPROVE_AGENTS}>
            <Button data-testid="approve-agents-form-approve-btn" type="primary" icon={<CheckCircleOutlined />} onClick={() => approveAgent(record.id)}>
              {t('approve')}
            </Button>
          </Can>
        ),
    },
  ];

  const expandedRowRender = (record) => {
    const certificateColumns = [
      {
        title: t('certificateName'),
        dataIndex: "name",
        key: "name",
      },
      {
        title: t('status'),
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <Tag color={status === CertificateStatus.PendingApproval ? "orange" : status === CertificateStatus.Approved ? "green" : "red"}>
            {translateEnum(status, 'certificateStatus')}
          </Tag>
        ),
      },
      {
        title: t('expirationDate'),
        dataIndex: "expirationDate",
        key: "expirationDate",
        render: (date) => date || "N/A",
      },
      {
        title: t('actions'),
        key: "actions",
        render: (_, certificate) => (
          <>
            <FilePreview documentId={certificate.documentId} />

            {certificate.status === CertificateStatus.PendingApproval && (
              <Can permission={PERMISSIONS.AGENTS.APPROVE_AGENTS_CERTIFICATES}>
                <Button data-testid="approve-agents-form-approve-certificate-btn" type="link" icon={<CheckCircleOutlined />} style={{ color: "green" }} onClick={() => approveCertificate(certificate.id)}>
                  {t('approve')}
                </Button>
              </Can>
            )}
            {(certificate.status === CertificateStatus.PendingApproval || certificate.status === CertificateStatus.Approved) && (
              <Can permission={PERMISSIONS.AGENTS.REJECT_AGENTS_CERTIFICATES}>
                <Button data-testid="approve-agents-form-reject-certificate-btn" type="link" icon={<CloseCircleOutlined />} style={{ color: "red" }} onClick={() => showRejectionModal(certificate.id)}>
                  {t('reject')}
                </Button>
              </Can>
            )}
          </>
        ),
      },
    ];

    return <Table columns={certificateColumns} dataSource={record.certificates} rowKey="id" pagination={false} />;
  };

  return (
    <Can permission={PERMISSIONS.AGENTS.VIEW} fallback={<NoPermission />}>
      <Table dataSource={agents} columns={columns} rowKey="id" loading={loading} expandable={{ expandedRowRender }} bordered />

      <Modal
        title={t('CertificateRejection')}
        visible={isModalVisible}
        onOk={rejectCertificate}
        onCancel={() => setIsModalVisible(false)}
        okText={t('reject')}
        cancelText={t('cancel')}
        maskClosable={false}
      >
        <p>{t('enterReason')}</p>
        <TextArea data-testid="approve-agents-form-reject-certificate-reason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={4} />
      </Modal>
    </Can>
  );
};

export default AgentsApproval;
