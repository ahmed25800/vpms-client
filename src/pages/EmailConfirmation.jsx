import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Card, Typography, message } from "antd";
import * as AccountService from "../services/AccountService";
import { sendOAuthRequest } from "../services/AuthService";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const EmailConfirmation = () => {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("userId");
    const code = searchParams.get("code");
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const handleConfirm = async () => {
        setLoading(true);
        try {
            let body = { userId, code };
            let result = await AccountService.Confirm(body);
            if (result.id) {
                message.success(t('EmailConfirmedSuccessfully'));
                sendOAuthRequest();
            }
        } catch (error) {
            message.error(t('FailedToConfirmEmail'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
                height: "100vh",
                backgroundColor: "#f4f4f4",
                position: "fixed",
                top: 0,
                left: 0,
            }}
        >
            <Card
                style={{
                    width: 400,
                    textAlign: "center",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Title level={3}>{t('ConfirmYourEmail')}</Title>
                <Text>{t('ClickButtonToConfirmEmail')}</Text>
                <Button
                    data-testid="confirm-email-form-btn"
                    type="primary"
                    style={{ marginTop: "20px", width: "100%" }}
                    onClick={handleConfirm}
                    loading={loading}
                    disabled={loading}
                >
                    {t('confirm')}
                </Button>
            </Card>
        </div>
    );
};

export default EmailConfirmation;
