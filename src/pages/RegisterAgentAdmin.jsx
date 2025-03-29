import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import * as AgentService from "../services/AgentService";
import { useTranslation } from "react-i18next";


const RegisterAgentAdmin = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    setResult(null);
    setError(null);

    const body = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      phoneNumber: values.phoneNumber,
      address: values.address
    };

    try {
      const response = await AgentService.RegisterAgent(body);
      setResult(response);
      form.resetFields();
    } catch (err) {
      setError(t('RegistrationError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result?.id) {
      message.success(t('RegistrationSuccess'));
    }
    if (error) {
      message.error(error);
    }
  }, [result, error]);

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>{t('RegisterAgent')}</h2>
        <Form
          form={form}
          name="register"
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{
            fullName: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
            address: ''
          }}
        >
          {/* Full Name */}
          <Form.Item
            name="fullName"
            data-testid="register-agent-form-full-name"
            label={t('FullName')}
            rules={[
              { required: true, message: t('FullNameRequired') },
              { min: 4, max: 50, message: t('FullNameLength') }
            ]}
          >
            <Input maxLength={30} />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            data-testid="register-agent-form-email"
            label={t('Email')}
            rules={[
              { required: true, message: t('EmailRequired') },
              { type: 'email', message: t('EmailInvalid') },
              { min: 4, max: 30, message: t('EmailLength') }
            ]}
          >
            <Input maxLength={30} />
          </Form.Item>

          {/* Phone Number */}
          <Form.Item
            name="phoneNumber"
            data-testid="register-agent-form-phone-number"
            label={t('PhoneNumber')}
            rules={[
              { required: true, message: t('PhoneNumberRequired') },
              { pattern: /^\+?[1-9]\d{1,14}$/, message: t('PhoneNumberInvalid') },
            ]}
          >
            <Input maxLength={15} />
          </Form.Item>

          <Form.Item
            name="password"
            data-testid="register-agent-form-password"
            label={t('Password')}
            rules={[
              { required: true, message: t('PasswordRequired') },
              { min: 8, max: 30, message: t('PasswordLength') },
              { pattern: /[A-Z]/, message: t('PasswordMustContainUppercase') },
              { pattern: /[a-z]/, message: t('PasswordMustContainLowercase') },
              { pattern: /[0-9]/, message: t('PasswordMustContainNumber') },
              { pattern: /[\W_]/, message: t('PasswordMustContainSpecialCharacter') }
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            name="confirmPassword"
            data-testid="register-agent-form-confirm-password"
            label={t('ConfirmPassword')}
            dependencies={['password']}
            rules={[
              { required: true, message: t('ConfirmPasswordRequired') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('ConfirmPasswordMismatch')));
                }
              }),
              { min: 8, message: t('PasswordLength') }
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          {/* Address */}
          <Form.Item
            name="address"
            data-testid="register-agent-form-address"
            label={t('Address')}
            rules={[
              { required: true, message: t('AddressRequired') },
              { min: 4, max: 30, message: t('AddressLength') }
            ]}
          >
            <Input maxLength={30} />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button data-testid="register-agent-form-register-btn" type="primary" htmlType="submit" block loading={loading}>
              {t('Register')}
            </Button>
          </Form.Item>
        </Form>
      </div>

    </div>
  );
};

// Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#2a5298',
    margin: 0,


  },
  formContainer: {
    width: '100%',
    maxWidth: '500px',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '0 20px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333'
  }
};

export default RegisterAgentAdmin;
