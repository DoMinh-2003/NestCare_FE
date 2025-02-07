import { FaFacebook, FaTiktok, FaYoutube, FaPhoneAlt } from "react-icons/fa";
import { BsMessenger } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 mt-32">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Thông tin chính */}
          <div className="col-span-2">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-12 h-12 object-contain"
              />
              <h2 className="text-xl font-bold text-red-500 uppercase">
                NestCare
              </h2>
            </div>
            <p className="mt-4">Hotline:</p>
            <p className="font-semibold">089 830 0028</p>
            <p className="mt-2">Hỗ trợ: info@sihospital.com.vn</p>
            <div className="flex items-center gap-4 mt-4">
              <FaFacebook className="text-2xl cursor-pointer hover:text-blue-500" />
              <FaTiktok className="text-2xl cursor-pointer hover:text-gray-400" />
              <BsMessenger className="text-2xl cursor-pointer hover:text-blue-400" />
              <FaYoutube className="text-2xl cursor-pointer hover:text-red-500" />
            </div>
            <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-full text-white font-semibold hover:bg-blue-600">
              <FaPhoneAlt />
              089 830 0028
            </button>
          </div>

          {/* Dịch vụ */}
          <div>
            <h3 className="font-semibold">Dịch vụ</h3>
            <ul className="mt-2 space-y-2">
              <li className="hover:text-gray-400 cursor-pointer">Gói dịch vụ</li>
              <li className="hover:text-gray-400 cursor-pointer">
                Tất cả dịch vụ
              </li>
            </ul>
          </div>

          {/* Tìm hiểu thêm */}
          <div>
            <h3 className="font-semibold">Tìm hiểu thêm</h3>
            <ul className="mt-2 space-y-2">
              <li className="hover:text-gray-400 cursor-pointer">Về SIHospital</li>
              <li className="hover:text-gray-400 cursor-pointer">
                Đội ngũ bác sĩ
              </li>
              <li className="hover:text-gray-400 cursor-pointer">
                Câu hỏi thường gặp
              </li>
              <li className="hover:text-gray-400 cursor-pointer">Tuyển dụng</li>
            </ul>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div>
            <h3 className="font-semibold">Hỗ trợ khách hàng</h3>
            <ul className="mt-2 space-y-2">
              <li className="hover:text-gray-400 cursor-pointer">
                Quyền của bệnh nhân
              </li>
              <li className="hover:text-gray-400 cursor-pointer font-semibold">
                Chính sách bảo mật
              </li>
              <li className="hover:text-gray-400 cursor-pointer">
                Chính sách bảo mật thông tin
              </li>
              <li className="hover:text-gray-400 cursor-pointer">Liên hệ</li>
            </ul>
          </div>

          {/* Thời gian làm việc */}
          <div>
            <h3 className="font-semibold">Thời gian làm việc</h3>
            <p className="mt-2">Cấp cứu 24/24</p>
            <p className="mt-1">Thứ 2 - CN: 6:00 - 16:00</p>
            <p className="mt-1">Ngoài giờ: 16:00 - 20:00</p>
          </div>
        </div>

        {/* Địa chỉ */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="font-semibold">Địa chỉ</p>
          <p>63 Bùi Thị Xuân, P. Phạm Ngũ Lão, Q.1, TP. HCM</p>
          <a href="#" className="text-blue-400 hover:underline mt-2 inline-block">
            Xem bản đồ
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
