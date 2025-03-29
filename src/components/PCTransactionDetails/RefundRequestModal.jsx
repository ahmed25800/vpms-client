import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { CloseOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const RefundRequestModal = ({ onConfirm, title }) => {
  const [RefundReason, setRefundReason] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const handleConfirm = async () => {
    debugger;
    if (!RefundReason.trim()) {
      message.error("enter refund reason");
      return;
    }

    try {
      setConfirmLoading(true);
      await onConfirm(RefundReason);
      setRefundReason("");
      setConfirmLoading(false);
    } catch (error) {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <Button style={{ margin: 2 }} onClick={() => setVisible(true)} color="red" variant="solid" icon={<CloseOutlined />}>
        {t("refundReason")}
      </Button>
      <Modal
        title={title || t("refundReason")}
        open={visible}
        onCancel={() => { setVisible(false) }}
        footer={[
          <Button key="cancel" onClick={() => setVisible(false)}>
            {t("cancel")}
          </Button>,
          <Button
            data-testid="Refund_confirm_btn"
            loading={confirmLoading}
            key="submit"
            type="primary"
            onClick={handleConfirm}
          >
            {t("confirm")}
          </Button>,
        ]}
      >
        <TextArea
          rows={4}
          value={RefundReason}
          onChange={(e) => setRefundReason(e.target.value)}
          placeholder={t("refundReason")}
        />
      </Modal>
    </>

  );
};

export default RefundRequestModal;