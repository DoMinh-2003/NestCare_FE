import PopoverNavbar from "../../atoms/popover/Popover";

const specialties = [
  "Khoa Khám bệnh",
  "Khoa Cấp cứu - Hồi Sức Tích Cực - Chống Độc",
  "Khoa Sanh",
  "Khoa Nhi - Sơ Sinh",
  "Khoa Hiếm muộn vô sinh",
  "Khoa Phẫu Thuật - Gây mê hồi sức",
  "Khoa Hậu phẫu hậu sản",
  "Khoa Dinh dưỡng tiết chế",
  "Khoa Dược - Nhà Thuốc",
  "Khoa Kế hoạch hóa gia đình",
  "Khối Cận lâm sàng"
];

const services = [
  "Gói dịch vụ",
  "Tất cả dịch vụ",
];

const knowledge = [
  "Kiến thức Sản - Phụ khoa",
  "Kiến thức Mẹ & Bé",
  "Kiến thức Tiền hôn nhân",
  "Kiến thức Hiếm muộn vô sinh"
];

const instruct = [
  "Quy trình khám bệnh SIHospital",
  "Quy trình nhập viện & xuất viện",
  "Quyền và nghĩa vụ của bệnh nhân",
  "Chính sách bảo mật SIHospital",
  "Thời gian hoạt động và thăm bệnh",
  "Hướng dẫn thanh toán viện phí"
];

const news = [
  "Tin tức NestCare",
  "Thông tin y khoa",
  "Lớp tiền sản",
  "Videos"
];

interface SpecialtiesProps {
  title: string
}

const PopoverNavList = ({ title }: SpecialtiesProps) => {
  let popContent: string[];

  switch (title) {
    case "Chuyên khoa":
      popContent = specialties;
      break;
    case "Dịch vụ":
      popContent = services;
      break;
    case "Hướng dẫn":
      popContent = instruct;
      break;
    case "Kiến thức":
      popContent = knowledge;
      break;
    case "Tin tức":
      popContent = news;
      break;
    default:
      popContent = [];
      break;
  }

  return (
    <div className="">
      <PopoverNavbar
        title={title}
        content={
          popContent
        }
      />
    </div>
  );
};

export default PopoverNavList;
