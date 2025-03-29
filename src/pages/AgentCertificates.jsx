import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Upload, message, DatePicker, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { GetCurrentAgentCertificates, setAgentCertificate } from "../services/AgentService";
import { CertificateTypeEnum, DocumentTypeEnum, CertificateStatus } from "../constants/enums";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { translateEnum } from "../utils/enumHelper"
import Can from "../components/Can";
import PERMISSIONS from "../constants/Permissions";

const AgentCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUpload, setLoadingUpload] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const { t } = useTranslation();

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await GetCurrentAgentCertificates(CertificateTypeEnum.AGENT_CERTIFICATE, 1, null);
      setCertificates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(t('errorFetchingAgentCertificates'));
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleUpload = async (file, record) => {
    setLoadingUpload((prev) => ({ ...prev, [record.id]: true }));
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success(`${file.name} ${t('uploadedsuccessfully')}`);
  
      setUploadedFiles((prev) => ({ ...prev, [record.id]: file }));
  
      setCertificates((prev) =>
        prev.map((cert) =>
          cert.id === record.id ? { ...cert, documentName: file.name } : cert
        )
      );
    } catch (error) {
      message.error(`${t('uploadfailed')} ${error.message}`);
    } finally {
      setLoadingUpload((prev) => ({ ...prev, [record.id]: false }));
    }
  };
  
  const handleDateChange = (date, record) => {
    if (!date || date.isBefore(moment(), "day")) {
      message.error(t('expirationDateMustBeFuture'));
      return;
    }
    setCertificates((prev) =>
      prev.map((cert) =>
        cert.id === record.id ? { ...cert, dateOfExpire: date.format("YYYY-MM-DDTHH:mm:ss") } : cert
      )
    );
  };

  const handleSubmit = async (file, record) => {
    const { id, dateOfExpire } = record;

    if (!uploadedFiles[id] || !dateOfExpire) {
      message.error(t('uploaddocumentwithexpiration'));
      return;
    }

    setLoadingSubmit((prev) => ({ ...prev, [record.id]: true }));

    const formData = new FormData();
    formData.append("Document", uploadedFiles[id]);
    formData.append("CertificateId", id);
    formData.append("DocumentTypeId", DocumentTypeEnum.Certificate);
    formData.append("AgentId", 1);
    formData.append("DateOfExpire", dateOfExpire);

    try {
      await setAgentCertificate(formData);
      message.success(t('certificateSavedSuccessfully'));
      await fetchCertificates();
    } catch (error) {
      message.error(t('certificateSubmissionFailed'));
    } finally {
      setLoadingSubmit((prev) => ({ ...prev, [record.id]: false }));
    }
  };

  const columns = [
    {
      title: t('certificateName'),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t('status'),
      dataIndex: "status",
      key: "status",
      render: (status) => translateEnum(status, 'certificateStatus')
    },
    {
      title: t('RejectionReason'),
      dataIndex: "rejectionReason",
      key: "rejectionReason",
      render: (text, record) => record.status === CertificateStatus.Rejected ? text || t('noReasonProvided') : "--",
    },
    {
      title: t('upload'),
      dataIndex: "documentName",
      key: "documentName",
      render: (text, record) => (
        <Upload
          showUploadList={false}
          beforeUpload={(file) => {
            handleUpload(file, record);
            setUploadedFiles((prev) => ({ ...prev, [record.id]: file }));
            return false;
          }}
          disabled={
            (record.status === CertificateStatus.Approved && moment().isSameOrBefore(moment(record.dateOfExpire))) ||
            loadingUpload[record.id]
          }
        >
          <Button
            data-testid="agents-certificates-form-upload-document-btn"
            icon={<UploadOutlined />}
            loading={loadingUpload[record.id]}
          >
            {record.documentName || t('upload')}
          </Button>
        </Upload>
      ),
    },
    {
      title: t('expirationDate'),
      dataIndex: "dateOfExpire",
      key: "dateOfExpire",
      render: (date, record) => (
        <DatePicker
          data-testid="agents-certificates-form-expiration-date"
          value={date ? moment(date) : null}
          format="YYYY-MM-DD"
          onChange={(value) => handleDateChange(value, record)}
          disabled={
            (record.status === CertificateStatus.Approved && moment().isSameOrBefore(moment(record.dateOfExpire))) ||
            loadingUpload[record.id]
          }
        />
      ),
    },
    {
      title: t('actions'),
      key: "actions",
      render: (_, record) => {
        debugger;
        const isStatusValid = [CertificateStatus.NA, CertificateStatus.Rejected].includes(record.status);
        const isExpired = moment().isAfter(moment(record.dateOfExpire));
    
        return (isStatusValid || isExpired) ? (
          <Can permission={PERMISSIONS.AGENTS.SUBMIT_AGENTS_CERTIFICATES}>
            <Button
              data-testid="agents-certificates-form-submit-btn"
              type="default"
              onClick={() => handleSubmit(record.documentName, record)}
              loading={loadingSubmit[record.id]}
            >
              📤 {t('submit')}
            </Button>
          </Can>
        ) : null;
      },
    },
  ];

  return (
    <div>
      <h1>{t('agentCertificates')}</h1>
      {loading ? <Spin size="large" /> : <Table dataSource={certificates} columns={columns} rowKey="id" />}
    </div>
  );
};

export default AgentCertificates;
