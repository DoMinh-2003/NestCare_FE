import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import ModalCreateUpdateWeekCheckup from '../../../components/organisms/modal-create-update-week-checkup/ModalCreateUpdateWeekCheckup';
import useWeekCheckupService from '../../../services/useWeekCheckup';
import { tableText } from '../../../constants/function';
import ModalServicesOfWeekCheckup from '../../../components/organisms/modal-services-of-week-checkup/ModalServicesOfWeekCheckup';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ModalDelete from '../../../components/organisms/modal-delete';

interface CheckupData {
    week: number;
    title: string;
    description: string;
    serviceIds: string[];
    id?: string
}
interface Service {
    id: string; // ID của dịch vụ
    name: string; // Tên dịch vụ
    description: string; // Mô tả dịch vụ
    price: string; // Giá dịch vụ
    createdAt: string; // Ngày tạo dịch vụ
    updatedAt: string; // Ngày cập nhật dịch vụ
    isDeleted: boolean; // Trạng thái xóa dịch vụ
}

interface Checkup {
    id: string; // ID của lịch khám
    week: number; // Tuần khám
    title: string; // Tiêu đề lịch khám
    description: string; // Mô tả lịch khám
    services: Service[]; // Danh sách dịch vụ liên quan đến lịch khám
}
const WeekCheckup: React.FC = () => {
    const [checkups, setCheckups] = useState<CheckupData[] | null>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentCheckup, setCurrentCheckup] = useState<CheckupData | null>(null);
    const [currentServices, setCurentServices] = useState<Service[]>([]);
    const { getWeekCheckup, createWeekCheckup, updateWeekCheckup, deleteWeekCheckup } = useWeekCheckupService()
    const [isServiceModalVisible, setIsServiceModalVisible] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    useEffect(() => {
        getWeekCheckupFromAdmin();
    }, [])

    const showModalSerivesOfCheckup = (services: Service[]) => {
        console.log("showModalSerivesOfCheckup: ", services)
        setCurentServices(services);
        setIsServiceModalVisible(true);
    };

    const getWeekCheckupFromAdmin = async () => {
        const response = await getWeekCheckup()
        console.log("getWeekCheckupFromAdmin: ", response)
        if (response) {
            setCheckups(response)
        }
    }
    const showModal = (checkup?: CheckupData) => {
        setCurrentCheckup(checkup || null);
        setIsModalVisible(true);
    };

    const handleCreateOrUpdate = async (values: CheckupData) => {
        if (currentCheckup) {
            const response = await updateWeekCheckup(values, currentCheckup.id + "")
            if (response) {
                message.success('Câp nhật lịch khám thành công!');
                getWeekCheckupFromAdmin()
            }
        } else {
            // Thêm lịch khám mới
            const response = await createWeekCheckup(values)
            if (response) {
                message.success('Thêm lịch khám thành công!');
                getWeekCheckupFromAdmin()
            }
        }
        setIsModalVisible(false);
        setCurrentCheckup(null);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrentCheckup(null);
    };

    const columns = [
        {
            title: 'Tuần',
            dataIndex: 'week',
            key: 'week',
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Dịch vụ',
            render: (text: any, record: Checkup) => (
                <div className='text-blue cursor-pointer' onClick={() => showModalSerivesOfCheckup(record.services)}>
                    Xem dịch vụ
                </div>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text: any, record: CheckupData) => (
                <div className='flex gap-2'>
                    <EditOutlined onClick={() => showModal(record)} className="text-blue" />
                    <DeleteOutlined onClick={() => showModalDelete(record)} className="text-red-500" />
                </div>
            ),
        },
    ];
    const showModalDelete = (record: CheckupData) => {
        setIsModalOpenDelete(true);
        setCurrentCheckup(record);
    }
    const handleOkDelete = async () => {
        await deleteWeekCheckup(currentCheckup?.id + "")
        message.success("Xoá lịch khám thành công")
        setIsModalOpenDelete(false)
        getWeekCheckupFromAdmin()
        setCheckups(null)
    }
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
        setCheckups(null)
    }

    return (
        <div>
            <div className='text-center font-bold text-3xl'>Quản lý lịch khám</div>
            <Button type="primary" className='mb-2' onClick={() => showModal()}>Thêm lịch khám</Button>
            <Table rowClassName={() => tableText()} dataSource={checkups} columns={columns} rowKey="week" />
            <ModalServicesOfWeekCheckup
                visible={isServiceModalVisible}
                onCancel={() => setIsServiceModalVisible(false)}
                services={currentServices}
            />
            <ModalCreateUpdateWeekCheckup
                visible={isModalVisible}
                onCreate={handleCreateOrUpdate}
                onCancel={handleCancel}
                currentCheckup={currentCheckup}
            />
            <ModalDelete
                name={createWeekCheckup.name}
                isModalOpenDelete={isModalOpenDelete}
                handleOkModalDelete={handleOkDelete}
                handleCancelModalDelete={handleCancelDelete}
            />
        </div>
    );
};

export default WeekCheckup;