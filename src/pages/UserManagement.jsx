import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import * as UserService from "../services/UsersService";
import * as RolesService from "../services/RolesService";
import Can from "../components/Can";
import PERMISSIONS from "../constants/Permissions";
import { useTranslation } from "react-i18next";
import NoPermission from "../components/NoPermission";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();
    const { t } = useTranslation();

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        try {
            const fetchedUsers = await UserService.GetAll();
            setUsers(fetchedUsers);
        } catch (error) {
            message.error(t('errorFetchingUsers'));
        }
    };

    const fetchRoles = async () => {
        try {
            const fetchedRoles = await RolesService.GetAll();
            setRoles(fetchedRoles);
        } catch (error) {
            message.error(t('errorFetchingRoles'));
        }
    };

    const openModal = async (user = null) => {
        if (user) {
            try {
                const userData = await UserService.GetById(user.id);
                setEditingUser(userData);
                form.setFieldsValue({
                    ...userData,
                    role: userData.role?.id,
                });
            } catch (error) {
                message.error(t('errorFetchingUserData'));
                return;
            }
        } else {
            setEditingUser(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        try {
            if (editingUser) {
                await UserService.Update(values.id, values.fullName, values.email, values.phoneNumber, values.role);
                message.error(t('userUpdatedSuccessfully'));
            } else {
                var result = await UserService.Create(values.fullName, values.email, values.phoneNumber, values.role);
                if (result.status == 200 || result.status == 204) {
                    message.error(t('userAddedSuccessfully'));
                }
                else {
                    message.error(result.detail);
                }
            }
            closeModal();
            fetchUsers();
        } catch (error) {
            message.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await UserService.Delete(id);
            message.error(t('userDeletedSuccessfully'));
            fetchUsers();
        } catch (error) {
            message.error(t('errorDeletingUser'));
        }
    };

    const columns = [
        { title: t('userId'), dataIndex: "id", key: "id" },
        { title: t('name'), dataIndex: "fullName", key: "fullName" },
        { title: t('email'), dataIndex: "email", key: "email" },
        { title: t('phoneNumber'), dataIndex: "phoneNumber", key: "phoneNumber" },
        {
            title: t('actions'),
            key: "actions",
            render: (_, record) => (
                <>
                    <Can permission={PERMISSIONS.USERS.UPDATE}>
                        <Button
                            data-testid="users-form-update-btn"
                            icon={<EditOutlined />}
                            onClick={() => openModal(record)}
                            style={{ marginRight: 8 }}
                        />
                    </Can>
                    <Can permission={PERMISSIONS.USERS.DELETE}>
                        <Popconfirm data-testid="users-form-delete-btn-confirm-popup" title={t('areYouSureDeleteUser')} onConfirm={() => handleDelete(record.id)} okText={t('yes')} cancelText={t('no')}>
                            <Button data-testid="users-form-delete-btn" icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                    </Can>
                </>
            ),
        },
    ];

    return (
        <Can permission={PERMISSIONS.USERS.VIEW} fallback={<NoPermission />}>
            <div>
                <Can permission={PERMISSIONS.USERS.CREATE}>
                    <Button data-testid="users-form-create-btn" type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ marginBottom: 16 }}>
                        {t('createUser')}
                    </Button>
                </Can>

                <Table dataSource={users} columns={columns} rowKey="id" />

                <Modal title={editingUser ? t('editUser') : t('createUser')} open={isModalOpen} onCancel={closeModal} onOk={() => form.submit()}>
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item data-testid="users-form-id" name="id" label="id" hidden>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            data-testid="users-form-full-name"
                            name="fullName"
                            label={t('name')}
                            rules={[
                                { required: true, message: t('pleaseEnterName') },
                                { max: 50, message: t('nameMaxLength') }
                            ]}
                        >
                            <Input maxLength={30} />
                        </Form.Item>

                        <Form.Item
                            data-testid="users-form-email"
                            name="email"
                            label={t('email')}
                            rules={[
                                { required: true, type: "email", message: t('pleaseEnterValidEmail') },
                                { max: 30, message: t('emailMaxLength') }
                            ]}
                        >
                            <Input maxLength={30} />
                        </Form.Item>

                        <Form.Item
                            data-testid="users-form-phone-number"
                            name="phoneNumber"
                            label={t('phoneNumber')}
                            rules={[
                                { required: true, message: t('pleaseEnterPhoneNumber') },
                                { pattern: /^\+?[1-9]\d{1,14}$/, message: t('invalidPhoneNumber') }
                            ]}
                        >
                            <Input maxLength={15} />
                        </Form.Item>

                        <Form.Item
                            data-testid="users-form-role"
                            name="role"
                            label={t('role')}
                            rules={[
                                { required: true, message: t('pleaseSelectRole') }
                            ]}
                        >
                            <Select
                                options={roles.map((role) => ({ value: role.id, label: role.name }))}
                            />
                        </Form.Item>
                    </Form>

                </Modal>
            </div>
        </Can>
    );
};

export default UserManagement;
