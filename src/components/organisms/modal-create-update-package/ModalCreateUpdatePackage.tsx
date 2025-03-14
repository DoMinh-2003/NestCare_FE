import { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Button, Select, Table } from "antd";
import useServiceService, { Service } from "../../../services/useServiceService";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Package, PackageService } from "../../../services/usePackageService";

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


const ModalCreateUpdatePackage = ({ visible, onCancel, onSubmit, initialValues }: {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: PackageCreateUpdate) => void;
    initialValues?: Package | null
}) => {
    const [form] = Form.useForm();
    const { getServices } = useServiceService();
    const [services, setServices] = useState<Service[]>([]);
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
                packageService: values.packageService.map((serviceId: string) => ({
                    serviceId,
                    slot: 5, // Giá trị mặc định cho slot
                })),
            };
            form.resetFields()
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
            title: 'Action',
            render: (record: PackageService) => (
                <div className="flex gap-2">
                    <DeleteOutlined onClick={() => handleDeleteServicePromPackage(record.service.id)} className="text-red-500" />
                </div>
            )
        },
    ];

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
                    name="price"
                    label="Giá"
                    rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} placeholder="Nhập giá" />
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