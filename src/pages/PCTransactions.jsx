import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Table, Button, Space, message, Tooltip, Modal, Form, Checkbox, DatePicker, Select, Tag } from "antd";
import { StopOutlined, PlusOutlined, EyeTwoTone } from "@ant-design/icons";
import formValidationRules from "../constants/formValidationRules";
import { GetAgentVesselDropDown } from "../services/VesselsService";
import { GetAllPortsDropDown } from "../services/PortsService";
import * as PcTransactionsService from "../services/PCTransactionsService"
import { useTranslation } from 'react-i18next';
import PERMISSIONS from "../constants/Permissions";
import Can from "../components/Can";
import NoPermission from "../components/NoPermission";

const PCTransactions = () => {
    const { t } = useTranslation();
    const [data, setData] = useState();
    const [loading, setLoading] = useState({ transLoading: true, portsLoading: false, vesselsLoading: false, saveLoading: false });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vessels, setVessels] = useState([]);
    const [ports, setPorts] = useState([]);
    const [all, setAll] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    useEffect(() => {
        fetchTransactions({All:false , NeedAction:true});
    }, []);

    const handleContinue = (record) => {
      navigate(`${'/port-call-transaction/'}${record.id}`)
    };

    const handleDeactivate = (id) => {

    };
    const openModal = () => {
        setIsModalOpen(true);
        fetchVesselsDropDown();
        fetchPortsDropDown();
    }
    const fetchVesselsDropDown = async () => {
        try {
            setLoading(prev => ({ ...prev, vesselsLoading: true }));
            const vessels = await GetAgentVesselDropDown();
            setVessels(vessels);
            setLoading(prev => ({ ...prev, vesselsLoading: false }));
        } catch (error) {
            message.error(t("errorFetchingVessels"));
        }
    }
    const fetchTransactions = async (obj) => {
        try {
            setLoading(prev => ({ ...prev, transLoading: true }));
            const trans = await PcTransactionsService.GetPCTransactions(obj);
            setData(trans);
            setLoading(prev => ({ ...prev, transLoading: false }));
        } catch (error) {
            message.error(t("errorFetchingPortTransactions"));
        }
    }
    const fetchPortsDropDown = async () => {
        try {
            setLoading(prev => ({ ...prev, portsLoading: true }));
            const ports = await GetAllPortsDropDown();
            setPorts(ports);
            setLoading(prev => ({ ...prev, portsLoading: false }));
        } catch (error) {
            message.error(t("errorFetchingPorts"));
        }
    }
    const handleAddTransaction = async () => {

        form.validateFields().then(async (values) => {
            try {
                setLoading(prev => ({ ...prev, saveLoading: true }));
                var response = await PcTransactionsService.SaveTransaction(values);
                message.success(t("portTransactionAddedSuccessfully"));
                setIsModalOpen(false);
                form.resetFields();
                setLoading(prev => ({ ...prev, saveLoading: false }));
                fetchTransactions();
            }
            catch {
                setLoading(prev => ({ ...prev, saveLoading: false }));
            }
        });

    };
    const PCTransactionTypes = Object.freeze({
        EntryPermit: { value: 1, label: t("entryPermit"), color: "#1890ff" ,permission : PERMISSIONS.ENTRY_PERMIT.VIEW }, 
        EntryPermitPayment: { value: 2, label: t("payEntryPermit"), color: "#52c41a",permission : PERMISSIONS.ENTRY_PERMIT_PAYMENT.VIEW }, 
        VesselArrived: { value: 3, label: t("arrived"), color: "#6c757d" , permission : PERMISSIONS.VESSEL_ARRIVAL.VIEW }, 
        Inspection: { value: 4, label: t("inspect"), color: "#ff4d4f" , permission : PERMISSIONS.INSPECTION.VIEW }, 
        ExitPermit: { value: 5, label: t("exitPermit"), color: "#13c2c2" , permission : PERMISSIONS.ENTRY_PERMIT.VIEW }, 
        VesselDepartureConfirmation: { value: 6, label: t("departureConfirmation"), color: "#389e0d" , permission : PERMISSIONS.VESSEL_DEPARTURE.VIEW }, 
    });
    const getTransactionByValue = (value) => {
        return Object.values(PCTransactionTypes).find(type => type.value === value);
    }
    const columns = [
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
            render: (value) => `${value.toFixed(2)}`,
        },
        {
            title: t("arrivalDate"),
            dataIndex: "arrivalDate",
            key: "arrivalDate",
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: t("actions"),
            key: "actions",
            render: (_, record) => {
                const transaction = getTransactionByValue(record.pcTransactionStatus);
                return (<>
                    <Space>
                        <Can permission={transaction.permission}>
                            {record.isDeparted&&<Tag color="green">{t('departed')}</Tag>}
                            {record.isRejected&&<Tag color="red">{t('rejected')}</Tag>}
                            {record.isRefunded&&<Tag color="#94acc2">{t('refunded')}</Tag>}
                            {!record.isDeparted&&!record.isRejected&&!record.isRefunded&&<Tooltip title={transaction.label}>
                                {
                                    (<Button
                                        data-testid={`pc_continue-btn-${record.id}`}
                                        style={{ backgroundColor: transaction.color, color: '#fff', borderColor: transaction.color }}
                                        onClick={() => handleContinue(record)}
                                    >
                                        {transaction.label}
                                    </Button>)
                                }
                            </Tooltip>}
                        </Can>

                        <Tooltip title={t("preview")}>
                            <Button
                                data-testid={`pc_preview-btn-${record.id}`}
                                type="default"
                                shape="circle"
                                icon={<EyeTwoTone />}
                                onClick={() => handleContinue(record)}
                            />
                        </Tooltip>
                        
                    </Space>
                </>)
            }
        }
    ];

    return (
        <Can permission={PERMISSIONS.PORT_CALL.VIEW} fallback={<NoPermission/>}>
        <div>
            <Can permission={PERMISSIONS.PORT_CALL.CREATE}>
                <Button data-testid="pc_add_btn" type="primary" icon={<PlusOutlined />} onClick={openModal} style={{ marginBottom: 16 }}>
                    {t("newTransaction")}
                </Button>
            </Can>

            <div style={{ margin: 10 }}>
                <Checkbox
                    data-testid="pc_all_chx"
                    checked={all}
                    onChange={(e) => {
                        setAll(e.target.checked);
                        fetchTransactions({All : e.target.checked , NeedAction:!e.target.checked});
                    }}
                >
                    {t('all')}
                </Checkbox>
                <Checkbox
                    data-testid="pc_need_action_chx"
                    checked={!all}
                    onChange={(e) => {
                        setAll(!e.target.checked);
                        fetchTransactions({All : !e.target.checked , NeedAction:e.target.checked});
                    }}
                >
                    {t('needAction')}
                </Checkbox>
            </div>


            <Table columns={columns} dataSource={data} rowKey="id" loading={loading.transLoading} bordered pagination={{ pageSize: 10 }} />

            <Modal
                data-testid="pc_add-modal"
                confirmLoading={loading.saveLoading}
                title={t("addPortCallTransaction")}
                open={isModalOpen}
                onOk={handleAddTransaction}
                onCancel={() => setIsModalOpen(false)}
                okText={t("addTransaction")}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="VesselId" label={t("vessel")} rules={[formValidationRules.required]}>
                        <Select data-testid="pc_vessel-select" loading={loading.vesselsLoading} placeholder={t("selectAVessel")} options={vessels} />

                    </Form.Item>

                    <Form.Item name="PortId" label={t("port")} rules={[formValidationRules.required]}>
                        <Select data-testid="pc_port-select" loading={loading.portsLoading} placeholder={t("selectAPort")} options={ports} />
                    </Form.Item>

                    <Form.Item name="ArrivalDate" label={t("arrivalDate")} rules={[formValidationRules.required]}>
                        <DatePicker data-testid="pc_arrival-date-picker" style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    </Can>

);
};

export default PCTransactions;