import { useEffect, useState } from "react";
import { Button, message, Table, Tag } from "antd";
import usePackageService, { Package, PackageService } from "../../../services/usePackageService";
import ModalServiceOfPackage from "../../../components/organisms/modal-services-of-package/ModalServiceOfPackage";
import ModalCreateUpdatePackage, { PackageCreateUpdate } from "../../../components/organisms/modal-create-update-package/ModalCreateUpdatePackage";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const ManagePackage = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const { getPackages, createPackage, updatePackage } = usePackageService();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [servicesOfPackage, setServicesOfPackage] = useState<PackageService[]>([]);
    const [isModalOpenCreateUpdate, setIsModalOpenCreateUpdate] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);

    useEffect(() => {
        getPackagesFromAdmin();
    }, []);

    const handleOpenModal = (packageServices: PackageService[]) => {
        setServicesOfPackage(packageServices);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const getPackagesFromAdmin = async () => {
        const response = await getPackages();
        console.log("response: ", response.data);
        if (response && response.data) {
            setPackages(response.data);
        }
    };

    const handleSubmit = async (data: PackageCreateUpdate) => {
        console.log("Submitted Package:", data);
        if (!data.id) {
            const response = await createPackage(data);
            if (response && response.data) {
                message.success("Tạo gói thành công");
                getPackagesFromAdmin();
            }
        } else {
            const response = await updatePackage(data);
            if (response && response.data) {
                message.success("Cập nhật gói thành công");
                getPackagesFromAdmin();
            }
        }
        setIsModalOpenCreateUpdate(false);
    };

    const handleOpenModalCreateUpdate = (packageCreateUpdate?: Package) => {
        if (packageCreateUpdate) {
            setEditingPackage(packageCreateUpdate);
        } else {
            setEditingPackage(null);
        }
        setIsModalOpenCreateUpdate(true);
    };

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
                <div onClick={() => handleOpenModal(packageServices)} className="text-blue cursor-pointer">
                    Xem dịch vụ
                </div>
            ),
        },
        {
            title: 'Action',
            render: (record: Package) => (
                <div className="flex gap-2">
                    <EditOutlined onClick={() => handleOpenModalCreateUpdate(record)} className="text-blue" />
                    {/* <DeleteOutlined onClick={() => handleOpenModalDelete(record)} className="text-red-500" /> */}
                </div>
            )
        },
    ];

    return (
        <div>
            <Button onClick={()=>handleOpenModalCreateUpdate()} type="primary" style={{ marginBottom: 16 }}>
                Tạo gói
            </Button>
            <ModalCreateUpdatePackage
                visible={isModalOpenCreateUpdate}
                onCancel={() => setIsModalOpenCreateUpdate(false)}
                onSubmit={handleSubmit}
                initialValues={editingPackage}
            />
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