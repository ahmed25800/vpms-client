import React, { useState, useRef, useEffect, Children } from "react";
import { Upload, Button, message, Row, Col, Card, Tag, Tabs } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  ApproveExitPermit,
  CreateExitPermit,
  GetExitPermit,
  RejectTransactionDetail,
  UploadDetailDocument,
} from "../../services/PCTransactionsService";
import { ApprovalStatus, DocumentTypeEnum } from "../../constants/enums";
import AttachedDocuments from "./AttachedDocuments";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import RejectionModal from "./RejectionModal";
import LoadingSpinner from "../LoadingSpinner";
import { useTranslation } from "react-i18next";
import PERMISSIONS from "../../constants/Permissions";
import ExceptionRequestModal from "./ExceptionRequestModal";
import Can from "../Can";
import VesselExitPermitReport from "./Reports/ExitPermitReport";

const { TabPane } = Tabs;

const ExitPermit = ({ transactionId, OnApprove }) => {
  const { t } = useTranslation();
  const attachedDocumentsRef = useRef();
  const [loading, setLoading] = useState(false);
  const [exitPermitData, setExitPermitData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [canApprove, setCanApprove] = useState(false);
  const [canReject, setCanReject] = useState(false);
  const [rejectionRecord, setRejectionRecord] = useState({
    rejectionModal: false,
  });

  const handleOnApprove = async (exception) => {
    try {
      setApproveLoading(true);
      await ApproveExitPermit({
        DetailId: exitPermitData.transactionDetailId,
        IsExcepted: !!exception,
        ExceptionReason: exception || "",
      });
      setApproveLoading(false);
      OnApprove();
    } catch (error) {
      setApproveLoading(false);
    }
  };
  const handleReject = async (reason) => {
    setRejectionRecord({ rejectionModal: false });
    await RejectTransactionDetail({
      Id: exitPermitData.transactionDetailId,
      Reason: reason,
    });
    fetchExitPermit();
  };
  useEffect(() => {
    fetchExitPermit();
  }, [transactionId]);
  const fetchExitPermit = async () => {
    try {
      setDataLoading(true);
      const data = await GetExitPermit(transactionId);
      setExitPermitData(data);
      setDataLoading(false);
    } catch (error) {
      setDataLoading(false);
    }
  };
  const handleUpload = async (info) => {
    try {
      var formData = {
        Document: info.file,
        DocumentName: t("exitPermitReport"),
        PCTransactionId: transactionId,
        DocumentTypeId: DocumentTypeEnum.Payment,
        PCTransactionDetailId: exitPermitData.transactionDetailId,
      };
      setLoading(true);
      var response = await UploadDetailDocument(formData);
      setLoading(false);
      message.success(t("exitReportAdded"));
      attachedDocumentsRef.current.reloadData();
    } catch (err) {
      setLoading(false);
      message.error(t("errorAddingExitReport"));
    }
  };

  const handleOnDocumentsFetched = (data) => {
    if (data.length === 0) {
      return;
    }
    if (data.some((d) => d.status === ApprovalStatus.Approved)) {
      setCanApprove(true);
    } else {
      setCanApprove(false);
    }
    if (data.some((d) => d.status === ApprovalStatus.Rejected)) {
      setCanReject(true);
    }
  };

  const handleSaveExitPermit = async (info) => {
    let obj = { TransactionId: transactionId, Report: info.file };
    try {
      setLoading(true);
      await CreateExitPermit(obj);
      setLoading(false);
      fetchExitPermit();
    } catch {
      setLoading(false);
    }
  };
  if (dataLoading) return <LoadingSpinner loading={dataLoading} />;
  if (!exitPermitData) {
    return (
      <>
        <Upload
          data-testid="save_ex_report_upload"
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleSaveExitPermit}
        >
          <Button loading={loading} icon={<UploadOutlined />}>
            {t("selectReport")}
          </Button>
        </Upload>
      </>
    );
  }
  return (
    <Tabs defaultActiveKey="1"
      items={[
        {
          key: "1",
          label: t("exitPermitReport"),
          children: <Row gutter={16}>
            {exitPermitData.approvalStatus === ApprovalStatus.Approved && (
              <Col>
                <Tag color="green">{t("approved")}</Tag>
              </Col>
            )}
            {exitPermitData.approvalStatus === ApprovalStatus.Rejected && (
              <Col>
                <Tag color="red">{t("rejected")}</Tag>
                <Tag color="red">{exitPermitData.rejectionReason}</Tag>
              </Col>
            )}
            {exitPermitData.approvalStatus === ApprovalStatus.Excepted && (
              <Col>
                <Tag color="cyan">{t("exception")}</Tag>
                <Tag color="cyan">{exitPermitData.exceptionReason}</Tag>
              </Col>
            )}
            <Col style={{ marginTop: 5 }} xs={24} md={24}>
              <Card>
                {rejectionRecord.rejectionModal && (
                  <RejectionModal
                    key={exitPermitData.transactionDetailId}
                    visible={rejectionRecord.rejectionModal}
                    title={t("rejectPayment")}
                    onCancel={() => setRejectionRecord({ rejectionModal: false })}
                    onConfirm={handleReject}
                  />
                )}
                {!canApprove && (
                  <Upload
                    data-testid="ex_report_upload"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleUpload}
                  >
                    <Button loadind={loading} icon={<UploadOutlined />}>
                      {t("uploadReport")}
                    </Button>
                  </Upload>
                )}
                <AttachedDocuments
                  parentStatus={exitPermitData.approvalStatus}
                  DocumentPermissions={PERMISSIONS.EXIT_PERMIT.DOCUMENT}
                  documentTypeId={DocumentTypeEnum.ExitReport}
                  ref={attachedDocumentsRef}
                  onFetchedData={handleOnDocumentsFetched}
                  detailId={exitPermitData.transactionDetailId}
                />
              </Card>
            </Col>

            <Col span={24} style={{ textAlign: "left", marginTop: "20px" }}>
              {canApprove &&
                exitPermitData.approvalStatus === ApprovalStatus.Pending && (
                  <Button
                    data-testid="approve_ex_permit"
                    loading={approveLoading}
                    type="default"
                    style={{
                      backgroundColor: "#52c41a",
                      borderColor: "#52c41a",
                      margin: "5px",
                      color: "#fff",
                    }}
                    icon={<CheckOutlined />}
                    onClick={() => handleOnApprove()}
                  >
                    {t("approve")}
                  </Button>
                )}
              {canReject &&
                exitPermitData.approvalStatus === ApprovalStatus.Pending && (
                  <Button
                    data-testid="reject_ex_permit"
                    onClick={() => setRejectionRecord({ rejectionModal: true })}
                    type="default"
                    danger
                    icon={<CloseOutlined />}
                  >
                    {t("reject")}
                  </Button>
                )}
              {exitPermitData.approvalStatus === ApprovalStatus.Pending && (
                <Can permission={PERMISSIONS.EXIT_PERMIT.EXCEPTION}>
                  <ExceptionRequestModal onConfirm={handleOnApprove} />
                </Can>
              )}
            </Col>
          </Row>,

        },
        {
          key: "2",
          label: t("exitPermit"),
          children: <VesselExitPermitReport detailId={exitPermitData.transactionDetailId} />,
          disabled: exitPermitData.approvalStatus !== ApprovalStatus.Approved && exitPermitData.approvalStatus !== ApprovalStatus.Excepted
        }
      ]} />

  );
};

export default ExitPermit;