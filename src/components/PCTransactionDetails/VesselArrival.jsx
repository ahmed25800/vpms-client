import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, DatePicker, message, Result } from "antd";
import { CheckVesselArrival, SetVesselArrival } from "../../services/PCTransactionsService";
import dayjs from "dayjs";
import LoadingSpinner from "../LoadingSpinner";
import Can from "../Can";
import PERMISSIONS from "../../constants/Permissions";

const VesselArrival = ({ transactionId, handleOnApprove }) => {
  const { t } = useTranslation();
  const [arrivalDate, setArrivalDate] = useState(null);
  const [vesselArrival, setVesselArrival] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    fetchVesselArrival();
  }, []);

  const fetchVesselArrival = async () => {
    try {
      setDataLoading(true);
      const data = await CheckVesselArrival(transactionId);
      setVesselArrival(data);
      setDataLoading(false);
    } catch (error) {
      setDataLoading(false);
      message.error(t("errorFetchingData"));
    }
  };

  const handleArrived = async () => {
    if (!arrivalDate) {
      alert(t("selectDateTime"));
      return;
    }
    try {
      setLoading(true);
      const formattedDate = dayjs(arrivalDate).format("YYYY-MM-DDTHH:mm:ss");
      await SetVesselArrival({ transactionId: transactionId, ArrivalDate: formattedDate });
      message.success(t("arrived"));
      handleOnApprove();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <LoadingSpinner loading={dataLoading} />;
  if (vesselArrival)
    return (
      <Result
        status="success"
        title={t("vesselArrivedAt")}
        subTitle={vesselArrival.arrivalDate}
      />
    );

  return (
    <Can permission={PERMISSIONS.VESSEL_ARRIVAL.CREATE}>
      <DatePicker
        data-testid="vessel_arr_date"
        showTime={{ format: "HH:mm" }}
        onChange={(value) => setArrivalDate(value)}
        style={{ marginBottom: "10px" }}
        placeholder={t("selectArrivalDate")}
      />
      <p style={{ fontSize: "16px", marginBottom: "10px" }}>
        {arrivalDate ? dayjs(arrivalDate).format("YYYY-MM-DD HH:mm") : t("selectArrivalDateTime")}
      </p>
      <Button 
        type="primary" 
        data-testid="vessel_arr_confirm"
        style={{ backgroundColor: "green", borderColor: "green" }}
        loading={loading} 
        onClick={handleArrived}
      >
        {t("arrived")}
      </Button>
    </Can>
  );
};

export default VesselArrival;
