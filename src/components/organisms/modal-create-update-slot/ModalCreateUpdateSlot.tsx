import React from 'react';
import { Modal, Form, TimePicker } from 'antd';
import moment from 'moment';
export interface Slot {
    id?: string;
    startTime: string;
    endTime: string;
    createdAt?: string;
    updatedAt?: string;
    isActive?: boolean;
}

interface SlotModalProps {
    visible: boolean;
    onCreate: (slot: Slot) => void;
    onCancel: () => void;
    editingSlot: Slot | null;
}
const ModalCreateUpdateSlot = ({ visible, onCreate, onCancel, editingSlot }: SlotModalProps) => {
    const [form] = Form.useForm();

    // Khi modal mở, nếu có slot đang chỉnh sửa, thiết lập giá trị cho form
    React.useEffect(() => {
        if (editingSlot) {
            form.setFieldsValue({
                startTime: moment(editingSlot.startTime, 'HH:mm:ss'),
                endTime: moment(editingSlot.endTime, 'HH:mm:ss'),
            });
        } else {
            form.resetFields();
        }
    }, [editingSlot, form]);

    return (
        <Modal
            title={editingSlot ? "Cập Nhật Slot" : "Thêm Slot"}
            visible={visible}
            onOk={() => {
                form.validateFields().then(values => {
                    onCreate({
                        startTime: values.startTime.format('HH:mm:ss'),
                        endTime: values.endTime.format('HH:mm:ss'),
                        createdAt: editingSlot ? editingSlot.createdAt : new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    });
                    form.resetFields();
                });
            }}
            onCancel={onCancel}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="startTime"
                    label="Start Time"
                    rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}
                >
                    <TimePicker format="HH:mm:ss" />
                </Form.Item>
                <Form.Item
                    name="endTime"
                    label="End Time"
                    rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}
                >
                    <TimePicker format="HH:mm:ss" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCreateUpdateSlot;