import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Table, Button, message, Tag, Tooltip, Upload } from 'antd';
import { CheckOutlined, UploadOutlined, CloseOutlined } from '@ant-design/icons';
import { GetDetailAttachedDocuments, ApproveDetailDocument, RejectDetailDocument } from '../../services/PCTransactionsService';
import { ApprovalStatus, GetKeyByValue } from '../../constants/enums';
import FilePreview from '../FileViewer';
import RejectionModal from './RejectionModal';
import { useTranslation } from 'react-i18next';
import Can from '../Can';

const AttachedDocuments = forwardRef(({ detailId, documentTypeId = 1, onFetchedData, OnUpload , DocumentPermissions , parentStatus}, ref) => {
    const { t } = useTranslation();
    const [documentsData, setdocumentsData] = useState();
    const [loading, setLoading] = useState({ dataLoading: false, approveLoading: {} });
    const [rejectionRecord, setRejectionRecord] = useState({ rejectionModal: false, record: null })
    useEffect(() => {
        fetchDocuments();
    },[]);

    const fetchDocuments = async () => {
        try {
            setLoading((prev) => ({ ...prev, dataLoading: true }));
            const data = await GetDetailAttachedDocuments(detailId, documentTypeId);
            setdocumentsData(data);
            if (onFetchedData) onFetchedData(data);
            setLoading((prev) => ({ ...prev, dataLoading: false }));
        } catch (error) {
            message.error(t("errorFetchingDocuments"));
            setLoading((prev) => ({ ...prev, dataLoading: false }));
        }
    };
    useImperativeHandle(ref, () => ({
        reloadData: () => {
            fetchDocuments();
        },

    }));
    const handleApproveDocument = async (record) => {
        try {
            setLoading((prev) => ({ ...prev, approveLoading: { ...prev.approveLoading, [record.id]: true } }));
            await ApproveDetailDocument({ Id: record.id });
            message.success(t("approvedSuccessfully"));
            fetchDocuments();
        } catch (error) {
            message.error(t("errorApprovingDocument"));
        } finally {
            setLoading((prev) => ({ ...prev, approveLoading: { ...prev.approveLoading, [record.id]: false } }));
        }
    };
    const handleReject = async (reason) => {
        await RejectDetailDocument({ Id: rejectionRecord.record.id, Reason: reason });
        setRejectionRecord({ rejectionModal: false, record: null })
        fetchDocuments();

    };
    return (
        <div>
            <h3>{t("attachedDocuments")}</h3>
            {rejectionRecord.rejectionModal && (
                <RejectionModal
                    key={rejectionRecord.record.id}
                    visible={rejectionRecord.rejectionModal}
                    title={t("rejectDocument")}
                    onCancel={() => setRejectionRecord({ rejectionModal: false, record: null })}
                    onConfirm={handleReject}
                />
            )}
            <Table columns={[
                { title: t("documentName"), dataIndex: 'documentName', key: 'documentName' },
                {
                    title: t("status"), dataIndex: 'status', key: 'status',
                    render: (_, record) => <>
                        <Tag color={record.status === ApprovalStatus.Approved ? 'green' : record.status === ApprovalStatus.Pending ? 'orange' : 'red'}>{t(GetKeyByValue(ApprovalStatus, record.status))}</Tag>
                        {record.status === ApprovalStatus.Rejected && <Tag color={'red'}>{record.rejectionReason}</Tag>}
                    </>
                },
                {
                    title: t("actions"), key: 'actions',
                    render: (_, record) => (
                        <>
                            <FilePreview documentId={record.documentId} />
                            {!record.hasUpload && record.status === ApprovalStatus.Pending && parentStatus === ApprovalStatus.Pending && (
                            <>
                                <Can permission={DocumentPermissions.APPROVE}><Tooltip title={t("approve")}>
                                    <Button data-testid="approve_doc" loading={loading.approveLoading[record.id]} icon={<CheckOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} size="medium" type="primary" onClick={() => handleApproveDocument(record)} />
                                </Tooltip></Can>
                        
                                <Can permission={DocumentPermissions.REJECT}><Tooltip title={t("reject")}>
                                    <Button
                                        icon={<CloseOutlined />}
                                        style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f", color: "#fff", margin: 2 }}
                                        size="medium"
                                        type="primary"
                                        data-testid="reject_doc" 
                                        onClick={() => setRejectionRecord({ rejectionModal: true, record: record })}
                                    />
                                </Tooltip></Can>
                            </>
                            )}
                            {record.hasUpload && (<Upload data-testid="upload_doc"  loading={loading.uploadLoading} showUploadList={false} beforeUpload={() => false} onChange={(info) => OnUpload(info, record)}>
                                <Button icon={<UploadOutlined />}>{t("upload")}</Button>
                            </Upload>)}

                        </>
                    )
                }
            ]} dataSource={documentsData} rowKey="documentId" loading={loading.dataLoading} bordered pagination={{ pageSize: 10 }} />
        </div>
    );
});

export default AttachedDocuments;