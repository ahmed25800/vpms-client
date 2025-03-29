import React, { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import { Table, Button, Upload, message, DatePicker, Form } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { DeleteVesselCertificate, GetCertificates, SaveVesselCertificate } from "../../services/VesselsService";
import { CertificateTypeEnum, CertificateStatusEnum, DocumentTypeEnum } from "../../constants/enums";
import moment from 'moment';
import CheckHasPermission from '../CheckHasPermission';
import { useTranslation } from 'react-i18next';
import Can from "../Can";
import PERMISSIONS from "../../constants/Permissions";

const VesselCertificates = forwardRef(({ VesselId }, ref) => {
    const { t } = useTranslation();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tableKey, settTableKey] = useState(0);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchCertificates();
    }, []);

    async function fetchCertificates() {
        try {
            settTableKey(prev => prev + 1);
            const data = await GetCertificates({ CertificateType: CertificateTypeEnum.VESSEL_CERTIFICATE, VesselId, AgentId: 0 });
            setCertificates(Array.isArray(data) ? data : []);
        } catch (error) {
            setCertificates([]);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 200);
        }
    }

    useImperativeHandle(ref, () => ({
        reloadData: () => {
            fetchCertificates();
        },
        getAllCertificates: () => {
            const values = form.getFieldsValue();
            const certificatesToUpload = [];
            Object.keys(values).forEach((certificateId) => {
                const { file, date } = values[certificateId];
                if (!file || !date) {
                    if (VesselId) return;
                    message.error(t("pleaseUploadDocument"));
                    throw new Error("Not Valid!");
                }
                certificatesToUpload.push({
                    CertificateId: certificateId,
                    Document: file[0].originFileObj,
                    DateOfExpire: date.format('YYYY-MM-DDTHH:mm:ss'),
                    DocumentTypeId: DocumentTypeEnum.Certificate,
                    VesselId: VesselId,
                });
            });
            return certificatesToUpload;
        },
    }));

    const handleSubmit = async (values, certificateId) => {
        const formData = new FormData();
        let file = values[certificateId].file[0];
        let date = values[certificateId].date;
        if (!file || !date) {
            message.error(t("pleaseUploadDocument"));
            return;
        }
        formData.append("Document", file.originFileObj);
        formData.append("DateOfExpire", date.format('YYYY-MM-DDTHH:mm:ss'));
        formData.append("CertificateId", certificateId);
        formData.append("DocumentTypeId", DocumentTypeEnum.Certificate);
        formData.append("VesselId", VesselId);

        try {
            await SaveVesselCertificate(formData);
            message.success(t("certificateSaved"));
            fetchCertificates();
        } catch (error) {
            message.error(t("certificateFailed"));
        }
    };

    const handleDelete = async (certificateId) => {
        try {
            await DeleteVesselCertificate({ CertificateId: certificateId, VesselId: VesselId });
            message.success(t("certificateDeleted"));
            fetchCertificates();
        } catch (error) {
            message.error(t("certificateDeletionFailed"));
        }
    };

    const columns = [
        {
            title: t("certificateName"),
            dataIndex: "name",
            key: "name",
        },

        {
            title: t("upload"),
            key: "upload",
            render: (_, record) => (
                <Form.Item
                    name={[record.id, "file"]}
                    valuePropName="fileList"
                    getValueFromEvent={(e) => {
                        return e && Array.isArray(e.fileList) ? e.fileList : [];
                    }}
                >
                      
                            <Upload
                            key={record.id} 
                            beforeUpload={() => false}
                            showUploadList={record.documentId ? false : {
                                showPreviewIcon: false,
                                showRemoveIcon: false,
                                showDownloadIcon: false,
                            }}
                            fileList={[...(record.fileList || [])]}
                            maxCount={1}
                            
                            disabled={record.documentId || !CheckHasPermission(PERMISSIONS.VESSELS.SUBMIT_VESSEL_CERTIFICATES)}
                            onChange={(info) => {
                                console.log(info);
                                form.setFieldsValue({ [record.id]: { file: info.fileList } });
                            }}
                        >
                            <Button data-testid={`choose_cert_btn_${record.id}`} icon={<UploadOutlined />}>{record.documentName ? record.documentName : t("chooseFile")}</Button>
                        </Upload>
                        

                </Form.Item>
            ),
        },
        {
            title: t("expirationDate"),
            key: "dateOfExpire",
            render: (_, record) => (
                <Form.Item name={[record.id, "date"]} initialValue={(record.documentId && record.dateOfExpire) ? moment(record.dateOfExpire) : null}>
                    <DatePicker data-testid={`vessel_cert_expire_${record.id}`} format="YYYY-MM-DD" placeholder={t('selectDate')} onChange={(date) => form.setFieldsValue({ [record.id]: { date } })} />
                </Form.Item>
            ),
        },
        {
            title: t("actions"),
            key: "actions",
            hidden: !VesselId,
            render: (_, record) => (
                <Form.Item>
                    {record.documentId ? (
                        <Can permission={PERMISSIONS.VESSELS.DELETE_VESSEL_CERTIFICATES}><Button data-testid={`del_vessel_cert_btn_${record.id}`} icon={<DeleteOutlined />} danger type="default" onClick={() => handleDelete(record.id)}>
                            {t("delete")}
                        </Button></Can>
                    ) : (
                        <Can permission={PERMISSIONS.VESSELS.SUBMIT_VESSEL_CERTIFICATES}><Button data-testid={`sub_vessel_cert_btn_${record.id}`} type="default" onClick={() => form.validateFields([[record.id, "file"], [record.id, "date"]])
                            .then(values => handleSubmit(values, record.id))
                            .catch(() => message.error(t("completeForm")))}>
                            📤 {t("submit")}
                        </Button></Can>
                    )}
                </Form.Item>
            ),
        },
    ];

    return (
        <Can permission={PERMISSIONS.VESSELS.VIEW_VESSEL_CERTIFICATES}>
            <div>
                <h3>{t("certificates")}</h3>
                <Form form={form}>
                    <Table  dataSource={certificates} columns={columns} rowKey="id" key={tableKey} loading={loading} />
                </Form>
            </div>
        </Can>

    );
});

export default VesselCertificates;