import React, { useEffect, useState } from "react";
import { Modal, Select, Input, Button, message } from "antd";
import { GetRejectionReasons } from "../../services/RejectionReasonService";
import LoadingSpinner from "../LoadingSpinner";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const { TextArea } = Input;

const RejectionModal = ({ visible, onCancel, onConfirm, title }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [dataLoading, setDataLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [predefinedReasons, setPredefinedReasons] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchReasons();
  }, []);

  const fetchReasons = async () => {
    try {
      setDataLoading(true);
      let reasons = await GetRejectionReasons();
      const mappedReasons = reasons.map((reason) =>
        i18n.language === "ar" ? reason.reasonAr : reason.reasonEn
      );
      setPredefinedReasons(mappedReasons);
      setDataLoading(false);
    } catch {
      setDataLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedReason) {
      message.error(t("selectReasonError"));
      return;
    }

    if (selectedReason === t("others") && !customReason.trim()) {
      message.error(t("enterReasonError"));
      return;
    }

    const reasonToSend = selectedReason === t("others") ? customReason : selectedReason;
    try {
      setConfirmLoading(true);
      await onConfirm(reasonToSend);
      setSelectedReason("");
      setCustomReason("");
      setConfirmLoading(false);
    } catch (error) {
      setConfirmLoading(false);
    }
  };

  if (dataLoading) return <LoadingSpinner loading={dataLoading} />;

  return (
    <Modal
      title={title || t("rejectionTitle")}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {t("cancel")}
        </Button>,
        <Button data-testid='rej_confirm_btn' loading={confirmLoading} key="submit" type="primary" danger onClick={handleConfirm}>
          {t("confirm")}
        </Button>,
      ]}
    >
      <p>{t("selectReason")}</p>
      <Select
        style={{ width: "100%" }}
        placeholder={t("selectReasonPlaceholder")}
        value={selectedReason}
        onChange={(value) => setSelectedReason(value)}
      >
        {predefinedReasons.map((reason) => (
          <Option key={reason} value={reason}>
            {reason}
          </Option>
        ))}
      </Select>

      {selectedReason === t("others") && (
        <div style={{ marginTop: 10 }}>
          <p>{t("enterReason")}</p>
          <TextArea
            rows={4}
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder={t("enterReasonPlaceholder")}
          />
        </div>
      )}
    </Modal>
  );
};

export default RejectionModal;
