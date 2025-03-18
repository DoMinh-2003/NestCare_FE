import type { FormProps } from 'antd';
import { Col, Form, Row, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import AuthField from "../../components/molecules/auth-field/AuthField";
import useAuthService from "../../services/useAuthService";
import { USER_ROUTES } from '../../constants/routes';

function RegisterPage() {
  const { register } = useAuthService()
  const navigate = useNavigate();
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
    <div className="w-full">
      <Form onFinish={onFinish} requiredMark={false} className="w-full h-fit">
        <div className="flex justify-between items-end">
          <h1 className="text-5xl-medium font-[800] text-[#ed302a] mb-4">ĐĂNG KÝ</h1>
          <img
            className="inline-block w-[60px] cursor-pointer"
            src="https://sihospital.com.vn/images/logo.png"
            alt=""
            onClick={() => navigate(USER_ROUTES.HOME)}
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
      <div className="flex items-center w-full my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-2 text-gray-500 text-sm">Hoặc</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <div>
        <p className="text-center text-gray-500 text-lg">
          Bạn đã có tài khoản? <Link to={USER_ROUTES.LOGIN} className="text-red-500">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;