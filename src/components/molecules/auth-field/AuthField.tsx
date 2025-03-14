import { Form, Input } from "antd";

interface AuthFieldProps {
  label?: React.ReactNode ;
  placeholder?: string;
  name?: string;
  message?: string;
}

function AuthField({ label, placeholder, name, message }: AuthFieldProps) {
  return (
    <Form.Item
      name={name}
      rules={[{ required: true, message: message }]}
      label=  {<p className="text-base-medium">{label}</p>}

    >
    
      <Input className="p-1 w-full" placeholder={placeholder} />
    </Form.Item>
  );
}

export default AuthField;
