import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Button } from "antd";

interface ServiceFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: ServiceData) => void;
  initialValues?: ServiceData | null;
}

interface ServiceData {
  name: string;
  description: string;
  price: number;
}

const ModalCreateUpdateServices: React.FC<ServiceFormProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, visible, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
        onClose();
      })
      .catch((info) => {
        console.error("Validation Failed:", info);
      });
  };

  return (
    <Modal
      title={initialValues ? "Cập nhật dịch vụ" : "Tạo mới dịch vụ"}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {initialValues ? "Cập nhật" : "Tạo mới"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên dịch vụ"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ" }]}
        >
          <Input placeholder="Nhập tên dịch vụ" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea placeholder="Nhập mô tả dịch vụ" rows={4} />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[
            { required: true, message: "Vui lòng nhập giá" },
            { type: "number", min: 0, message: "Giá phải lớn hơn 0" },
          ]}
        >
          <InputNumber placeholder="Nhập giá dịch vụ" className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateUpdateServices;
