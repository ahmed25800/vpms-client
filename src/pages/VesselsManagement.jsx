import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Table, Button, Modal, Form, Input, Select, message, Popconfirm, InputNumber } from "antd";
import { QuestionCircleOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { VesselTypes } from "../constants/enums";
import * as VesselsService from "../services/VesselsService";
import formValidationRules from "../constants/formValidationRules";
import VesselCertificates from "../components/Vessels/VesselCertificates";
import PERMISSIONS from "../constants/Permissions";
import Can from "../components/Can";
import { useTranslation } from "react-i18next";

const VesselsManagement = () => {
    const [vessels, setVessels] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vessel, setVessel] = useState(null);
    const [IsLoading, setIsLoading] = useState({ fetchDate: true, btnSave: false, btnDelete: false });
    const [form] = Form.useForm();
    const vesselCertificatesRef = useRef();
    const [modalKey, setModalKey] = useState(0);
    const { t } = useTranslation()


    useEffect(() => {
        fetchVessels();
    }, []);

    const fetchVessels = async () => {
        try {
            const vessels = await VesselsService.GetVesselsByAgentId();
            setVessels(vessels);
            setIsLoading(prev => ({ ...prev, fetchDate: false }));
        } catch (error) {
            setIsLoading(prev => ({ ...prev, fetchDate: false }));

            message.error(t('errorFetchingVessels'));
        }
    };



    const openModal = async (vessel = null) => {
        if (vessel) {
            try {
                setVessel(vessel);
                form.setFieldsValue(vessel);
            } catch (error) {
                return;
            }
        } else {
            setVessel(null);
            form.resetFields();
        }
        setModalKey(prevKey => prevKey + 1);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setVessel(null);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        try {
            debugger;
            setIsLoading(prev => ({ ...prev, btnSave: true }));
            values.Certificates = vesselCertificatesRef.current.getAllCertificates();
            let response = await VesselsService.SaveVessel(values);
            response = JSON.parse(response);
            if (response.isSuccess == false) {
                if (response.message == 'IMONumberExist') {
                    form.setFields([{ name: 'imoNumber', errors: [t('imoNumberAlreadyExist')] }])
                } else {
                    message.error(response.errorMessage)
                }
            }
            setIsLoading(prev => ({ ...prev, btnSave: false }));
            if (response.isSuccess == true) {
                if (vessel) {
                    message.success(t('vesselUpdatedSuccessfully'));
                } else {
                    message.success(t('vesselAddedSuccessfully'));
                    form.resetFields();
                }
                fetchVessels();
                vesselCertificatesRef.current.reloadData();
            }

        } catch (error) {
            message.error(t('errorSavingVessel'));
            setIsLoading(prev => ({ ...prev, btnSave: false }));
        }
    };

    const handleDelete = async (record) => {
        try {
            setIsLoading(prev => ({ ...prev, btnDelete: true }));
            await VesselsService.Delete(record.id);
            setIsLoading(prev => ({ ...prev, btnDelete: false }));
            message.success(t('vesselDeleted'));
            fetchVessels();
        } catch (error) {
            setIsLoading(prev => ({ ...prev, btnDelete: false }));
            message.error(t('errorDeletingVessel'));
        }
    };

    const columns = [
        { title: t('vesselName'), dataIndex: "vesselName", key: "vesselName" },
        { title: t('imoNumber'), dataIndex: "imoNumber", key: "imoNumber" },
        { title: t('flag'), dataIndex: "vesselFlag", key: "vesselFlag" },
        { title: t('owner'), dataIndex: "vesselOwner", key: "vesselOwner" },
        {
            title: t('actions'),
            key: "actions",
            render: (_, record) => (
                <>
                    <Can permission={PERMISSIONS.VESSELS.UPDATE}>
                        <Button data-testid="edit-vessel" icon={<EditOutlined />} onClick={() => openModal(record)} style={{ marginRight: 8 }} />
                    </Can>

                    <Can permission={PERMISSIONS.VESSELS.DELETE}>
                        <Popconfirm
                            title={t('deleteVessel')}
                            description={t('confirmDeleteVessel')}
                            onConfirm={() => handleDelete(record)}
                            okText={t('yes')}
                            cancelText={t('cancel')}
                            data-testid="delete-vessel-confirm"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        >
                            <Button data-testid="delete-vessel" loading={IsLoading.btnDelete} icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                    </Can>
                </>
            ),
        },
    ];

    return (
        <div>
            <Can permission={PERMISSIONS.VESSELS.CREATE}>
                <Button data-testid="add-vessel" type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ marginBottom: 16 }}>
                    {t('addVessel')}
                </Button>
            </Can>

            <Table dataSource={vessels} loading={IsLoading.fetchDate} columns={columns} rowKey="id" />

            <Modal
                width={'70%'}
                title={vessel ? t("editVessel") : t("createVessel")}
                open={isModalOpen}
                onCancel={closeModal}
                key={modalKey}
                footer={[
                    <Button data-testid="cancel-vessel-modal" key="back" onClick={closeModal}>
                        {t('cancel')}
                    </Button>,
                    <Button data-testid="save-vessel-modal" key="submit" type="primary" loading={IsLoading.btnSave} onClick={() => form.submit()}>
                        {t('save')}
                    </Button>,
                ]}
                onOk={() => form.submit()}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ id: 0, vesselSecurityLevel: 1, vesselType: 1 }}
                    onFinish={handleSubmit}
                >
                    <Form.Item name="id" label='id' hidden>
                        <Input data-testid="vessel-form-id" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="vesselName" label={t('vesselName')} rules={[formValidationRules.required]}>
                                <Input data-testid="vessel-form-name" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item name="imoNumber" label={t('imoNumber')} rules={[formValidationRules.required, formValidationRules.numeric]}>
                                <Input data-testid="vessel-form-imo-number" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="vesselFlag" label={t('flag')} rules={[formValidationRules.required]}>
                                <Input data-testid="vessel-form-flag" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="vesselOwner" label={t('owner')} rules={[formValidationRules.required]}>
                                <Input data-testid="vessel-form-owner" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item name="vesselClass" label={t('class')} rules={[formValidationRules.required]}>
                                <Input data-testid="vessel-form-class" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="vesselLength" label={t('length')} rules={[formValidationRules.required, formValidationRules.greaterThanZero]}>
                                <InputNumber data-testid="vessel-form-length" min={0.01} controls={false} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="vesselTonnage" label={t('netTonnage')} rules={[formValidationRules.required, formValidationRules.greaterThanZero]}>
                                <InputNumber data-testid="vessel-form-tonnage" min={0.01} controls={false} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item name="vesselNetTonnage" label={t('tonnage')} rules={[formValidationRules.required, formValidationRules.greaterThanZero]}>
                                <InputNumber data-testid="vessel-form-net-tonnage" min={0.01} controls={false} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="noOfCrew" label={t('numberOfCrew')} rules={[formValidationRules.required, formValidationRules.greaterThanZero]}>
                                <InputNumber data-testid="vessel-form-no-of-crew" min={1} controls={false} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="vesselSecurityLevel" label={t('securityLevel')} rules={[formValidationRules.required]}>
                                <Select data-testid="vessel-form-security" options={[1, 2, 3].map((val) => ({ value: val, label: val }))} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="vesselType" label={t('vesselType')} rules={[formValidationRules.required]}>
                                <Select data-testid="vessel-form-type" options={Object.entries(VesselTypes).map(([value, label]) => ({
                                    label: label,
                                    value: parseInt(value)
                                }))} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="lastPortOfCall" label={t('lastPortOfCall')} rules={[formValidationRules.required]}>
                                <Input data-testid="form-last-port-of-call" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <VesselCertificates ref={vesselCertificatesRef} VesselId={vessel?.id ?? 0} />
            </Modal>
        </div>
    );

};

export default VesselsManagement;