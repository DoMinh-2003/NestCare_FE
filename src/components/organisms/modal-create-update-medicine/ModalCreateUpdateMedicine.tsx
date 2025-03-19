import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

export interface Medicine {
  id?: string;
  name: string;
  description: string;
  dosage: string;
  price: number;
}

interface MedicineModalProps {
  form: any
  visible: boolean;
  onCreate: (values: Medicine) => void;
  onCancel: () => void;
  currentMedicine?: Medicine | null;
}

const ModalCreateUpdateMedicine: React.FC<MedicineModalProps> = ({ visible, onCreate, onCancel, currentMedicine, form }) => {
  console.log("ModalCreateUpdateMedicine: ", currentMedicine)
  useEffect(() => {
    if (currentMedicine) {
      form.setFieldsValue({
        name: currentMedicine.name,
        description: currentMedicine.description,
        dosage: currentMedicine.dosage,
        price: currentMedicine.price,
      })
    } else {
      form.resetFields();
    }
  }, [form, currentMedicine])
  const handleFinish = (values: Medicine) => {
    onCreate(values); // Gọi hàm onCreate từ component cha với giá trị form
  };
  return (
    <Modal
      title={currentMedicine ? "Cập Nhật Thuốc" : "Thêm Thuốc"}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      className="rounded-lg" // Thêm góc bo cho modal
    >
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical" // Đặt layout cho form
      >
        <Form.Item
          label="Tên thuốc"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên thuốc!' }]}
        >
          <Input className="border border-gray-300 rounded-md p-2" placeholder="Nhập tên thuốc" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả thuốc!' }]}
        >
          <Input.TextArea className="border border-gray-300 rounded-md p-2" placeholder="Nhập mô tả thuốc" rows={4} />
        </Form.Item>

        <Form.Item
          label="Liều lượng"
          name="dosage"
          rules={[{ required: true, message: 'Vui lòng nhập liều lượng thuốc!' }]}
        >
          <Input className="border border-gray-300 rounded-md p-2" placeholder="Nhập liều lượng thuốc" />
        </Form.Item>

        <Form.Item
          label="Giá (VNĐ)"
          name="price"
          rules={[{ required: true, message: 'Vui lòng nhập giá thuốc!' }]}
        >
          <InputNumber min={0} className="border border-gray-300 rounded-md p-2 w-full" placeholder="Nhập giá thuốc" />
        </Form.Item>

        <Form.Item>
          <button type="submit" className="ant-btn ant-btn-primary w-full py-2 rounded-md">
            {currentMedicine ? "Cập Nhật" : "Thêm"}
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateUpdateMedicine;