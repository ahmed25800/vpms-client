import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { CloseOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const ExceptionRequestModal = ({onConfirm, title }) => {
  const [exceptionReason, setExceptionReason] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [visible , setVisible] = useState(false);
  const { t } = useTranslation();

  const handleConfirm = async () => {
    if (!exceptionReason.trim()) {
      message.error(t("enterReasonError"));
      return;
    }

    try {
      setConfirmLoading(true);
      await onConfirm(exceptionReason);
      setExceptionReason("");
      setConfirmLoading(false);
    } catch (error) {
      setConfirmLoading(false);
    }
  };

  return (
    <>
    <Button style={{margin:2}} onClick={() => setVisible(true)} color="cyan" variant="solid"  icon={<CloseOutlined />}>
                            {t("exception")} 
    </Button>
    <Modal
      title={title || t("enterExceptionReason")}
      open={visible}
      onCancel={()=>{setVisible(false)}}
      footer={[
        <Button key="cancel" onClick={()=>setVisible(false)}>
          {t("cancel")}
        </Button>,
        <Button
          data-testid="exception_confirm_btn"
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
        value={exceptionReason}
        onChange={(e) => setExceptionReason(e.target.value)}
        placeholder={t("enterExceptionReason")}
      />
    </Modal>
    </>
    
  );
};

export default ExceptionRequestModal;