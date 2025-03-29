import React, { useEffect, useState } from "react";
import { Table, Tag} from "antd";
import { ApprovalStatus } from "../../../constants/enums";
import { useTranslation } from 'react-i18next'; 
import { GetPrePaymentData } from "../../../services/PCTransactionsService";


const PrePaymentTable = ({ detailId , onDataBound}) => {
    const { t } = useTranslation(); 
    const [loading, setLoading] = useState({});
    const [data, setData] = useState([]);
    const approvalStatusMap = {
      [ApprovalStatus.Pending]: { label: t("Pending"), color: "orange" },
      [ApprovalStatus.Approved]: { label: t("approved"), color: "green" }, 
      [ApprovalStatus.Rejected]: { label: t("rejected"), color: "red" }, 
      [ApprovalStatus.Excepted]: { label: t("exception"), color: "cyan" }, 
    };

    useEffect(()=>{
        fetchData();
    } , [detailId]);
    const fetchData  = async()=>{
        try{
            setLoading(true);
            let dataObj = await GetPrePaymentData(detailId);
            setData([dataObj]);
            if(onDataBound) onDataBound()
        }catch{}finally{
            setLoading(false);
        }
    }
    const columns = [
        
        {
            title: t("balanceBefore"), 
            dataIndex: "balanceBefore",
            key: "balanceBefore",
        },
        {
            title: t("Amount"), 
            dataIndex: "paymentAmount",
            key: "paymentAmount",
        },
        {
            title: t("balanceAfter"), 
            dataIndex: "balanceAfter",
            key: "balanceAfter",
        },
        {
            title: t("status"), 
            key: "status",
            render: (_, record) => {
                const { label, color } = approvalStatusMap[record.status] || {
                    label: t("unknown"), 
                    color: "gray",
                };

                return (
                    <>
                        <Tag color={color}>{t(label)}</Tag> 
                        {record.status == ApprovalStatus.Rejected && <Tag color={color}>{record.rejectionReason}</Tag>}

                    </>
                );
            },
        }
    ];
    return (<>
    <Table
            loading={loading}
            columns={columns}
            dataSource={data}
            rowKey="id"
        />
    </>
        
    );
};

export default PrePaymentTable;