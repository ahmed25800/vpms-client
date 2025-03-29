import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Card } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { ResetUserPassword } from "../services/UsersService";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const params = new URLSearchParams(location.search);
    const email = params.get("email");
    const token = params.get("token");

    useEffect(() => {
        if (!email || !token) {
            message.error(t('InvalidResetLink'));
        }
    }, [email, token]);

    const passwordRules = [
        { required: true, message: t('EnterNewPassword') },
        { min: 8, message: t('PasswordMustBeAtLeast8Characters') },
        {
            pattern: /[A-Z]/,
            message: t('PasswordMustContainUppercase'),
        },
        {
            pattern: /[a-z]/,
            message: t('PasswordMustContainLowercase'),
        },
        {
            pattern: /[0-9]/,
            message: t('PasswordMustContainNumber'),
        },
        {
            pattern: /[\W_]/,
            message: t('PasswordMustContainSpecialCharacter'),
        },
    ];

    const handleReset = async (values) => {
        setLoading(true);
        const body = {
            email: email,
            password: values.newPassword,
            token: token
        };
        try {
            await ResetUserPassword(body);
            message.success(t('PasswordResetSuccessfully'));

            navigate("/login");
        } catch (error) {
            message.error(t('FailedToResetPassword'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-md mx-auto mt-20">
            <h2>Reset Password</h2>
            <Form form={form} layout="vertical" onFinish={handleReset}>
                <Form.Item data-testid="reset-password-form-new-password" name="newPassword" label={t('NewPassword')} rules={passwordRules}>
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    data-testid="reset-password-form-confirm-password"
                    name="confirmPassword"
                    label={t('ConfirmPassword')}
                    dependencies={["newPassword"]}
                    rules={[
                        { required: true, message: t('ConfirmYourPassword') },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("newPassword") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(t('ConfirmPasswordMismatch')));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button data-testid="reset-password-form-btn" type="primary" htmlType="submit" loading={loading}>
                        {t('ResetPassword')}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ResetPassword;
