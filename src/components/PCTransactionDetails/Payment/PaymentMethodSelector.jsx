import React, { useState } from 'react';
import { Select, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { PaymentMethods } from '../../../constants/enums';
import { SelectPaymentMethod } from '../../../services/PCTransactionsService';

const PaymentMethodSelector = ({ detailId ,  onMethodSelected }) => {
  const { t } = useTranslation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(null);

  const handleSelectChange = (value) => {
    setSelectedPaymentMethod(value);
  };

  const handleButtonClick = async () => {
    if (selectedPaymentMethod) {
      setLoading(true);
      await SelectPaymentMethod({PaymentMethodTypeCode : selectedPaymentMethod , DetailId:detailId});
      setLoading(false);
      if(onMethodSelected) onMethodSelected();
      setSelectedPaymentMethod(null);
    } else {
      message.error(t('paymentSelector.selectMethod'));
    }
  };

  return (
    <div>
      <Select
        placeholder={t('paymentSelector.placeholder')}
        onChange={handleSelectChange}
        style={{ width: 200, marginRight: 16 }}
        value={selectedPaymentMethod}
        options={Object.keys(PaymentMethods).map((key)=>({label:t(key),value:PaymentMethods[key]}))}
      />
        
      <Button loading={loading} type="primary" onClick={handleButtonClick}>
        {t('paymentSelector.process')}
      </Button>
    </div>
  );
};

export default PaymentMethodSelector;