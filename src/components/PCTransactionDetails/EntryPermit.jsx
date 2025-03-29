import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Upload, message, Tag, Tooltip, Row, Col, Modal, Select, Form, Popconfirm } from 'antd';
import { UploadOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { GetEntryPermit, UploadDetailDocument, ApproveEntryPermit, RejectTransactionDetail } from '../../services/PCTransactionsService';
import { ApprovalStatus, CertificateTypeEnum, DocumentTypeEnum, GetKeyByValue } from '../../constants/enums';
import { GetCertificateTypes } from '../../services/CetificatesService';
import formValidationRules from '../../constants/formValidationRules';
import AttachedDocuments from './AttachedDocuments';
import LoadingSpinner from '../LoadingSpinner';
import NoData from '../NoData';
import EntryPermitReport from './Reports/EntryPermitReport';
import RejectionModal from './RejectionModal';
import { useTranslation } from 'react-i18next';
import Can from '../Can';
import PERMISSIONS from '../../constants/Permissions';
import ExceptionRequestModal from './ExceptionRequestModal';

const EntryPermit = ({ TransactionId, handleOnApprove }) => {
    const { t } = useTranslation();
    const [masterData, setMasterData] = useState([]);
    const [loading, setLoading] = useState({ dataLoading: false, certTypesLoading: false, saveLoading: false, approveLoading: {}, approveDetail: false });
    const [detailId, setDetailId] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [certificateTypes, setCertificateTypes] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [canApprove, setCanApprove] = useState(false);
    const [rejectionRecord, setRejectionRecord] = useState({ rejectionModal: false })
    const [certForm] = Form.useForm()
    const attachedDocumentsRef = useRef();
    useEffect(() => {
        fetchEntryPermitData();
    }, []);

    const fetchEntryPermitData = async () => {
        try {
            debugger;
            setLoading({ ...loading, dataLoading: true });
            const data = await GetEntryPermit(TransactionId);
            setMasterData([data.transaction]);
            setDetailId(data.transactionDetailId)
            setLoading({ ...loading, dataLoading: false });
        } catch (error) {
            setLoading({ ...loading, dataLoading: false });
            message.error(t("errorFetchingData"));
        }
    };

    const fetchCertificateTypes = async () => {
        try {
            setLoading({ ...loading, certTypesLoading: true });
            const types = await GetCertificateTypes(CertificateTypeEnum.VESSEL_CERTIFICATE);
            setCertificateTypes(types);
            setLoading({ ...loading, certTypesLoading: false });
        } catch (error) {
            setLoading({ ...loading, certTypesLoading: false });
        }
    };

    const handleUpload = async (values) => {
        try {
            const selectedOption = certificateTypes.find((option) => option.value === values.DocumentType);
            var formData = {
                Document: values.Document.file,
                DocumentName: selectedOption.label,
                CertificateTypeId: selectedOption.value,
                PCTransactionId: masterData[0].id,
                DocumentTypeId: DocumentTypeEnum.Certificate,
                PCTransactionDetailId: detailId
            };
            setLoading({ ...loading, saveLoading: true });
            var response = await UploadDetailDocument(formData);
            setLoading({ ...loading, saveLoading: false });
            message.success(t("certificateAdded"));
            certForm.resetFields();
            setFileList();
            attachedDocumentsRef.current.reloadData();
        } catch (err) {
            setLoading({ ...loading, saveLoading: false });
            message.error(t("errorAddingCertificate"));
        }
    };
    const openUploadModal = () => {
        fetchCertificateTypes();
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleDocumentsFetchedData = (data) => {
        if (data.length == 0) return;
        checkApproval(data)
    }
    function checkApproval(data) {
        debugger;
        let checkCanApprove = true;

        if (data.some(d => d.status !== ApprovalStatus.Approved)) {
            const groupedData = data.reduce((groups, item) => {
                (groups[item.documentName] = groups[item.documentName] || []).push(item);
                return groups;
            }, {});

            for (const id in groupedData) {
                const group = groupedData[id];
                const approved = group.some(item => item.status === ApprovalStatus.Approved);
                const notApproved = group.some(item => item.status !== ApprovalStatus.Approved);

                if (!approved && notApproved) {
                    checkCanApprove = false;
                    break;
                }
            }
        }
        setCanApprove(checkCanApprove);
    }
    const handleApprovDetail = async (exception) => {
        try {

            setLoading({ ...loading, approveDetail: true });
            var response = await ApproveEntryPermit({ Id: detailId, IsExcepted: !!exception, ExceptionReason: exception || "" });
            if (response.isSuccess) {
                message.success(t("entryPermitApproved"));
            }
            setLoading({ ...loading, approveDetail: false });
            handleOnApprove()
        } catch (err) {
            setLoading({ ...loading, approveDetail: false });
            message.error(t("errorApprovingEntryPermit"));
        }

    };
    const handleReject = async (reason) => {
        await RejectTransactionDetail({ Id: detailId, Reason: reason });
        setRejectionRecord({ rejectionModal: false })
        fetchEntryPermitData();
    };
    const masterColumns = [
        {
            title: t("vesselName"),
            dataIndex: "vesselName",
            key: "vesselName",
        },
        {
            title: t("agentName"),
            dataIndex: "agentName",
            key: "agentName",
        },
        {
            title: t("portName"),
            dataIndex: "portName",
            key: "portName",
        },
        {
            title: t("totalPayment"),
            dataIndex: "totalPayment",
            key: "totalPayment",
        },
        {
            title: t("arrivalDate"),
            dataIndex: "arrivalDate",
            key: "arrivalDate",
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: t("status"),
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => {
                const color =
                    record.status === ApprovalStatus.Approved
                        ? 'green'
                        : record.status === ApprovalStatus.Pending
                            ? 'orange'
                            : record.status === ApprovalStatus.Excepted
                                ? 'cyan'
                                : 'red';
                return <>
                    <Tag color={color}>{t(GetKeyByValue(ApprovalStatus, record.status))}</Tag>
                    {record.status == ApprovalStatus.Rejected && <Tag color={color}>{record.rejectionReason}</Tag>}
                </>;
            },
        },
    ];



    const changeFileList = (info) => {
        setFileList([info.file])
    }
    if (loading.dataLoading) {
        return (<LoadingSpinner loading={loading.dataLoading} />);
    }
    if (masterData.length == 0) {
        return (<NoData />);
    }
    return (
        <Row gutter={[16, 16]} justify="start">
            {/* {masterData[0].status === ApprovalStatus.Approved &&
                <Col span={24}>
                    <EntryPermitReport detailId={detailId}></EntryPermitReport>
                </Col>
            } */}
            <Col span={24}>
                <h3>{t("transactionDetails")}</h3>
                {rejectionRecord.rejectionModal && (
                    <RejectionModal
                        key={detailId}
                        visible={rejectionRecord.rejectionModal}
                        title={t("rejectEntryPermit")}
                        onCancel={() => setRejectionRecord({ rejectionModal: false })}
                        onConfirm={handleReject}
                    />
                )}
                <Table columns={masterColumns} dataSource={masterData} rowKey="id" loading={loading.dataLoading} bordered pagination={false} />
            </Col>
            {masterData[0].status === ApprovalStatus.Pending &&
                <Col span={24} style={{ textAlign: 'left', marginTop: '20px' }}>
                    <Button type="default" icon={<UploadOutlined />} onClick={openUploadModal}>
                        {t("uploadDocument")}
                    </Button>
                </Col>
            }
            <Col span={24} style={{ marginTop: '10px' }}>
                <AttachedDocuments parentStatus={masterData[0].status} DocumentPermissions={PERMISSIONS.ENTRY_PERMIT.DOCUMENT} documentTypeId={DocumentTypeEnum.Certificate} ref={attachedDocumentsRef} onFetchedData={handleDocumentsFetchedData} detailId={detailId} />
            </Col>
            {masterData[0].status === ApprovalStatus.Pending && (

                <Col span={24} style={{ textAlign: 'left', marginTop: '20px' }}>
                    {canApprove && (<>
                        <Can permission={PERMISSIONS.ENTRY_PERMIT.APPROVE}>
                            <Button loading={loading.approveDetail} type="default"
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', margin: 2, color: '#fff' }} icon={<CheckOutlined />}
                                onClick={() => handleApprovDetail()}>
                                {t("approve")}
                            </Button>
                        </Can>

                    </>)}
                    <Can permission={PERMISSIONS.ENTRY_PERMIT.EXCEPTION}>
                        <ExceptionRequestModal onConfirm={handleApprovDetail} ></ExceptionRequestModal>
                    </Can>
                    <Can permission={PERMISSIONS.ENTRY_PERMIT.REJECT}>
                        <Button style={{ margin: 2 }} onClick={() => setRejectionRecord({ rejectionModal: true })} type="default" danger icon={<CloseOutlined />}>
                            {t("reject")}
                        </Button>
                    </Can>


                </Col>)}
            <Modal
                title={t("uploadDocument")}
                open={modalVisible}
                onCancel={closeModal}
                width={600}
                onOk={() => { certForm.submit() }}
                confirmLoading={loading.saveLoading}
                okText={t("addDocument")}
            >
                <Form form={certForm} layout="vertical" onFinish={handleUpload}>
                    <Form.Item name="DocumentType" label={t("selectCertificateType")} rules={[formValidationRules.required]}>
                        <Select
                            loading={loading.certTypesLoading}
                            placeholder={t("selectCertificateType")}
                            options={certificateTypes.map((cer) => ({ label: cer.label, value: cer.value }))}
                        />

                    </Form.Item>
                    <Form.Item name="Document" label={t("chooseFile")} rules={[formValidationRules.required]}>
                        <Upload
                            maxCount={1}
                            showUploadList={{
                                showPreviewIcon: false,
                                showRemoveIcon: false,
                                showDownloadIcon: false,
                            }}
                            fileList={fileList}
                            onChange={changeFileList}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>{t("chooseFile")}</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </Row>
    );
};

export default EntryPermit;