import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, message, Button } from 'antd';
import moment from 'moment';

export interface FetalRecord {
    id?: string; // Optional for new records
    name: string;
    note: string;
    dateOfPregnancyStart: string;
    expectedDeliveryDate: string;
    actualDeliveryDate: string | null;
    healthStatus: string;
    status: "PREGNANT" | "DELIVERED"; // You can add more statuses if needed
    isDeleted?: number; // Optional, depending on your logic
    createdAt?: string; // Optional, for tracking creation time
    updatedAt?: string; // Optional, for tracking update time
    checkupRecords?: any[]; // Optional, replace with specific type if available
    appointments?: any[]; // Optional, replace with specific type if available
}

interface ModalCreateUpdateFetalProps {
    fetal: FetalRecord | null; // For updating an existing record
    isModalOpen: boolean; // Controls the visibility of the modal
    handleCancel: () => void; // Function to close the modal
    onSubmit: (values: FetalRecord) => void; // Function to handle form submission
}

const ModalCreateUpdateFetal: React.FC<ModalCreateUpdateFetalProps> = ({ fetal, isModalOpen, handleCancel, onSubmit }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (fetal) {
            form.setFieldsValue({
                name: fetal.name,
                note: fetal.note,
                dateOfPregnancyStart: moment(fetal.dateOfPregnancyStart),
                expectedDeliveryDate: moment(fetal.expectedDeliveryDate),
                actualDeliveryDate: fetal.actualDeliveryDate ? moment(fetal.actualDeliveryDate) : null,
                healthStatus: fetal.healthStatus,
                status: fetal.status,
            });
        } else {
            form.resetFields();
        }
    }, [fetal, form]);

    const handleFinish = (values: any) => {
        const record: FetalRecord = {
            ...values,
            id: fetal ? fetal.id : undefined, // Assign an ID if updating
            isDeleted: 0, // Adjust based on your logic
            createdAt: fetal ? fetal.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            checkupRecords: [],
            appointments: [],
        };
        onSubmit(record);
        message.success(fetal ? "Fetal record updated successfully" : "Fetal record created successfully");
    };

    return (
        <Modal
            title={fetal ? "Update Fetal Record" : "Add Fetal Record"}
            visible={isModalOpen}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input the name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Note"
                    name="note"
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    label="Date of Pregnancy Start"
                    name="dateOfPregnancyStart"
                    rules={[{ required: true, message: 'Please select the date!' }]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    label="Expected Delivery Date"
                    name="expectedDeliveryDate"
                    rules={[{ required: true, message: 'Please select the date!' }]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    label="Actual Delivery Date"
                    name="actualDeliveryDate"
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    label="Health Status"
                    name="healthStatus"
                    rules={[{ required: true, message: 'Please input the health status!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: 'Please select the status!' }]}
                >
                    <Select>
                        <Select.Option value="PREGNANT">Pregnant</Select.Option>
                        <Select.Option value="DELIVERED">Delivered</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        {fetal ? "Update" : "Create"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCreateUpdateFetal;