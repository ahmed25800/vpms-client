import React, { useEffect, useRef, useState } from "react";
import { Row, Upload, message, Col, Button, Tag } from "antd";
import { GetDocumentUrl } from "../../../services/DocumentsService";
import { ApproveInspection, GetInspectionData, StartInspection, StartReInspection } from "../../../services/InspectionService";
import { DownloadOutlined, CheckOutlined, CloseOutlined, RedoOutlined } from "@ant-design/icons";
import LoadingSpinner from "../../LoadingSpinner";
import NoData from "../../NoData";
import InspectionTable from "./InspectionTable";
import AttachedDocuments from "../AttachedDocuments";
import { DocumentTypeEnum, ApprovalStatus } from "../../../constants/enums";
import { RejectTransactionDetail, UploadDetailDocument } from "../../../services/PCTransactionsService";
import RejectionModal from "../RejectionModal";
import { useTranslation } from 'react-i18next'; 
import PERMISSIONS from "../../../constants/Permissions";
import Can from "../../Can";
import ExceptionRequestModal from "../ExceptionRequestModal";


export default ({ transactionId, handleClickPayment, OnApprove }) => {
    const { t } = useTranslation(); 
    const [loading, setLoading] = useState({ dataLoading: false, uploadLoading: false, startInspection: false, approveDetail: false });
    const [inspectioData, setInspectionData] = useState(null);
    const attachedDocumentsRef = useRef();
    const [canApprove, setCanApprove] = useState(false);
    const [rejectionRecord, setRejectionRecord] = useState({ rejectionModal: false })


    useEffect(() => {
        fetchInspection();
    },[]);

    const fetchInspection = async () => {
        try {
            setLoading({ ...loading, dataLoading: true });
            const data = await GetInspectionData(transactionId);
            if (!data) throw data;
            setInspectionData(data);
            setLoading({ ...loading, dataLoading: false });
        } catch (error) {
            setLoading({ ...loading, dataLoading: false });
        }
    };
    const handleReject = async (reason) => {
        await RejectTransactionDetail({ Id: inspectioData.transactionDetailId, Reason: reason });
        setRejectionRecord({ rejectionModal: false })
        fetchInspection();
    };
    const handleStartInspection = async () => {
        try {
            setLoading({ ...loading, startInspection: true });
            const data = await StartInspection({ TransctionId: transactionId });
            if (data && data.isSuccess) message.success(t("inspectionStarted")); 
            fetchInspection();
            setLoading({ ...loading, startInspection: false });
        } catch (error) {
            setLoading({ ...loading, startInspection: false });
        }
    };
    const handleReInspection = async () => {
        try {
            setLoading({ ...loading, startInspection: true });
            const data = await StartReInspection({ TransctionId: transactionId });
            if (data && data.isSuccess) message.success(t("inspectionStarted")); 
            await fetchInspection();
            attachedDocumentsRef.current.reloadData();
            setLoading({ ...loading, startInspection: false });
        } catch (error) {
            setLoading({ ...loading, startInspection: false });
        }
    };
    const handleDownload = async (obj) => {
        let url = GetDocumentUrl(obj.documentId);
        const link = document.createElement("a");
        link.href = url;
        link.target = '_blank';
        link.setAttribute("download", obj.documentName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleUpload = async (info, record) => {
        try {
            var formData = {
                Document: info.file,
                DocumentName: record.documentName,
                PCTransactionId: transactionId,
                DocumentTypeId: DocumentTypeEnum.Inspection,
                PCTransactionDetailId: inspectioData.transactionDetailId
            };
            var response = await UploadDetailDocument(formData);
            message.success(t("inspectionFileAddedSuccessfully")); 
            attachedDocumentsRef.current.reloadData();
        } catch (err) {
            message.error(t("errorAddingInspectionFile")); 
        }
    };
    const handleApprovDetail = async (exception) => {
        try {
            setLoading({ ...loading, approveDetail: true });
            var response = await ApproveInspection({ DetailId: inspectioData.transactionDetailId ,IsExcepted : !!exception ,ExceptionReason:exception||""});
            if (response.isSuccess) {
                message.success(t("inspectionApprovedSuccessfuly")); 
            }
            setLoading({ ...loading, approveDetail: false });
            if (OnApprove) OnApprove();
        } catch (err) {
            setLoading({ ...loading, approveDetail: true });
            message.error(t("errorApprovingInspection")); 
        }
    };
    const handleDocumentsFetchedData = (data) => {
        if (data.length == 0 || data.length < 2) return;
        if (data.some(d => d.status !== ApprovalStatus.Approved)) {
            setCanApprove(false);
        }
        else {
            setCanApprove(true);
        }
    };
    if (loading.dataLoading) {
        return <LoadingSpinner loading={loading.dataLoading} />;
    }
    if (!inspectioData) return <NoData></NoData>
    return (<Row gutter={[16, 16]}>

        <Col span={24}>
            {!inspectioData.transactionDetailId && <Can permission={PERMISSIONS.INSPECTION.CREATE}><Button data-testid="start_inspection_btn" type="primary" onClick={handleStartInspection} loading={loading.startInspection}>{t("startInspection")}</Button></Can>} 
            {inspectioData.templates.length > 0 && <Button data-testid="inspection_first_download_btn" style={{ margin: 2 }} type="default" icon={<DownloadOutlined />} onClick={() => handleDownload(inspectioData.templates[0])}>
                {inspectioData.templates[0].documentName}
            </Button>}
            {inspectioData.templates.length > 1 && <Button data-testid="inspection_second_download_btn" style={{ margin: 2 }} type="default" icon={<DownloadOutlined />} onClick={() => handleDownload(inspectioData.templates[1])}>
                {inspectioData.templates[1].documentName}
            </Button>}

            {rejectionRecord.rejectionModal && (
                <RejectionModal
                    key={inspectioData.transactionDetailId}
                    visible={rejectionRecord.rejectionModal}
                    title={t("rejectInspection")} 
                    onCancel={() => setRejectionRecord({ rejectionModal: false })}
                    onConfirm={handleReject}
                />
            )}
            <InspectionTable inspections={inspectioData.inspections} OnPaymentClicked={handleClickPayment} ></InspectionTable>

        </Col>

        {inspectioData.transactionDetailId && (
            <>

                <Col span={24} style={{ marginTop: 10 }}>
                    <AttachedDocuments parentStatus={inspectioData.status} DocumentPermissions={PERMISSIONS.INSPECTION.DOCUMENT} 
                    OnUpload={handleUpload} documentTypeId={DocumentTypeEnum.Inspection} 
                    ref={attachedDocumentsRef} onFetchedData={handleDocumentsFetchedData} 
                    detailId={inspectioData.transactionDetailId} />
                </Col>

                <Col span={24}>
                    {inspectioData.status == ApprovalStatus.Pending && (
                        <>
                            {canApprove &&
                                <Can permission={PERMISSIONS.INSPECTION.APPROVE}>
                                    <Button data-testid="inspection_approve_btn" loading={loading.approveDetail} type="default"
                                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', margin: 2, color: '#fff' }}
                                        icon={<CheckOutlined />} onClick={()=>handleApprovDetail()}>
                                        {t("approve")} 
                                    </Button>
                                </Can>
                            }
                             <Can permission={PERMISSIONS.INSPECTION.EXCEPTION}>
                                <ExceptionRequestModal onConfirm={handleApprovDetail}></ExceptionRequestModal>
                            </Can>
                            <Can permission={PERMISSIONS.INSPECTION.REJECT}>
                                <Button data-testid="inspection_reject_btn" style={{ margin: 2 }} onClick={() => setRejectionRecord({ rejectionModal: true })} type="default" danger icon={<CloseOutlined />}>
                                    {t("reject")} 
                                </Button>`
                            </Can>
                           
                        </>
                    )}
                    {inspectioData.status != ApprovalStatus.Approved&&inspectioData.status != ApprovalStatus.Excepted&&<Can permission={PERMISSIONS.INSPECTION.CREATE}>
                        <Button  data-testid="reinspection_btn" type="primary" style={{ background: 'rgb(23 108 113)', margin: 2 }} onClick={handleReInspection} loading={loading.startInspection} variant="filled" icon={<RedoOutlined />}>
                            {t("reInspect")} 
                        </Button>
                    </Can> }
                </Col>
            </>
        )}


    </Row>);

}