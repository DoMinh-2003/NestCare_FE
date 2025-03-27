import { useParams } from 'react-router-dom';
import useFetalService from '../../../services/useFetalService';
import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Form } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ModalCreateUpdateFetal from '../../../components/organisms/modal-create-update-fetal/ModalCreateUpdateFetal';
import { tableText } from '../../../constants/function';

import ModalCreateAppointment, { CreateAppointment } from '../../../components/organisms/modal-create-appointment/ModalCreateAppointment';
import ModalCheckUpRecord, { CheckupRecord } from '../../../components/organisms/modal-checkup-records/ModalCheckUpRecord';
import { Appointment } from '../manage-users';
import ModalAppointmentHistory from '../../../components/organisms/modal-appointment-history/ModalAppointmentHistory';
import ModalCreateFetalCheckupRecord from '../../../components/organisms/modal-create-checup-record/ModalCreateFetalCheckupRecord';

export interface FetalData {
    id?: string
    name: string;
    note: string;
    dateOfPregnancyStart: string; // ISO date string (YYYY-MM-DD)
    expectedDeliveryDate: string; // ISO date string (YYYY-MM-DD)
    actualDeliveryDate?: string
    healthStatus: string;
    status: "PREGNANT, BORN, MISSED, STILLBIRTH, ABORTED, MISCARRIAGE"
    motherId?: string; // UUID
}
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
    const { getFetalsByMotherId, createFetal, updateFetal, deleteFetal } = useFetalService();
    const [fetals, setFetals] = useState<FetalRecord[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenCheckUpRecords, setIsModalOpenCheckUpRecords] = useState(false);
    const [checkUpRecords, setCheckUpRecords] = useState<CheckupRecord[]>([]);
    const [currentFetal, setCurrentFetal] = useState<FetalData | null>(null);
    const [form] = Form.useForm()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleAppointmentHistory, setisModalVisibleAppointmentHistory] = useState(false);
    const [appointmentData, setAppointmentData] = useState<Appointment>()
    const [isModalCreateCheckup, setIsModalCreateCheckup] = useState(false);
    const [fetalId, setFetalId] = useState<string>('')

    const showModalCreateCheckup = (id: string) => {
        setFetalId(id);
        setIsModalCreateCheckup(true);
    };

    const handleCloseCreateCheckup = () => {
        setIsModalCreateCheckup(false);
    };

    const showModalAppointmentHistory = (appointmentData: Appointment) => {
        setisModalVisibleAppointmentHistory(true);
        setAppointmentData(appointmentData)
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setisModalVisibleAppointmentHistory(false);
    };
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
        await deleteFetal(fetalId);
        message.success("Fetal record deleted successfully");
        getFetalsByMotherIdFromNurse()
    };

    const handleAddOrUpdateFetal = async (values: FetalData) => {
        console.log("values: ", values)
        // Implement the logic to add or update fetal records
        // After adding or updating, refresh the fetal list
        const valuesSubmit = {
            ...values,
            motherId: id
        }
        if (currentFetal) {
            const response = await updateFetal(values, currentFetal.id + "")
            if (response) {
                console.log("res: ", response)
                setIsModalOpen(false); // Close the modal
            }
            message.success("Chỉnh sửa hồ sơ thai nhi thành công")
            setIsModalOpen(false); // Close the modal
            setCurrentFetal(null)
        } else {
            const response = await createFetal(valuesSubmit)
            if (response) {
                message.success("Tạo hồ sơ thai nhi thành công")
                setIsModalOpen(false); // Close the modal
            }
        }
        form.resetFields()
        getFetalsByMotherIdFromNurse();

    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: "Xem lịch sử đặt lịch",
            render: (record: Appointment) => (
                <div className="cursor-pointer text-blue" onClick={() => showModalAppointmentHistory(record)}>
                    Xem lịch sử
                </div>
            )
        },
        {
            title: 'Hồ sơ kiểm tra thai nhi',

            render: (record: Appointment) => (
                <div className='flex gap-2'>
                    <div className='Hồ sơ kiểm tra text-blue cursor-pointer' onClick={() => showModalCheckUpRecord(record.checkupRecords)}>
                        Hồ sơ kiểm tra thai
                    </div>
                    <div>
                        <PlusOutlined onClick={()=>showModalCreateCheckup(record.id)} className='text-yellow-500' />
                    </div>
                </div>
            )
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
            render: (record: FetalData) => (
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

    const showModalCheckUpRecord = (records: CheckupRecord[]) => {
        setCheckUpRecords(records)
        setIsModalOpenCheckUpRecords(true)
    }

    const handleCancelModalCheckUpRecord = () => {
        setIsModalOpenCheckUpRecords(false)
    }

    const handleCreateRespone = (values: CreateAppointment) => {
        if (values) {
            getFetalsByMotherIdFromNurse()
        }
    }
    const handleCancelCreateAppointment = () => {
        setIsModalVisible(false)
    }
    return (
        <div>
            <ModalCreateFetalCheckupRecord
            id={fetalId}
                isVisible={isModalCreateCheckup}
                onClose={handleCloseCreateCheckup}
            />
            <ModalAppointmentHistory
                isVisible={isModalVisibleAppointmentHistory}
                onClose={handleClose}
                appointmentData={appointmentData}
            />
            <ModalCreateAppointment fetals={fetals} createRespone={handleCreateRespone} isVisible={isModalVisible} onClose={handleCancelCreateAppointment} />
            <ModalCheckUpRecord records={checkUpRecords} handleCancelModalCheckUpRecord={handleCancelModalCheckUpRecord} isModalOpen={isModalOpenCheckUpRecords} />
            <div className='text-3xl font-semibold text-center'>
                Hồ sơ thai nhi của mẹ {fetals[0]?.mother?.fullName}
            </div>
            <Button
                type="primary"
                onClick={() => { setCurrentFetal(null); setIsModalOpen(true); }}
                style={{ marginBottom: 16 }}
            >
                Thêm hồ sơ
            </Button>
            <Button
                type="primary"
                className='ml-2'
                onClick={showModal}
                style={{ marginBottom: 16 }}
            >
                Đặt lịch
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
                form={form}
                fetal={currentFetal || null}
                isModalOpen={isModalOpen}
                handleCancel={() => setIsModalOpen(false)}
                onSubmit={handleAddOrUpdateFetal}
            />
        </div>
    );
};

export default FetalDetail;