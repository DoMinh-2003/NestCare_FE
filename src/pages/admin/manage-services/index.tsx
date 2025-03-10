import { useEffect, useState } from "react";
import useServiceService, { Service } from "../../../services/useServiceService";
import { Table, Input, Button, message } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import ModalCreateUpdateServices from "../../../components/organisms/modal-create-update-service";

const ManagerServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const { createServices } = useServiceService()

  const handleOpenModal = (service = null) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleSaveService = async (values: any) => {
    console.log("Dữ liệu gửi lên:", values);
    // Gửi dữ liệu lên API
    const response = await createServices(values)
    if (response && response.data) {
      setServices(response.data)
      message.success("Tạo service thành công")
      getServicesFromCustomer()
    }
  };
  const { getServices } = useServiceService();

  useEffect(() => {
    getServicesFromCustomer();
  }, []);

  const getServicesFromCustomer = async () => {
    const response = await getServices();
    console.log("API Response:", response); // Log toàn bộ response để kiểm tra

    if (response && Array.isArray(response.data)) {
      setServices(response.data);
    } else {
      console.error("Expected an array but got:", response.data);
      setServices([]); // Đảm bảo luôn truyền một mảng vào Table
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // const filteredServices = Array.isArray(services)
  //   ? services.filter(service =>
  //     service.name.toLowerCase().includes(searchText.toLowerCase())
  //   )
  //   : [];

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
  ];

  return (
    <div>
      <ModalCreateUpdateServices
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveService}
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
        dataSource={Array.isArray(services) ? services : []}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};

export default ManagerServices;

