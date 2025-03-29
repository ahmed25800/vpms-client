import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Steps , Card } from 'antd';
import LoadingSpinner from '../components/LoadingSpinner';
import { PCTransactionTypes, PCTransactionTypes as PcTransactionTypes } from '../constants/enums';
import { GetPCTransactionSteps } from '../services/PCTransactionsService';
import EntryPermit from '../components/PCTransactionDetails/EntryPermit';
import EntryPermitPayment from '../components/PCTransactionDetails/EntryPermitPayment';
import VesselArrival from '../components/PCTransactionDetails/VesselArrival';
import Inspection from '../components/PCTransactionDetails/Inspections/Inspection';
import ExitPermit from '../components/PCTransactionDetails/ExitPermit';
import VesselDeparture from '../components/PCTransactionDetails/VesselDeparture';
import { useTranslation } from 'react-i18next';
import Can from '../components/Can';
import CheckHasPermission from '../components/CheckHasPermission';
import PERMISSIONS from '../constants/Permissions';
import NoPermission from '../components/NoPermission';
import ReportCustomFont from '../assets/Fonts/ReportCustomFont.ttf';
import { Font } from "@react-pdf/renderer";
Font.register({
    family: 'ReportCustomFont',
    src: `${window.location.origin}${ReportCustomFont}`,
});
const { Step } = Steps;
const PcTransactionDetails = () => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState({ stepsLoading: true });
  const { transactionId } = useParams();
  const [steps , setSteps] = useState([]);
  const { t } = useTranslation();
  const pcTransactionTypes = [
      { code: PCTransactionTypes.EntryPermit.value, name: t('stepper.entryPermit') , permission : PERMISSIONS.ENTRY_PERMIT.VIEW },
      { code: PCTransactionTypes.EntryPermitPayment.value, name: t('stepper.entryPermitPayment') ,permission : PERMISSIONS.ENTRY_PERMIT_PAYMENT.VIEW },
      { code: PCTransactionTypes.VesselArrived.value, name: t('stepper.vesselArrival') ,permission : PERMISSIONS.VESSEL_ARRIVAL.VIEW },
      { code: PCTransactionTypes.Inspection.value, name: t('stepper.inspection') ,permission : PERMISSIONS.INSPECTION.VIEW  },
      { code: PCTransactionTypes.ExitPermit.value, name: t('stepper.exitPermit') ,permission : PERMISSIONS.EXIT_PERMIT.VIEW },
      { code: PCTransactionTypes.VesselDepartureConfirmation.value, name: t('stepper.vesselDepartureConfirmation') ,permission : PERMISSIONS.VESSEL_DEPARTURE.VIEW  },
  ];
  useEffect(() => {
    setTimeout(() => {
      fetchSteps();  
    }, 1000); 
  }, [transactionId]);

  const fetchSteps = async () => {
    try {
      setLoading({ ...loading, stepsLoading: true });
      let data = await GetPCTransactionSteps(transactionId);
      if(!data) {
        throw data;
      }


      setSteps(data.steps.map((item) => ({
        title:  "",
        content: getStepContent(item.stepCode),
        disabled: item.isDisabled, 
        description: item.description,
        stepCode:item.stepCode,
        permission:pcTransactionTypes.find(transaction => transaction.code === item.stepCode).permission
      })));
      setCurrent(data.currentStep - 1);
      setLoading({ ...loading, stepsLoading: false });
    } catch (ex) {
      setLoading({ ...loading, stepsLoading: false });

    }
  };
  const handleOnApprove = ()=>{
    debugger;
    fetchSteps();
  }

  const contents = [];
  contents[PcTransactionTypes.EntryPermit.value] = <EntryPermit key={1} handleOnApprove={handleOnApprove} TransactionId={transactionId} />;
  contents[PcTransactionTypes.EntryPermitPayment.value] = <EntryPermitPayment key={2} handleOnApprove={handleOnApprove} transactionId={transactionId}></EntryPermitPayment>;
  contents[PcTransactionTypes.VesselArrived.value] = <VesselArrival key={3} handleOnApprove={handleOnApprove} transactionId={transactionId}/>;
  contents[PcTransactionTypes.Inspection.value] = <Inspection key={4} handleOnApprove={handleOnApprove} transactionId={transactionId}/>;
  contents[PcTransactionTypes.ExitPermit.value] = <ExitPermit key={5} OnApprove={handleOnApprove} transactionId={transactionId} />;
  contents[PcTransactionTypes.VesselDepartureConfirmation.value] = <VesselDeparture key={6} handleOnApprove={handleOnApprove} transactionId={transactionId} />;

  const getStepContent = (stepCode) => {
    return contents[stepCode];
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleStepClick = (index) => {
    debugger;
    if(steps[index].disabled)return;
    const updatedSteps = [...steps];
    updatedSteps[index].disabled = false;
    setSteps(updatedSteps);
    setCurrent(index);
  };

  if (loading.stepsLoading) {
    return (
      <LoadingSpinner loading={loading.stepsLoading} />
    );
  }

  const CheckStepPermission = (permission)=>{
    return CheckHasPermission(permission);
  };
  
  return (
    <div className="container">
      <Steps current={current} onChange={handleStepClick}>
              {steps.map((step, index) => {
                  //const hasPermission = CheckStepPermission(step.permission);
                  return (
                      <Step
                          key={index}
                          data-testid={`pc_step_${index + 1}`}
                          title={pcTransactionTypes.find(transaction => transaction.code === step.stepCode).name}
                          disabled={ step.disabled}
                          description={step.description}
                      />
                  );
              })
              }
            </Steps>
      
        <div className="steps-content" style={{padding: '10px'}}>
            <div className="container" style={{ padding: '20px' }}>
            <Card
          variant={true}
          style={{
            padding: '10px',
            
          }}
        >

           <Can fallback={<NoPermission/>} permission={steps[current].permission}>
              {steps[current].content}
            </Can>
          </Card>

            </div>
        
          </div>
        </div>
      
  );
};



export default PcTransactionDetails;
