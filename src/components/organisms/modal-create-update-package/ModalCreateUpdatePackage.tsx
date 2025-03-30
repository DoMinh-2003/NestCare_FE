import { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Button, Select, Table } from "antd";
import useServiceService, { Service } from "../../../services/useServiceService";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Package, PackageService } from "../../../services/usePackageService";
import { formatMoney } from "../../../utils/formatMoney";

export interface PackageServiceCreateUpdate {
    serviceId: string;
    slot: number; // Số lượng slot cho dịch vụ
}

export interface PackageCreateUpdate {
    name: string;
    description: string;
    price: number;
    durationValue: number; // Thêm trường durationValue
    durationType: string; // Thêm trường durationType
    packageServices: PackageServiceCreateUpdate[]; // Danh sách dịch vụ
    id?: string;
}

const ModalCreateUpdatePackage = ({ visible, onCancel, onSubmit, initialValues, width, form }: {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: PackageCreateUpdate) => void;
    initialValues?: Package | null;
    width?: number | string;
    form: any
}) => {
    const { getServices } = useServiceService();
    const [services, setServices] = useState<Service[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [oldServices, setOldServices] = useState<PackageService[]>([]);
    const [discount, setDiscount] = useState<number>(0);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [slots, setSlots] = useState<{ [key: string]: number }>({}); // Lưu số lượng slot cho từng dịch vụ

    useEffect(() => {
        getServicesFromCustomer();
        if (initialValues) {
            form.setFieldsValue(initialValues);
            setOldServices(initialValues?.packageServices);
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const getServicesFromCustomer = async () => {
        const response = await getServices();
        if (response && Array.isArray(response.data)) {
            setServices(response.data.filter((item: Service) => item.isDeleted === false));
        } else {
            console.error("Expected an array but got:", response.data);
            setServices([]); // Ensure an array is always passed to Table
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formattedValues = {
                ...values,
                price: totalPrice, 
                packageService: selectedServices.map(serviceId => ({
                    serviceId,
                    slot: slots[serviceId], // Lấy số slot từ trường nhập
                })),
            };
            setDiscount(0);
            form.resetFields();
            onSubmit(formattedValues);
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const calculateTotalPrice = () => {
        const total = selectedServices.reduce((sum, serviceId) => {
            const service = services.find(s => s.id === serviceId);
            const slot = slots[serviceId] || 0; // Sử dụng số slot mới
            return sum + (service ? service.price * slot : 0);
        }, 0);

        const priceDiscount = total - (total * (discount / 100));
        setTotalPrice(priceDiscount); // Cập nhật tổng giá
    };

    useEffect(() => {
        calculateTotalPrice(); // Tính toán tổng giá ngay lập tức
    }, [discount, slots])

    const handleServiceChange = (value: string[]) => {
        // Cập nhật danh sách dịch vụ đã chọn
        setSelectedServices(value);

        // Tạo một đối tượng mới để lưu số lượng slot
        const newSlots = {};
        value.forEach(serviceId => {
            newSlots[serviceId] = slots[serviceId] || 1; // Giữ số slot hiện tại hoặc mặc định là 1
        });
        setSlots(newSlots);
        calculateTotalPrice();
    };

    const handleSlotChangeService = (serviceId: string, value: number) => {
        setSlots({
            ...slots,
            [serviceId]: value,
        });
        calculateTotalPrice(); // Tính toán lại tổng giá khi số slot thay đổi
    };

    const handleSetDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const discountValue = Number(e.target.value);
        setDiscount(discountValue);
        calculateTotalPrice(); // Tính toán lại tổng giá khi giảm giá thay đổi
    };

    return (
        <Modal
            title={initialValues ? "Cập nhật gói dịch vụ" : "Tạo gói dịch vụ"}
            open={visible}
            onCancel={onCancel}
            onOk={handleOk}
            width={width}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    {initialValues ? "Cập nhật" : "Tạo mới"}
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Tên gói"
                    rules={[{ required: true, message: "Vui lòng nhập tên gói!" }]}
                >
                    <Input placeholder="Nhập tên gói" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                >
                    <Input.TextArea rows={3} placeholder="Nhập mô tả" />
                </Form.Item>

                <Form.Item
                    name="durationValue"
                    label="Giá trị thời gian"
                    rules={[{ required: true, message: "Vui lòng nhập giá trị thời gian!" }]}
                >
                    <InputNumber min={1} style={{ width: "100%" }} placeholder="Nhập giá trị thời gian" />
                </Form.Item>

                <Form.Item
                    name="durationType"
                    label="Loại thời gian"
                    rules={[{ required: true, message: "Vui lòng chọn loại thời gian!" }]}
                >
                    <Select placeholder="Chọn loại thời gian">
                        <Select.Option value="DAY">Ngày</Select.Option>
                        <Select.Option value="WEEK">Tuần</Select.Option>
                        <Select.Option value="MONTH">Tháng</Select.Option>
                    </Select>
                </Form.Item>

                {/* Chọn gói dịch vụ */}
                <Form.Item
                    name="packageService"
                    label="Chọn gói dịch vụ"
                    rules={[{ required: true, message: "Vui lòng chọn gói dịch vụ!" }]}
                >
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Chọn gói dịch vụ"
                        onChange={handleServiceChange}
                        options={services.map((item) => (
                            { value: item.id, label: item.name }
                        ))}
                    />
                </Form.Item>

                {/* Hiển thị trường nhập slot cho mỗi dịch vụ đã chọn */}
                {selectedServices.map(serviceId => (
                    <Form.Item key={serviceId} label={`Số slot cho ${services.find(s => s.id === serviceId)?.name}`}>
                        <InputNumber
                            min={1}
                            value={slots[serviceId] || 1}
                            onChange={(value) => handleSlotChangeService(serviceId, value)}
                            placeholder="Nhập số slot"
                        />
                    </Form.Item>
                ))}
                <Form.Item
                    name="discount"
                    label="Giảm giá (%)"
                    rules={[
                        {
                            validator: (_, value) => {
                                if (!value) {
                                    return Promise.reject(new Error('Vui lòng nhập phần trăm giảm giá!'));
                                }
                                const numValue = Number(value);
                                if (numValue < 1 || numValue > 100) {
                                    return Promise.reject(new Error('Giảm giá phải nằm trong khoảng từ 1 đến 100!'));
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <Input
                        type="number"
                        onChange={handleSetDiscount}
                        placeholder="Nhập phần trăm giảm giá"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <div>
                    <strong>Tổng giá: {formatMoney(totalPrice)}</strong>
                </div>

                {/* Hiển thị bảng dịch vụ đã chọn */}
                {oldServices.length > 0 && (
                    <Table
                        columns={[
                            {
                                title: "Tên gói",
                                render: (record: PackageService) => (
                                    <div>{record.service.name}</div>
                                )
                            },
                            {
                                title: "Giá",
                                render: (record: PackageService) => (
                                    <div>{formatMoney(record.service.price)}</div>
                                )
                            },
                            {
                                title: 'Số slot',
                                render: (record: PackageService) => (
                                    <InputNumber
                                        min={1}
                                        defaultValue={record.slot}
                                        onChange={(value) => handleSlotChangeService(record.service.id, value)}
                                    />
                                )
                            },
                            {
                                title: 'Hành động',
                                render: (record: PackageService) => (
                                    <div className="flex gap-2">
                                        {/* <EditOutlined onClick={() => handleOpenModalUpdateService(record)} className="text-blue" />
                                        <DeleteOutlined
                                            onClick={() => handleDeleteServicePromPackage(record.service.id)} className="text-red-500" /> */}
                                    </div>
                                )
                            },
                        ]}
                        dataSource={oldServices}
                        rowKey="serviceId" // Sử dụng serviceId làm key
                        pagination={false} // Tắt phân trang nếu không cần
                    />
                )}
            </Form>
        </Modal>
    );
};

export default ModalCreateUpdatePackage;