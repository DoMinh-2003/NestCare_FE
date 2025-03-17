import { Col, Row, Select } from "antd";
import AuthField from "../../components/molecules/auth-field/AuthField";
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import useAuthService from "../../services/useAuthService";

function RegisterPage() {
  const { register } = useAuthService()
  const onFinish: FormProps['onFinish'] = async (values) => {
    console.log('Success:', values);
    if (values) {
      const valuesSubmit: any = {
        ...values,
        fullName: values.fullName,
        email: values.email,
        username: values.email,
        password: values.password,
        phone: values.phone
      }

      const response = await register(valuesSubmit);
      if (response) {
        console.log("response: ", response)
      }
    }
  };

  return (
    <Form onFinish={onFinish} requiredMark={false} className="w-full h-fit">
      <div className="flex justify-between items-end">
        <h1 className="text-5xl-medium font-[800] text-[#ed302a] mb-4">ĐĂNG KÝ</h1>
        <img
          className="inline-block w-[60px]"
          src="https://sihospital.com.vn/images/logo.png"
          alt=""
        />
      </div>
      <Row gutter={15}>
        <Col span={12}>
          <AuthField
            label="Full name"
            placeholder="Your full name"
            name="fullName"
            message="Please enter your full name"
          />
        </Col>
        <Col span={12}>
          <AuthField
            label="Email"
            placeholder="Your Email"
            name="email"
            message="Please enter your email"
          />
        </Col>
      </Row>

      <Row gutter={15}>
        <Col span={12}>
          <AuthField
            label="Password"
            placeholder="Your password"
            name="password"
            message="Please enter your password"
          />
        </Col>
        <Col span={12}>
          <AuthField
            label="Confirm Password"
            placeholder="Your confirm password"
            name="confirmPassword"
            message="Please enter your confirm password"
          />
        </Col>
      </Row>

      <AuthField
        label="Phone Number"
        placeholder="Your phone number"
        name="phone"
        message="Please enter your phone number"
      />

      <AuthField
        label="Address"
        placeholder="Your Address"
        name="address"
        message="Please enter your address"
      />
      <Form.Item className="text-center mt-5">
        <button
          type="submit"
          className="w-full focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Đồng ý
        </button>
      </Form.Item>
    </Form>
  );
}

export default RegisterPage;