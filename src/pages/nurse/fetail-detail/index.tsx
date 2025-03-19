import { useParams } from 'react-router-dom';
import useFetalService from '../../../services/useFetalService';
import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ModalCreateUpdateFetal from '../../../components/organisms/modal-create-update-fetal/ModalCreateUpdateFetal';
import { tableText } from '../../../constants/function';

export interface FetalRecord {
    id: string;
    name: string;
    note: string;
    dateOfPregnancyStart: string;
    expectedDeliveryDate: string;
    actualDeliveryDate: string | null;
    healthStatus: string;
    status: "PREGNANT" | "DELIVERED";
    isDeleted: number;
    createdAt: string;
    updatedAt: string;
    checkupRecords: any[];
    appointments: any[];
}

const FetalDetail = () => {
    const { id } = useParams();
    const { getFetalsByMotherId } = useFetalService();
    const [fetals, setFetals] = useState<FetalRecord[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFetal, setCurrentFetal] = useState<FetalRecord | null>(null);

    useEffect(() => {
        if (id) {
            getFetalsByMotherIdFromNurse();
        }
    }, [id]);

    const getFetalsByMotherIdFromNurse = async () => {
        const response = await getFetalsByMotherId(id);
        setFetals(response);
    };

    const handleDelete = async (fetalId: string) => {
        // const response = await deleteFetalRecord(fetalId);
        // if (response) {
        //     message.success("Fetal record deleted successfully");
        //     setFetals(fetals.filter(fetal => fetal.id !== fetalId)); // Update the state
        // } else {
        //     message.error("Failed to delete fetal record");
        // }
    };

    const handleAddOrUpdateFetal = async (values: FetalRecord) => {
        // Implement the logic to add or update fetal records
        // After adding or updating, refresh the fetal list
        getFetalsByMotherIdFromNurse();
        setIsModalOpen(false); // Close the modal
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Health Status',
            dataIndex: 'healthStatus',
            key: 'healthStatus',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: FetalRecord) => (
                <>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => { setCurrentFetal(record); setIsModalOpen(true); }}
                    />
                    <Popconfirm
                        title="Are you sure to delete this fetal record?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div>
            <div className='text-3xl font-semibold text-center'>
                Hồ sơ thai nhi
            </div>
            <Button
                type="primary"
                onClick={() => { setCurrentFetal(null); setIsModalOpen(true); }}
                style={{ marginBottom: 16 }}
            >
                Thêm hồ sơ
            </Button>
            <Table
                components={{
                    header: {
                        cell: (props) => (
                            <th {...props} style={{ fontSize: "18px", fontWeight: "bold" }} />
                        ),
                    },
                }}
                rowClassName={() => tableText()}
                dataSource={fetals}
                columns={columns}
                rowKey="id" // Assuming 'id' is the unique identifier for each fetal record
            />
            <ModalCreateUpdateFetal
                fetal={currentFetal}
                isModalOpen={isModalOpen}
                handleCancel={() => setIsModalOpen(false)}
                onSubmit={handleAddOrUpdateFetal}
            />
        </div>
    );
};

export default FetalDetail;