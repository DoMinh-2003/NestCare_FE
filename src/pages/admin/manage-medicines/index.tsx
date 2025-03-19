import React, { useEffect, useState } from 'react';
import { Table, Button, Form, message } from 'antd';
import ModalCreateUpdateMedicine, { Medicine } from '../../../components/organisms/modal-create-update-medicine/ModalCreateUpdateMedicine';
import useMedicineService from '../../../services/useMedicineService';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ModalDelete from '../../../components/organisms/modal-delete';

const AdminManageMedicines: React.FC = () => {

    const { getMedicinesService, createMedicine, updateMedicine, deleteMedicine } = useMedicineService()
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalDdelete, setIsModalDelete] = useState(false);
    const [currentMedicine, setCurrentMedicine] = useState<Medicine | null>(null);

    const [form] = Form.useForm()
    useEffect(() => {
        getMedicine();
    }, [])

    const getMedicine = async () => {
        const response = await getMedicinesService("", 0)
        console.log("response: ", response)
        if (response) {
            setMedicines(response.data.pageData)
        }
    }

    const showModal = (medicine?: Medicine) => {
        console.log("medicine: ", medicine)
        if (medicine) {
            setCurrentMedicine(medicine);
        }
        setIsModalVisible(true);
    };
    const showModalDelete = (medicine?: Medicine) => {
        if (medicine) {
            setCurrentMedicine(medicine)
        }
        setIsModalDelete(true);
    };
    const handleOk = async (values: Medicine) => {
        console.log("values: ", values)
        if (currentMedicine) {
            const response = await updateMedicine(values, currentMedicine.id + "")
            if (response) {
                message.success("Cập nhật thuốc thành công")
            }
        } else {
            const response = await createMedicine(values)
            if (response) {
                message.success("Thêm thuốc thành công")
            }
        }
        form.resetFields()
        getMedicine()
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'Tên thuốc',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Liều lượng',
            dataIndex: 'dosage',
            key: 'dosage',
        },
        {
            title: 'Giá (VNĐ)',
            dataIndex: 'price',
            key: 'price',
            render: (text: number) => text.toLocaleString(), // Định dạng giá
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text: any, record: Medicine) => (
                <div className='flex gap-2'>
                    <EditOutlined className='text-blue' onClick={() => showModal(record)} />
                    <DeleteOutlined onClick={() => showModal(record)} className='text-red-500' />
                </div>

            ),
        },
    ];  

    const handleOkDelete = async () => {
        await deleteMedicine(currentMedicine?.id + "")
        message.success('Xoá thuốc thành công!')
        setIsModalDelete(false)
        getMedicine()
    }

    const handleCancelModalDelete = async () => {
        setIsModalDelete(false)
    } 

    return (
        <div>
            <h1 className="text-3xl text-center font-bold mb-4">Quản Lý Thuốc</h1>
            <Button type="primary" onClick={() => showModal()}>
                Thêm Thuốc
            </Button>
            <Table dataSource={medicines} columns={columns} rowKey="id" className="mt-4" />
            <ModalDelete
                name={createMedicine.name}
                isModalOpenDelete={isModalDdelete}
                handleCancelModalDelete={handleCancelModalDelete}
                handleOkModalDelete={handleOkDelete}
            />
            <ModalCreateUpdateMedicine
                form={form}
                visible={isModalVisible}
                onCreate={handleOk}
                onCancel={handleCancel}
                currentMedicine={currentMedicine}
            />
        </div>
    );
};

export default AdminManageMedicines;