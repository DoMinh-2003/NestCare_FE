
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
        services: ["Từ 9 đến 12 tuần", "Từ 12 đến 20 tuần", "Từ 32 tuần đến trước sinh"]
    },
    {
        name: "Gói Khám Sức Khỏe",
        services: ["Khám tổng quát", "Kiểm tra huyết áp", "Xét nghiệm máu"]
    },
    {
        name: "Gói Khám Tim Mạch",
        services: ["Kiểm tra điện tâm đồ", "Siêu âm tim", "Xét nghiệm mỡ máu"]
    },
    {
        name: "Gói Khám Phụ Khoa",
        services: ["Khám phụ khoa định kỳ", "Xét nghiệm Pap smear", "Siêu âm phụ khoa"]
    },
    {
        name: "Gói Khám Tiền Sản",
        services: ["Kiểm tra sức khỏe bà bầu", "Siêu âm thai nhi", "Xét nghiệm huyết áp", "Tư vấn dinh dưỡng"]
    }
];

export default ServicesPackageList