import { useEffect, useState } from "react";
import useServiceService, { Service } from "../../../services/useServiceService";
import { Table, Input, Button, message } from "antd";
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import ModalCreateUpdateServices, { ServiceData } from "../../../components/organisms/modal-create-update-service";
import ModalDelete from "../../../components/organisms/modal-delete";

const ManagerServices = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const { createServices, updateServices, getServices, deleteServices } = useServiceService();
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

    useEffect(() => {
        getServicesFromCustomer();
    }, []);

    const handleOpenModal = (service?: Service) => {
        setSelectedService(service || null);
        setIsModalOpen(true);
    };

    const handleOpenModalDelete = (service: Service) => {
        setSelectedService(service);
        setIsModalDeleteOpen(true);
    };

    const handleOkModalDelete = async () => {
        if (!selectedService) return; // Ensure selectedService is defined
        const response = await deleteServices(selectedService.id);
        if (response) {
            message.success(`Xóa dịch vụ ${selectedService.name} thành công`);
            setSelectedService(null);
            setIsModalDeleteOpen(false);
            getServicesFromCustomer(); // Refresh the service list after deletion
        } else {
            message.error(`Xóa dịch vụ ${selectedService.name} thất bại`);
        }
    };

    const handleCancelModalDelete = () => {
        setIsModalDeleteOpen(false);
    };

    const handleSaveService = async (values: ServiceData) => {
        if (!values.id) {
            const response = await createServices(values);
            if (response && response.data) {
                message.success("Tạo service thành công");
                getServicesFromCustomer();
            }
        } else {
            const response = await updateServices(values);
            if (response && response.data) {
                message.success("Cập nhật service thành công");
                getServicesFromCustomer();
            }
        }
    };

    const getServicesFromCustomer = async () => {
        const response = await getServices();
        if (response && Array.isArray(response.data)) {
            setServices(response.data.filter((item: Service) => !item.isDeleted));
        } else {
            console.error("Expected an array but got:", response.data);
            setServices([]); // Ensure an array is always passed to Table
        }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
        },
        {
            title: 'Action',
            render: (record: Service) => (
                <div className="flex gap-2">
                    <EditOutlined onClick={() => handleOpenModal(record)} className="text-blue" />
                    <DeleteOutlined onClick={() => handleOpenModalDelete(record)} className="text-red-500" />
                </div>
            )
        },
    ];

    return (
        <div>
            <ModalDelete
                handleCancelModalDelete={handleCancelModalDelete}
                handleOkModalDelete={handleOkModalDelete}
                name={selectedService?.name || ""}
                isModalOpenDelete={isModalDeleteOpen}
            />
            <ModalCreateUpdateServices
                visible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSaveService} // Pass the function directly
                initialValues={selectedService}
            />
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search by name"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 200, marginRight: 8 }}
                    suffix={<SearchOutlined />}
                />
                <Button type="primary" onClick={() => handleOpenModal()}>
                    Thêm dịch vụ
                </Button>
            </div>
            <Table
                dataSource={filteredServices}
                columns={columns}
                rowKey="id"
            />
        </div>
    );
};

export default ManagerServices;