import { useEffect, useState } from "react";
import { Button, Input, message, Table, Tag } from "antd";
import usePackageService, { Package, PackageService } from "../../../services/usePackageService";
import ModalServiceOfPackage from "../../../components/organisms/modal-services-of-package/ModalServiceOfPackage";
import ModalCreateUpdatePackage, { PackageCreateUpdate } from "../../../components/organisms/modal-create-update-package/ModalCreateUpdatePackage";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { formatMoney } from "../../../utils/formatMoney";

const ManagePackage = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const { getPackages, createPackage, updatePackage } = usePackageService();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState<string>("");
    const [servicesOfPackage, setServicesOfPackage] = useState<PackageService[]>([]);
    const [isModalOpenCreateUpdate, setIsModalOpenCreateUpdate] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);
    const [modalWidth, setModalWidth] = useState<number | string>(800);

    useEffect(() => {
        getPackagesFromAdmin();
    }, []);

    useEffect(() => {
        getPackagesFromAdmin();
        // Update modal width based on screen size
        const updateWidth = () => {
            if (window.innerWidth < 768) {
                setModalWidth("90%");
            } else if (window.innerWidth < 1024) {
                setModalWidth(400);
            } else {
                setModalWidth(600);
            }
        };
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
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
        console.log("response: ", response);
        if (response && response) {
            setPackages(response);
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

    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    const columns = [
        {
            title: "Tên gói",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Giá (VND)",
            dataIndex: "price",
            key: "price",
            render: (price: number) => formatMoney(price)
        },
        {
            title: "Chu kỳ",
            dataIndex: "period",
            key: "period",
            render: (period: string) => {
                switch (period) {
                    case "WEEKLY":
                        return "Hàng tuần";
                    case "FULL":
                        return "Toàn thời gian";
                    case "MONTHLY":
                        return "Hàng tháng";
                    case "DAILY":
                        return "Hàng ngày";
                    default:
                        return period;
                }
            },
        },

        // {
        //     title: "Giao hàng",
        //     dataIndex: "delivery_included",
        //     key: "delivery_included",
        //     render: (value: number) => (value ? <Tag color="green">Có</Tag> : <Tag color="red">Không</Tag>),
        // },
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
            title: 'Hành động',
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
            <h1 className="text-5xl font-extrabold text-center mb-5">
                Quản lí gói dịch vụ
            </h1>
            <div className="mb-4 flex items-center justify-between">
                <Input
                    placeholder="Tìm theo tên dịch vụ"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 200, marginRight: 8 }}
                    suffix={<SearchOutlined />}
                />
                <Button type="primary" onClick={() => handleOpenModalCreateUpdate()}>
                    Thêm gói dịch vụ
                </Button>
            </div>
            <ModalCreateUpdatePackage
                visible={isModalOpenCreateUpdate}
                onCancel={() => setIsModalOpenCreateUpdate(false)}
                onSubmit={handleSubmit}
                initialValues={editingPackage}
                width={modalWidth}
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