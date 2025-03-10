import { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import usePackageService, { Package, PackageService } from "../../../services/usePackageService";
import ModalServiceOfPackage from "../../../components/organisms/modal-services-of-package/ModalServiceOfPackage";

const ManagePackage = () => {
    const [packages, setPackages] = useState<Package[]>([])
    const { getPackages } = usePackageService()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [servicesOfPackage, setServicesOfPackage] = useState<PackageService[]>([])
    
    useEffect(() => {
        getPackagesFromAdmin()
    }, []);

    const handleOpenModal = (packageServices: PackageService[]) => {
        setServicesOfPackage(packageServices);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const getPackagesFromAdmin = async () => {
        const response = await getPackages()
        console.log("response: ", response.data)
        if (response && response.data) {
            setPackages(response.data)
        }
    }

    const columns = [
        {
            title: "Tên gói",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Giá (USD)",
            dataIndex: "price",
            key: "price",
        },
        {
            title: "Chu kỳ",
            dataIndex: "period",
            key: "period",
        },
        {
            title: "Giao hàng",
            dataIndex: "delivery_included",
            key: "delivery_included",
            render: (value: number) => (value ? <Tag color="green">Có</Tag> : <Tag color="red">Không</Tag>),
        },
        {
            title: "Cảnh báo",
            dataIndex: "alerts_included",
            key: "alerts_included",
            render: (value: number) => (value ? <Tag color="green">Có</Tag> : <Tag color="red">Không</Tag>),
        },
        {
            title: "Trạng thái",
            dataIndex: "isDeleted",
            key: "isDeleted",
            render: (value: number) => (value ? <Tag color="red">Đã xóa</Tag> : <Tag color="blue">Hoạt động</Tag>),
        },
        {
            title: "Dịch vụ",
            dataIndex: "packageServices",
            key: "packageServices",
            render: (packageServices: PackageService[]) => (
                <div onClick={()=>handleOpenModal(packageServices)} className="text-blue cursor-pointer">
                    Xem dịch vụ
                </div>
            )
        },
    ];

    return (
        <div>
            <ModalServiceOfPackage
                services={servicesOfPackage}
                isModalOpen={isModalOpen}
                handleCancel={handleCancel}
            />
            <Table columns={columns} dataSource={packages} rowKey="id" />
        </div>
    );
};

export default ManagePackage;
