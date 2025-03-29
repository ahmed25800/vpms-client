import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { GetDocumentUrl } from "../services/DocumentsService";

const FilePreview = React.memo(({ documentId }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    setFileUrl(GetDocumentUrl(documentId));
  }, [documentId]);

  const handlePreview = useCallback(() => {
    setVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <>
      <Tooltip title={t("preview")}>
        <Button
          size="medium"
          type="default"
          data-testid="preview_doc"
          icon={<EyeOutlined />}
          onClick={handlePreview}
          style={{ margin: 5 }}
        />
      </Tooltip>

      <Modal
        title={t("filePreview")}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <iframe
          src={fileUrl}
          style={{ width: "100%", height: 800, border: "none" }}
          title={t("filePreview")}
        />
      </Modal>
    </>
  );
});

export default FilePreview;
