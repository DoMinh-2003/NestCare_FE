import { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Button, Select, Table } from "antd";
import useServiceService, { Service } from "../../../services/useServiceService";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Package, PackageService } from "../../../services/usePackageService";
import { formatMoney } from "../../../utils/formatMoney";

export interface PackageServiceCreateUpdate {
    serviceId: string;
    slot: 5;
}

export interface PackageCreateUpdate {
    name: string;
    description: string;
    price: number;
    packageServices: PackageServiceCreateUpdate[];
    id?: string;
}


const ModalCreateUpdatePackage = ({ visible, onCancel, onSubmit, initialValues, width }: {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: PackageCreateUpdate) => void;
    initialValues?: Package | null
    width?: number | string;
}) => {
    const [form] = Form.useForm();
    const { getServices } = useServiceService();
    const [services, setServices] = useState<Service[]>([]);
    const [discountedPrice, setDiscountedPrice] = useState<number>(initialValues?.price || 0);

    const [oldServices, setOldServices] = useState<PackageService[]>([]);
    useEffect(() => {
        getServicesFromCustomer();
        if (initialValues) {
            console.log("initialValues: ", initialValues)
            form.setFieldsValue(initialValues);
            setOldServices(initialValues?.packageServices)
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    useEffect(() => {
        getServicesFromCustomer();
    }, []);

    const handleDiscountChange = (value: number | null) => {
        const originalPrice = initialValues?.price || 0;
        const discount = value || 0;
        const calculatedPrice = originalPrice - (originalPrice * discount) / 100;
        setDiscountedPrice(calculatedPrice);
    };


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

            const originalPrice = initialValues?.price || 0; // Giá gốc
            const discount = values.discount || 0; // Phần trăm giảm giá

            const calculatedPrice = originalPrice - (originalPrice * discount) / 100; // Giá sau giảm

            const formattedValues = {
                ...values,
                price: calculatedPrice, // Gửi đi giá đã tính toán lại
                packageService: values.packageService.map((serviceId: string) => ({
                    serviceId,
                    slot: 5, // Giá trị mặc định cho slot
                })),
            };

            form.resetFields();
            onSubmit(formattedValues);
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };


    const columns = [
        {
            title: "Tên gói",
            render: (record: PackageService) => (
                <div>
                    {record.service.name}
                </div>
            )
        },
        {
            title: "Giá",
            render: (record: PackageService) => (
                <div>
                    {formatMoney(record.service.price)}
                </div>
            )
        },
        {
            title: 'Hành động',
            render: (record: PackageService) => (
                <div className="flex gap-2">
                    <EditOutlined onClick={() => handleOpenModalUpdateService(record)} className="text-blue" />
                    <DeleteOutlined onClick={() => handleDeleteServicePromPackage(record.service.id)} className="text-red-500" />
                </div>
            )
        },
    ];

    const handleOpenModalUpdateService = (record: PackageService) => {

    }

    const handleDeleteServicePromPackage = (id: string) => {
        console.log("id: ", id)
        console.log("oldServices: ", oldServices)
        setOldServices(oldServices.filter(item => item.service.id != id))
    }

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


                {/* create */}
                {
                    !initialValues && <Form.Item
                        name="packageService"
                        label="Chọn gói dịch vụ"
                        rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                    >
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Chọn gói dịch vụ"
                            options={
                                services.map((item) => (
                                    { value: item.id, label: item.name }
                                ))
                            }
                        />
                    </Form.Item>
                }
                {/* update */}
                <div>
                    <div>
                        {
                            initialValues && <Form.Item
                                name="packageService"
                                label="Chọn gói dịch vụ"
                                rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                            >
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Chọn gói dịch vụ"
                                    options={
                                        services.map((item) => (
                                            { value: item.id, label: item.name }
                                        ))
                                    }
                                />
                            </Form.Item>
                        }
                        <Form.Item
                            name="discount"
                            label="Giảm giá (%)"
                            rules={[{ required: true, message: "Vui lòng nhập giảm giá!" }]}
                        >
                            <InputNumber min={0} max={100} style={{ width: "100%" }} placeholder="Nhập % giảm giá" onChange={handleDiscountChange} />
                        </Form.Item>
                        <div>
                            Tổng giá gói dịch vụ: {formatMoney(discountedPrice)}
                        </div>
                        {
                            initialValues && <Table columns={columns} dataSource={oldServices} rowKey="id" />
                        }
                    </div>
                </div>
            </Form>

        </Modal>
    );
};

export default ModalCreateUpdatePackage;