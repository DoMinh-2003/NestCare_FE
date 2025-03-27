import React from 'react';
import { Modal, Form, Input, InputNumber, Button, Typography, message } from 'antd';
import userAppointmentService from '../../../services/useAppointmentService';

const { Title } = Typography;

// Define the interface for the form values
interface MotherHealthFormValues {
  motherWeight: number;
  motherBloodPressure: string;
  motherHealthStatus: string;
}

interface ModalUpdateMotherHealthProps {
  isVisible: boolean;
  onClose: () => void;
  id: string; // Optional initial values for the form
  onSumit: any
}

const ModalUpdateMotherHealth: React.FC<ModalUpdateMotherHealthProps> = ({ isVisible, onClose, id, onSumit }) => {
  const [form] = Form.useForm();
  const {updateMotherHeal}= userAppointmentService()
  // Populate the form with initial values if provided

  const onFinish = async(values: MotherHealthFormValues) => {
    const response = await updateMotherHeal(values, id)
    if(response){
      message.success("Cập nhật thông tin sức khoẻ thành công")
      message.success("Hãy chuyển trạng thái đặt lịch của bên nhân sang check in!")
      onSumit(response)
      onClose();
      form.resetFields()
    }
    console.log('Updated values:', values);
  };

  return (
    <Modal
      title="Update Mother's Health Information"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      className="rounded-lg"
    >
      <Title level={4}>Mother's Health Information</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Mother Weight (kg)"
          name="motherWeight"
          rules={[{ required: true, message: 'Please input the mother weight!' }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Mother Blood Pressure"
          name="motherBloodPressure"
          rules={[{ required: true, message: 'Please input the mother blood pressure!' }]}
        >
          <Input placeholder="e.g., 120/80" />
        </Form.Item>

        <Form.Item
          label="Mother Health Status"
          name="motherHealthStatus"
          rules={[{ required: true, message: 'Please input the mother health status!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalUpdateMotherHealth;