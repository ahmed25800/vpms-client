import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, DatePicker, message, Result } from "antd";
import { CheckVesselDeparture, SetVesselDeparture } from "../../services/PCTransactionsService";
import dayjs from "dayjs";
import LoadingSpinner from "../LoadingSpinner";
import Can from "../Can";
import PERMISSIONS from "../../constants/Permissions";

const VesselDeparture = ({ transactionId, handleOnApprove }) => {
  const { t } = useTranslation();
  const [departureDate, setDepartureDate] = useState(null);
  const [VesselDeparture, setVesselDeparture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    fetchVesselDeparture();
  }, []);

  const fetchVesselDeparture = async () => {
    try {
      setDataLoading(true);
      const data = await CheckVesselDeparture(transactionId);
      setVesselDeparture(data);
      setDataLoading(false);
    } catch (error) {
      setDataLoading(false);
      message.error(t("errorFetchingData"));
    }
  };

  const handleDeparted = async () => {
    if (!departureDate) {
      alert(t("selectDateTime"));
      return;
    }
    try {
      setLoading(true);
      const formattedDate = dayjs(departureDate).format("YYYY-MM-DDTHH:mm:ss");
      await SetVesselDeparture({ transactionId: transactionId, DepartureDate: formattedDate });
      message.success(t("departed"));
      handleOnApprove();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return <LoadingSpinner loading={dataLoading} />;
  if (VesselDeparture) 
    return (
      <Result
        status="success"
        title={t("vesselDepartedAt")}
        subTitle={VesselDeparture.departureDate}
      />
    );

  return (
    <Can permission={PERMISSIONS.VESSEL_DEPARTURE.Confirm}>
      <DatePicker
        showTime={{ format: "HH:mm" }}
        onChange={(value) => setDepartureDate(value)}
        style={{ marginBottom: "10px" }}
        data-testid="vessel_dep_date"
        placeholder={t("selectDepartureDate")}
      />
      <p style={{ fontSize: "16px", marginBottom: "10px" }}>
        {departureDate ? dayjs(departureDate).format("YYYY-MM-DD HH:mm") : t("selectDepartureDateTime")}
      </p>

      <Button 
        type="primary" 
        data-testid="vessel_dep_confirm"
        style={{ backgroundColor: "green", borderColor: "green" }}
        loading={loading} 
        onClick={handleDeparted}
      >
        {t("confirmDeparture")}
      </Button>
    </Can>
  );
};

export default VesselDeparture;
