import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import ModalCreateUpdateSlot, { Slot } from '../../../components/organisms/modal-create-update-slot/ModalCreateUpdateSlot';
import useSlotService from '../../../services/useSlotsService';
import { formatDate } from '../../../utils/formatDate';


const ManageSlot = () => {
    const [slots, setSlots] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
    const { getSlots } = useSlotService()

    useEffect(()=>{
        getSlotsFromAdmin()
    },[])

    const getSlotsFromAdmin = async () => {
        const response = await getSlots()
        if(response){
            setSlots(response)
        }
    }

    const showModal = (slot?: Slot) => {
        setEditingSlot(slot || null);
        setIsModalVisible(true);
    };

    const handleCreate = (newSlot: Slot) => {
        if (editingSlot) {

        } else {
            // Thêm slot mới

        }
        setIsModalVisible(false);
        setEditingSlot(null);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingSlot(null);
    };

    const columns = [
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'startTime',
            key: 'startTime',
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endTime',
            key: 'endTime',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => formatDate(text),
        },
        {
            title: 'Ngày chỉnh sửa',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text: string) => formatDate(text),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record: Slot) => (
                <Button onClick={() => showModal(record)}>Sửa</Button>
            ),
        },
    ];

    return (
        <div>
             <div className="text-3xl font-semibold text-center mb-5">
                Quản lí dịch vụ
            </div>
            <Button type="primary" className='mb-5' onClick={() => showModal()}>
                Thêm Slot
            </Button>
            <Table dataSource={slots} columns={columns} rowKey="createdAt" />

            <ModalCreateUpdateSlot
                visible={isModalVisible}
                onCreate={() => handleCreate}
                onCancel={handleCancel}
                editingSlot={editingSlot || null}
            />
        </div>
    );
};

export default ManageSlot;