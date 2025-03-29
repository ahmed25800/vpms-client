import React, { useState } from "react";
import { Row, Tabs, Col } from "antd";
import InspectionTab from "./InspectionTab";
import InspectionPayment from "./InspectionPayment";
import { useTranslation } from 'react-i18next'; 

const Inspection = ({ transactionId, handleOnApprove }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("1");
    const [disabledTab, setDisabledTab] = useState(true);
    const [selectedInspection, setSelectedInspection] = useState(null);
    const [refreshInspection, setRefreshInspection] = useState(0);
    const [refreshPayment, setRefreshPayment] = useState(2);

    const handleClickPayment = (record) => {
        setRefreshPayment((prev) => {
            const newPaymentTabKey = prev + 1;
            setSelectedInspection(record);
            setDisabledTab(false);
            setActiveTab(newPaymentTabKey.toString());
            return newPaymentTabKey;
        });
    };
    const handlePaymentApproved = async (key = "1") => {
        try {
            handleOnApprove();
            if(key!="1")setActiveTab(2);
            setRefreshInspection((prev) => prev + 1);
        } catch (error) {
            console.error("Error handling approval:", error);
        }
    };

    const items = [
        {
            key: "1",
            label: t("inspectionData"), 
            children: (
                <InspectionTab
                    key={refreshInspection}
                    transactionId={transactionId}
                    OnApprove={handleOnApprove}
                    handleClickPayment={handleClickPayment}
                />
            ),
        },
        {
            key: refreshPayment.toString(),
            label: t("reInspectionPayment"), 
            disabled: disabledTab,
            children: <InspectionPayment paymentData={selectedInspection} OnApprove={handlePaymentApproved} />,
        },
    ];

    return (
        <Row gutter={[16, 16]}>
            <Col span={24} style={{ textAlign: "left", marginTop: "20px" }}>
                <Tabs destroyInactiveTabPane={true} activeKey={activeTab} onChange={(key) => { setActiveTab(key); }} type="card" items={items} />
            </Col>
        </Row>
    );
};

export default Inspection;