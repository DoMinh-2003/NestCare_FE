import { Form, Input } from "antd";

interface AuthFieldProps {
  label: string;
  placeholder?: string;
  name?: string;
  message?: string;
}

function AuthField({ label, placeholder, name, message }: AuthFieldProps) {
  return (
    <Form.Item
      name={name}
      rules={[{ required: true, message: message }]}
      label={label}
    >
      <Input className="p-1 w-full" placeholder={placeholder} />
    </Form.Item>
  );
}

export default AuthField;
