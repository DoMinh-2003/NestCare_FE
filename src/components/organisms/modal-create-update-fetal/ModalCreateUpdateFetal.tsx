import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, message, Button } from 'antd';
import moment from 'moment';
import { FetalData } from '../../../pages/nurse/fetal-detail';
import dayjs from 'dayjs';

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
    form: any
    fetal: FetalData | null; // For updating an existing record
    isModalOpen: boolean; // Controls the visibility of the modal
    handleCancel: () => void; // Function to close the modal
    onSubmit: (values: FetalData) => void; // Function to handle form submission
}

const ModalCreateUpdateFetal: React.FC<ModalCreateUpdateFetalProps> = ({ fetal, isModalOpen, handleCancel, onSubmit, form }) => {

    useEffect(() => {
        if (fetal) {
            console.log("fetal: ", fetal)
            form.setFieldsValue({
                name: fetal.name,
                note: fetal.note,
                dateOfPregnancyStart: fetal.dateOfPregnancyStart ? dayjs(fetal.dateOfPregnancyStart) : null,
                expectedDeliveryDate: fetal.expectedDeliveryDate ? dayjs(fetal.expectedDeliveryDate) : null,
                actualDeliveryDate: fetal.actualDeliveryDate ? dayjs(fetal.actualDeliveryDate) : null,
                healthStatus: fetal.healthStatus,
                status: fetal.status,
            });
        } else {
            form.resetFields();
        }
    }, [fetal, form]);

    const handleFinish = (values: any) => {
        console.log("handleFinish:", values)
        const record: FetalData = {
            ...values,
            dateOfPregnancyStart: moment(values.dateOfPregnancyStart?.$d).format('YYYY/MM/DD'),
            expectedDeliveryDate: moment(values.expectedDeliveryDate?.$d).format('YYYY/MM/DD'),
            actualDeliveryDate: moment(values.actualDeliveryDate?.$d).format('YYYY/MM/DD'),
            // id: fetal ? fetal.id : undefined, // Assign an ID if updating
            // isDeleted: 0, // Adjust based on your logic
            // createdAt: fetal ? fetal.createdAt : new Date().toISOString(),
            // updatedAt: new Date().toISOString(),
            // checkupRecords: [],
            // appointments: [],
        };
        console.log("fetal: ", values)
        onSubmit(record);
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
                initialValues={!fetal && {
                    ...form,
                    status: "PREGNANT"
                }}
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
                    <Input />
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
                {fetal
                    && <Form.Item
                        label="Actual Delivery Date"
                        name="actualDeliveryDate"
                    >
                        <DatePicker />
                    </Form.Item>
                }
                <Form.Item
                    label="Health Status"
                    name="healthStatus"
                    rules={[{ required: true, message: 'Please input the health status!' }]}
                >
                    <Input />
                </Form.Item>
                {
                    fetal && <div>
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[{ required: true, message: 'Please select the status!' }]}
                        >
                            <Select>
                                {
                                    status.map((item) => (
                                        <Select.Option value={item}>{item}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>

                    </div>

                }
                {
                    !fetal && <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: 'Please select the status!' }]}
                    >
                        <Input type="text" disabled />
                    </Form.Item>
                }
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        {fetal ? "Update" : "Create"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};
const status = ["PREGNANT", "BORN", "MISSED", "STILLBIRTH", "ABORTED", "MISCARRIAGE"]
export default ModalCreateUpdateFetal;