import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Select, Form, Popconfirm, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import * as PermissionsService from "../services/PermissionsService";
import * as SubjectsService from "../services/SubjectsService";
import * as RolesService from "../services/RolesService";

const { Option } = Select;

const PermissionTable = () => {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const rolesData = await RolesService.GetAll();
      const subjectsData = await SubjectsService.GetAll();
      const permissionsData = await PermissionsService.GetAllRolePermissions();

      setRoles(rolesData);
      setSubjects(subjectsData);
      setData(permissionsData);
    } catch (error) {
      message.error("Failed to fetch data");
    }
  };

  const fetchPermissionsBySubject = async (subject) => {
    try {
      const permissionsData = await PermissionsService.GetAllBySubject(subject);
      setPermissions(permissionsData);
    } catch (error) {
      message.error("Failed to fetch permissions");
    }
  };

  const handleDelete = async (id) => {
    try {
      await PermissionsService.DeletelRolePermission(id);
      message.success("Permission deleted successfully");
      await fetchData();
    } catch (error) {
      message.error("Failed to delete permission");
    }
  };

  const handleAdd = async (values) => {
    try {
      const body = {
        roleId: values.role,
        subject: values.subject,
        permissions: values.permissions,
      };
      await PermissionsService.AssignPermissionsToRole(body);
      message.success("Permissions assigned successfully");
      setIsModalVisible(false);
      form.resetFields();
      await fetchData();
    } catch (error) {
      message.error("Failed to assign permissions");
    }
  };

  // Group data by Role -> Subject (Type)
  const groupedData = data.reduce((acc, permission) => {
    const roleId = permission.role?.id;
    const subject = permission.subject;

    if (!acc[roleId]) {
      acc[roleId] = {
        role: permission.role,
        subjects: {},
      };
    }

    if (!acc[roleId].subjects[subject]) {
      acc[roleId].subjects[subject] = [];
    }

    acc[roleId].subjects[subject].push(permission);
    return acc;
  }, {});

  const renderRoleData = Object.values(groupedData).map((group) => ({
    key: group.role.id,
    role: group.role,
    subjects: group.subjects,
  }));

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
      >
        Add Permission
      </Button>

      <Table
        dataSource={renderRoleData}
        rowKey="key"
        style={{ marginTop: 20 }}
        bordered
        expandable={{
          expandedRowRender: (record) => (
            <Table
              dataSource={Object.entries(record.subjects).map(([subject, permissions]) => ({
                key: subject,
                subject,
                permissions,
              }))}
              rowKey="key"
              pagination={false}
              columns={[
                {
                  title: "Type",
                  dataIndex: "subject",
                  key: "subject",
                },
                {
                  title: "Permissions",
                  dataIndex: "permissions",
                  key: "permissions",
                  render: (permissions) =>
                    permissions.map((perm) => (
                      <span key={perm.id} style={{ marginRight: 8 }}>
                        {perm.permission}{" "}
                        <Popconfirm
                          title="Are you sure?"
                          onConfirm={() => handleDelete(perm.id)}
                        >
                          <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
                        </Popconfirm>
                      </span>
                    )),
                },
              ]}
            />
          ),
        }}
      >
        <Table.Column
          title="Role"
          dataIndex="role"
          key="role"
          render={(role) => role?.name || "N/A"}
        />
      </Table>

      <Modal
        title="Add Permission"
        open={isModalVisible}
        maskClosable={false}
        onCancel={() => {
          form.resetFields();
          setIsModalVisible(false);
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select a role">
              {roles.map((role) => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
            <Select
              placeholder="Select a subject"
              onChange={(value) => {
                fetchPermissionsBySubject(value);
              }}
            >
              {subjects.map(({ subject }) => (
                <Option key={subject} value={subject}>
                  {subject}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="permissions" label="Permissions" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="Select permissions">
              {permissions.map(({ permission }) => (
                <Option key={permission} value={permission}>
                  {permission}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PermissionTable;
