import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import DoctorCard from "../../molecules/doctor-card/DoctorCard";


const DoctorList = () => {
  return (
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
  );
};

export const doctors = [
    {
      name: "Nguyễn Văn An",
      specialty: "Nội khoa",
      professional_qualifications: "BS.CK1",
      background_color: "#FFDDC1",
      image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
    },
    {
      name: "Trần Thị Bình",
      specialty: "Nhi khoa",
      professional_qualifications: "BS.CK1",
      background_color: "#C1E1FF",
      image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
    },
    {
      name: "Lê Văn Cường",
      specialty: "Tim mạch",
      professional_qualifications: "BS.CK1",
      background_color: "#E1FFC1",
      image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
    },
    {
      name: "Phạm Thị Dung",
      specialty: "Sản phụ khoa",
      professional_qualifications: "BS.CK1",
      background_color: "#FFC1E1",
      image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
    },
    {
      name: "Hoàng Văn Đức",
      specialty: "Chấn thương chỉnh hình",
      professional_qualifications: "BS.CK1",
      background_color: "#FFD700",
      image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
    },
    {
      name: "Vũ Thị Hạnh",
      specialty: "Da liễu",
      professional_qualifications: "BS.CK1",
      background_color: "#98FB98",
      image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
    },
    {
      name: "Đinh Văn Khánh",
      specialty: "Tai - Mũi - Họng",
      professional_qualifications: "BS.CK1",
      background_color: "#ADD8E6",
      image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
    },
    {
      name: "Ngô Thị Lan",
      specialty: "Mắt",
      professional_qualifications: "BS.CK1",
      background_color: "#FFB6C1",
      image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
    }
  ];
export default DoctorList;
