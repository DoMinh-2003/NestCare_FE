
import ServicePackage from '../../molecules/service-package';

const ServicesPackageList = () => {
    return (
        <div>
            {
                servicePackages.map((item) => (
                    <div>
                        <ServicePackage
                            name={item.name}
                            services={item.services}
                            image={item.image}
                        />
                    </div>
                ))
            }
        </div>
    )
}

const servicePackages = [
    {
        name: "Gói Khám thai",
        services: ["Từ 9 đến 12 tuần", "Từ 12 đến 20 tuần", "Từ 32 tuần đến trước sinh"],
        image: "https://sihospital.com.vn/uploads/202405/20/EsUy1F-go-i-kha-m-thai.jpg"
    },
    {
        name: "Gói Khám Sức Khỏe",
        services: ["Khám tổng quát", "Kiểm tra huyết áp", "Xét nghiệm máu"],
         image: "https://sihospital.com.vn/uploads/202405/20/EsUy1F-go-i-kha-m-thai.jpg"
    },
    {
        name: "Gói Khám Tim Mạch",
        services: ["Kiểm tra điện tâm đồ", "Siêu âm tim", "Xét nghiệm mỡ máu"],
         image: "https://sihospital.com.vn/uploads/202405/20/EsUy1F-go-i-kha-m-thai.jpg"
    },
    {
        name: "Gói Khám Phụ Khoa",
        services: ["Khám phụ khoa định kỳ", "Xét nghiệm Pap smear", "Siêu âm phụ khoa"],
         image: "https://sihospital.com.vn/uploads/202405/20/EsUy1F-go-i-kha-m-thai.jpg"
    },
    {
        name: "Gói Khám Tiền Sản",
        services: ["Kiểm tra sức khỏe bà bầu", "Siêu âm thai nhi", "Xét nghiệm huyết áp", "Tư vấn dinh dưỡng"],
         image: "https://sihospital.com.vn/uploads/202405/20/EsUy1F-go-i-kha-m-thai.jpg"
    }
];

export default ServicesPackageList