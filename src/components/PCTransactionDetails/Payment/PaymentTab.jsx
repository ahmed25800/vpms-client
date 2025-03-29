import React, { useState, useRef, useEffect } from "react";
import { Upload, Button, message, Row, Col, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UploadDetailDocument } from "../../../services/PCTransactionsService";
import { ApprovalStatus, DocumentTypeEnum, PaymentMethods } from "../../../constants/enums";
import AttachedDocuments from "../AttachedDocuments";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import Receipt from "./Reciept";
import RejectionModal from "../RejectionModal";
import { useTranslation } from 'react-i18next';
import Can from "../../Can";
import RefundRequestModal from "../RefundRequestModal";
import RefundTable from "./RefundTable";
import PrePaymentTable from "./PrePaymentTable";
import PaymentMethodSelector from "./PaymentMethodSelector";

const PaymentTab = ({ 
    transactionDetailId,
    paymentMethod,
    transactionId,
    hasApproval,
    OnApprove,
    OnReject ,
    PaymentPermissions ,
    approvalStatus, 
    refundModel,
    onRefreshPayment
    }) => {
    const { t } = useTranslation();
    const attachedDocumentsRef = useRef();
    const [canUpload, setCanUpload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [approveLoading, setApproveLoading] = useState(false);
    const [canApprove, setCanApprove] = useState(false);
    const [canReject, setCanReject] = useState(false);
    const [rejectionRecord, setRejectionRecord] = useState({ rejectionModal: false })

    const handleOnApprove = async () => {
        try {
            setApproveLoading(true);
            await OnApprove();
            setApproveLoading(false);

        } catch (error) {
            setApproveLoading(false);
        }
    };
    const handleReject = async (reason) => {
        setRejectionRecord({ rejectionModal: false });
        await OnReject(reason);
    };
    useEffect(() => {
    }, [transactionId]);

    const handleUpload = async (info) => {
        try {
            var formData = {
                Document: info.file,
                DocumentName: t("paymentReceipt"), 
                PCTransactionId: transactionId,
                DocumentTypeId: DocumentTypeEnum.Payment,
                PCTransactionDetailId: transactionDetailId,
            };
            setLoading(true);
            var response = await UploadDetailDocument(formData);
            setLoading(false);
            message.success(t("receiptAddedSuccessfully")); 
            attachedDocumentsRef.current.reloadData();

        } catch (err) {
            setLoading(false);
            message.error(t("errorAddingReceipt")); 
        }
    };

    const handleOnDocumentsFetched = (data) => {
        if (data.length === 0) { setCanUpload(true); return; }
        if (data.some(d => d.status !== ApprovalStatus.Approved)) {
            setCanApprove(false);
        }
        else {
            setCanApprove(true);
        }
        if (data.some(d => d.status == ApprovalStatus.Rejected)) {
            setCanReject(true);
        }
    };
   const handlePrePaymentDataBound = ()=>{
    setCanApprove(true);
    setCanReject(true);
   }
    return (
        <Row gutter={16}>
            <Col xs={24} md={12}>
            {rejectionRecord.rejectionModal && (
                        <RejectionModal
                            key={transactionDetailId}
                            visible={rejectionRecord.rejectionModal}
                            title={t("rejectPayment")} 
                            onCancel={() => setRejectionRecord({ rejectionModal: false })}
                            onConfirm={handleReject}
                        />
                    )}

                {paymentMethod && <>
                    { paymentMethod== PaymentMethods.directDepositPayment && <Card title={t("uploadReceipt")}> 
                        {canUpload && (
                            <Upload data-testid="upload_pc_payment" loading={loading} showUploadList={false} beforeUpload={() => false} onChange={handleUpload}>
                                <Button icon={<UploadOutlined />}>{t("uploadReceipt")}</Button> 
                            </Upload>
                        )}
                        <AttachedDocuments parentStatus={approvalStatus} DocumentPermissions={PaymentPermissions.DOCUMENT} documentTypeId={DocumentTypeEnum.Payment} ref={attachedDocumentsRef} onFetchedData={handleOnDocumentsFetched} detailId={transactionDetailId} />
                     </Card> }
                     { paymentMethod== PaymentMethods.preDepositPayment && <Card title={t("paymentRequest")}> 
                        <PrePaymentTable onDataBound={handlePrePaymentDataBound} detailId={transactionDetailId}></PrePaymentTable>
                     </Card> }

                </>}

                {!paymentMethod && <>
                    <Can permission={PaymentPermissions.CREATE}> 
                        <PaymentMethodSelector onMethodSelected={onRefreshPayment} detailId={transactionDetailId} ></PaymentMethodSelector>
                    </Can>
                </>}
              
              
                {refundModel && refundModel.paymentRefundRequests.length>0 &&   
                    <Card title={t("refundRequests")}> 
                        <RefundTable OnApprove={refundModel.RefreshData} paymentRefundRequests={refundModel.paymentRefundRequests} />
                    </Card>
                    
                }
                {canApprove && hasApproval && (
                    <Can permission={PaymentPermissions.APPROVE}>
                        <Button data-testid="approve_pc_payment" loading={approveLoading} type="default" style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', margin: '5px', color: '#fff' }} icon={<CheckOutlined />} onClick={handleOnApprove}>
                            {t("approvePayment")} 
                        </Button>
                    </Can>
                )}
                {canReject && hasApproval && (
                    <Can permission={PaymentPermissions.REJECT}>
                        <Button data-testid="reject_pc_payment" onClick={() => setRejectionRecord({ rejectionModal: true })} type="default" danger icon={<CloseOutlined />}>
                            {t("rejectPayment")} 
                        </Button>
                    </Can>
                )}
                {refundModel&& refundModel.canRequestRefund && (
                    <Can permission={refundModel.permissions.CREATE}>
                        <RefundRequestModal onConfirm={refundModel.requestRefund} />
                    </Can>
                )}
                      
            </Col>

            <Col xs={24} md={12}>
                <Card title={t("receiptDetails")}> 
                    <Receipt transactionDetialId={transactionDetailId} />
                </Card>
            </Col>
        </Row>
    );
};

export default PaymentTab;