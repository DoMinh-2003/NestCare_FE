import React, { useEffect, useState } from 'react';
import { Table, Button, message, Form } from 'antd';
import ModalCreateUpdateSlot, { Slot } from '../../../components/organisms/modal-create-update-slot/ModalCreateUpdateSlot';
import useSlotService from '../../../services/useSlotsService';
import { formatDate } from '../../../utils/formatDate';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ModalDelete from '../../../components/organisms/modal-delete';
const ManageSlot = () => {
    const [slots, setSlots] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
    const { getSlots, createslot, updateslot, deleteSlot } = useSlotService()
    const [form] = Form.useForm();
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    useEffect(() => {
        getSlotsFromAdmin()
    }, [])

    const getSlotsFromAdmin = async () => {
        const response = await getSlots()
        if (response) {
            setSlots(response.sort((a: Slot, b: Slot) => new Date(b.createdAt).getTime() - new Date(a.updatedAt).getTime()))
        }
    }

    const showModal = (slot?: Slot) => {
        setEditingSlot(slot || null);
        setIsModalVisible(true);
    };

    const handleCreate = async (newSlot: Slot) => {
        console.log("newSlot: ", newSlot)
        if (editingSlot) {
            const response = await updateslot(newSlot, editingSlot.id + "")
            console.log("response: ", response)
            if (response) {
                message.success('Cập nhật slot thành công')
                getSlotsFromAdmin()
                form.resetFields()
                setIsModalVisible(false);
                setEditingSlot(null);
            }
        } else {
            // Thêm slot mới   
            const valuesSubmit = {
                duration: newSlot.duration,
                startTime: newSlot.startTime,
                endTime: newSlot.endTime
            }
            const response = await createslot(valuesSubmit)
            if (response) {
                console.log("handleCreate: ", response)
                message.success('Tạo slot mới thành công')
                getSlotsFromAdmin()
                form.resetFields()
                setIsModalVisible(false);
                setEditingSlot(null);
            }
        }

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
                <div className='flex gap-2'>
                    <EditOutlined onClick={() => showModal(record)} className="text-blue" />
                    <DeleteOutlined onClick={() => handleOpenModalDelete(record)} className="text-red-500" />
                </div>
            ),
        },
    ];

    const handleOpenModalDelete = (slot: Slot) => {
        setSelectedSlot(slot);
        setIsModalDeleteOpen(true);
    };

    const handleCancelModalDelete = () => {
        setIsModalDeleteOpen(false);
    };

    const handleOkModalDelete = async () => {
        if (!selectedSlot) return; // Ensure selectedService is defined
        const response = await deleteSlot(selectedSlot.id+"");
        console.log("response: ", response)
        if (response) {
            message.success(`Xóa slot thành công`);
            setSelectedSlot(null);
            setIsModalDeleteOpen(false);
            getSlotsFromAdmin(); // Refresh the service list after deletion
        } else {
            message.error(`Xóa slot thất bại`);
        }
    };

    return (
        <div>
            <div className="text-3xl font-semibold text-center mb-5">
                Quản lí dịch vụ
            </div>
            <ModalDelete
                handleCancelModalDelete={handleCancelModalDelete}
                handleOkModalDelete={handleOkModalDelete}
                name={""}
                isModalOpenDelete={isModalDeleteOpen}
            />
            <Button type="primary" className='mb-5' onClick={() => showModal()}>
                Thêm Slot
            </Button>
            <Table dataSource={slots} columns={columns} rowKey="createdAt" />

            <ModalCreateUpdateSlot
                form={form}
                visible={isModalVisible}
                onCreate={handleCreate}
                onCancel={handleCancel}
                editingSlot={editingSlot || null}
            />
        </div>
    );
};

export default ManageSlot;