import React, { useState, useEffect } from 'react';
import { Table, Card, Statistic, Row, Col , Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { GetTransactionsReport } from '../services/PreDepositBalanceService';
import LoadingSpinner from '../components/LoadingSpinner';
import NoData from '../components/NoData';

const PreDepositBalanceTrackingReport = ({ agentId }) => {
  const { t } = useTranslation();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await GetTransactionsReport(agentId);
        setReportData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [agentId]);

  if (loading) {
    return <LoadingSpinner loading={loading}/>;
  }

  if (error) {
    return <div>{t('errorFetchingData')}</div>;
  }

  if (!reportData) {
    return <NoData/>
  }

  const columns = [
    {
        title: t('transactionType'),
        dataIndex: 'transactionType',
        key: 'transactionType',
        render: (type) => {
            debugger;
          let color = type === 'Depit' ? 'red' : type === 'Credit' ? 'green' : 'default';
          let translatedType = t(type.toLowerCase());
          return <Tag color={color}>{translatedType}</Tag>;
        },
      },
    {
      title: t('transactionAmount'),
      dataIndex: 'transactionAmount',
      key: 'transactionAmount',
      render: (amount) => (amount != null ? `${(amount || 0).toFixed(2)}` : '-'),
    },
    {
      title: t('transactionName'),
      dataIndex: 'transactionName',
      key: 'transactionName',
    },
    {
      title: t('transactionDate'),
      dataIndex: 'transactionDate',
      key: 'transactionDate',
    },
  ];

  return (
    <Card title={t('preDepositBalanceReport')}>
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title={t('balance')}
            value={reportData.balance != null ? `${(reportData.balance || 0).toFixed(2)}` : '-'}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title={t('paid')}
            value={reportData.payed != null ? `${(reportData.payed || 0).toFixed(2)}` : '-'}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title={t('refunded')}
            value={reportData.refunded != null ? `${(reportData.refunded || 0).toFixed(2)}` : '-'}
          />
        </Col>
      </Row>

      <Table dataSource={reportData.transactions || []} columns={columns} style={{ marginTop: 24 }} rowKey="id" />
    </Card>
  );
};

export default PreDepositBalanceTrackingReport;