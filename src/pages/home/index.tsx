
import { useState } from "react";
import ModalBookingForm from "../../components/modals/modal-booking-form";
import About from "../../components/about";
import HomeCarousel from "../../components/home-carousel";
import DoctorCard from "../../components/card/doctor-card";
import BookingForm from "../../components/booking-form";
import {
  CheckOutlined
} from '@ant-design/icons';
import { doctors } from "../../data";
import { Input } from "antd";
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay } from "swiper/modules";
import { Pagination } from 'swiper/modules';
const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  return (
    <>
      <HomeCarousel />
      <div className="container mx-auto mt-5">
        <ModalBookingForm isModalOpen={isModalOpen} handleCancel={handleCancel} />
        <About />
        <div className="mt-14 grid grid-cols-12 gap-4">
          <div className="col-span-5">
            <p className="text-5xl text-pink-700 font-bold">Dịch vụ tại NextCare</p>
            <p className="mt-10">Tại SIHospital, chúng tôi cung cấp đa dạng các dịch vụ từ hỗ trợ sinh sản cho đến các dịch vụ chăm sóc mẹ và bé sau sinh, bao gồm: Phụ khoa; Khám thai; Hiếm muộn; Sanh; Chăm sóc mẹ & bé; Nhi – sơ sinh; Kế hoạch hóa gia đình, Cận lâm sàng.</p>
            <div className="mt-10">
              <button onClick={showModal} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                Đặt lịch ngay
              </button>
              <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
          <div className="col-span-7">
            <img src="https://sihospital.com.vn/images/dichvu.jpg" className="w-full" alt="" />
          </div>
        </div>

        <div className="  ">
          <p className="text-5xl font-bold text-pink-700 py-20">Đội ngũ bác sĩ</p>
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000 }}
            loop={true}
            slidesPerView={4}
            spaceBetween={30}
            pagination={{ clickable: true }}
            className="mySwiper"
            breakpoints={{
              320: { slidesPerView: 1 },  // Điện thoại nhỏ
              640: { slidesPerView: 2 },  // Tablet
              1024: { slidesPerView: 3 }, // Laptop
              1280: { slidesPerView: 4 }, // Màn hình lớn
            }}
          >
            {doctors.map((item, index) => (
              <SwiperSlide key={index}>
                <DoctorCard
                  professional_qualifications={item.professional_qualifications}
                  background_color={index % 2 === 0 ? "pink" : "blue"}
                  name={item.name}
                  specialty={item.specialty}
                  image={item.image}
                />
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
        <div className="mt-20 grid grid-cols-12 gap-10">
          <div className="text-center col-span-7">
            <div className="text-5xl text-pink-700 font-bold ">
              Đặt lịch ngay
            </div>
            <div className="mt-5 tex-xl">
              Bộ phận chăm sóc khách hàng sẽ liên hệ với quý khách để xác nhận lại cuộc hẹn
            </div>
            {/* form đk */}
            <BookingForm />
          </div>
          <div className="col-span-5">
            <img src="https://sihospital.com.vn/images/doctor-lich-kham-02.png" alt="" />
          </div>
        </div>
        {/* Dịch vụ nổi bật */}
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-7">
            <img src="https://sihospital.com.vn/uploads/202406/24/WqAQbn-dichvunoibat-3.jpg" alt="" />
          </div>
          <div className="col-span-5">
            <div className="text-5xl text-pink-700 font-bold mt-20">
              Dịch vụ nổi bật
            </div>
            <div className="mt-10">
              Với hành trình 23 năm phát triển trong nghành sản – phụ khoa, SIHospital tự hào là đơn vị tiên phong mang tiêu chuẩn dịch vụ bệnh viện Phụ sản Quốc tế đến Việt Nam. Khám phá các thế mạnh dịch vụ của SIHospital tại đây.
            </div>
            <div className="mt-10">
              <button onClick={showModal} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                Đặt lịch ngay
              </button>
              <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
        {/* Cảm nghĩ khách hàng */}
        <div>
          <div className="text-5xl text-pink-700 font-bold my-20">
            Cảm nghĩ khách hàng
          </div>
          <div className="grid grid-cols-3 gap-10">
            <iframe width={"100%"} className="h-56" src="https://www.youtube.com/embed/nNl_g6DLYJ0?si=jwc17zfbOD-ZqCxA"></iframe>
            <iframe width={"100%"} className="h-56" src="https://www.youtube.com/embed/nNl_g6DLYJ0?si=jwc17zfbOD-ZqCxA"></iframe>
            <iframe width={"100%"} className="h-56" src="https://www.youtube.com/embed/nNl_g6DLYJ0?si=jwc17zfbOD-ZqCxA"></iframe>
          </div>
        </div>

        {/* Kiến thức sức khỏe */}
        <div className="grid grid-cols-12 mt-20 gap-10">
          <img className="col-span-7" src="https://sihospital.com.vn/images/kienthucsuckhoe.png" alt="" />
          <div className="col-span-5">
            <div className="text-5xl text-pink-700 font-bold ">
              Kiến thức sức khỏe
            </div>
            <div className="mt-20">
              <button className="w-96 text-left bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
                <CheckOutlined className="text-pink-700 " />  Kiến thức Sản - Phụ khoa
              </button>
              <button className="w-96 text-left mt-14 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
                <CheckOutlined className="text-pink-700 " />  Kiến thức Mẹ & Bé
              </button>
              <button className="w-96 text-left mt-14 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
                <CheckOutlined className="text-pink-700 " />  Kiến thức Tiền hôn nhân
              </button>
              <button className="w-96 text-left mt-14 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
                <CheckOutlined className="text-pink-700 " />  Kiến thức Hiếm muộn vô sinh
              </button>
            </div>
          </div>
        </div>
        {/* Thông tin dành cho khách hàng */}
        <div className="mt-20 grid grid-cols-12 gap-10">
          <div className="col-span-4">
            <div className="text-5xl text-pink-700 font-bold">
              Thông tin dành cho khách hàng
            </div>
            <div className="mt-14 text-lg">
              Cẩm nang đắc lực giúp khách hàng và gia đình không bị bối rối khi bước vào không gian của gia đình SIHospital. Tham khảo các thông tin về các quy trình tại bệnh viện và các quyền lợi dành cho khách hàng tại đây.
            </div>
          </div>
          <div className="col-span-8 grid grid-cols-3 gap-0">
            <button className="w-64 text-left mt-10 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
              <CheckOutlined className="text-pink-700 " />  Quy trình khám bệnh NestCare
            </button>
            <button className="w-64 text-left mt-10 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
              <CheckOutlined className="text-pink-700 " />  Quy trình khám bệnh NestCare
            </button>
            <button className="w-64 text-left mt-10 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
              <CheckOutlined className="text-pink-700 " />  Quy trình khám bệnh NestCare
            </button>
            <button className="w-64 text-left mt-10 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
              <CheckOutlined className="text-pink-700 " />  Quy trình khám bệnh NestCare
            </button>
            <button className="w-64 text-left mt-10 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
              <CheckOutlined className="text-pink-700 " />  Quy trình khám bệnh NestCare
            </button>
            <button className="w-64 text-left mt-10 bg-white text-lg text-black px-4 py-4 border-b-2 border-b-gray-100 border-transparent rounded-lg transition-all duration-300 hover:border-red-500 hover:border-2">
              <CheckOutlined className="text-pink-700 " />  Quy trình khám bệnh NestCare
            </button>
          </div>
        </div>
        {/* Tìm hiểu thêm về NestCare? */}
        <div className="grid grid-cols-12 mt-20">
          <div className="col-span-5 text-5xl text-pink-700 font-bold grid place-items-center">
            <div>
              <p >
                Tìm hiểu thêm về
              </p>
              <p className="py-2">NestCare?</p>
              <p>
                Đăng ký nhận thông tin
              </p>
              <div className="grid grid-cols-12 gap-5 mt-20">
                <div className="col-span-7">
                  <Input className="p-2 hover:border-red-700" placeholder="Nhập email của bạn" type="text" />
                </div>
                <div className="col-span-5">
                  <button onClick={showModal} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                    Nhận bản tin
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-7 ">
            <div >
              <img className="rounded-xl" src="https://sihospital.com.vn/images/timhieuthemsih.jpg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage
