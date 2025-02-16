import { Form, Row } from "antd";
import { FcGoogle } from "react-icons/fc";
import AuthField from "../../components/molecules/auth-field/AuthField";

function LoginPage() {
  return (
    <div className="w-full">
      <Form requiredMark={false}  className="w-full h-fit">
        <div className="flex  justify-between items-end">
          <h1 className="text-5xl-medium font-[800] text-[#ed302a] mb-4">
            ĐĂNG NHẬP
          </h1>
          <img
            className="inline-block w-[60px]"
            src="https://sihospital.com.vn/images/logo.png"
            alt=""
          />
        </div>
        <AuthField
          label="Phone Number"
          placeholder="Your phone number"
          name="phoneNumber"
          message="Please enter your phone number"
        />
        <AuthField
          label="Password"
          placeholder="Your password"
          name="password"
          message="Please enter your password"
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
        <span className="px-2 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <button
        className="w-full focus:outline-none text-black border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
    flex gap-2 justify-center items-center transition-all duration-300 hover:bg-gray-100 hover:border-gray-400 
    shadow-md hover:shadow-lg"
      >
        <FcGoogle className="text-[26px]" />
        <span>Đăng nhập bằng Google</span>
      </button>
    </div>
  );
}

export default LoginPage;