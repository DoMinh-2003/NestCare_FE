import { Modal, Form, Input, DatePicker, Button, message, Select } from 'antd';
import userAppointmentService from '../../../services/useAppointmentService';
import { FetalRecord } from '../modal-create-update-fetal/ModalCreateUpdateFetal';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import { Slot } from '../modal-create-update-slot/ModalCreateUpdateSlot';
import useSlotService from '../../../services/useSlotsService';
import userUserService from '../../../services/userUserService';
import { User } from '../../../model/User';
import { formatDateSubmitData } from '../../../utils/formatDate';

export interface CreateAppointment {
    fetalRecordIds: string[],
    doctorId: string,
    date: string,
    slotId: string
}

const ModalCreateAppointment = ({ isVisible, onClose, createRespone, fetals }: { isVisible: boolean, onClose: any, createRespone: any, fetals: FetalRecord[] }) => {
    const [form] = Form.useForm();
    const { createAppointment } = userAppointmentService();
    const [selectedDate, setSelectedDate] = useState<string>();
    const [slots, setSlots] = useState<Slot[]>([]);
    const { getSlots } = useSlotService();
    const { getAvailableDoctor } = userUserService();
    const [selectedSlot, setSelectedSlot] = useState<string>('');
    const [doctors, setDoctors] = useState<User[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>(undefined);
    const [selectedFetalRecordIds, setSelectedFetalRecordIds] = useState([]);

    useEffect(() => {
        getSlotsFromNurse();
    }, []);

    useEffect(() => {
        getAvailableDoctorFromNurse();
    }, [selectedDate, selectedSlot]);

    const getSlotsFromNurse = async () => {
        const response = await getSlots();
        if (response) {
            setSlots(response);
        }
    };

    const getAvailableDoctorFromNurse = async () => {
        if (selectedSlot) {
            const response = await getAvailableDoctor(selectedDate, selectedSlot);
            if (response) {
                setDoctors(response);
            }
        }
    };

    const handleSubmit = async (values: CreateAppointment) => {
        const appointmentData = {
            fetalRecordIds: selectedFetalRecordIds.map(id => ({ fetalRecordId: id })), // Format fetalRecordIds, // Ensure this matches the expected structure
            doctorId: values.doctorId,
            date: moment(selectedDate+'').format('YYYY-MM-DD'),
            slotId: values.slotId
        };
        console.log("appointmentData: ", appointmentData)
        const response = await createAppointment(appointmentData);
        console.log("response: ", response)
        if (response) {
            createRespone(values);
            message.success('Tạo lịch hẹn thành công');
            onClose(); // Close the modal after submission
        }
    };

    const disablePastDates = (current: Moment) => {
        return current && current < moment().startOf('day'); // Disable all past dates
    };

    const handleChangeSelectedSlot = (value: string) => {
        setSelectedSlot(value);
    };

    const handleChangeSelectedDate = (value: Moment) => {
        setSelectedDate(value.format('YYYY-MM-DD'));
    };

    const handleChangeSelectedDoctor = (value: string) => {
        setSelectedDoctor(value);
    };

    return (
        <Modal
            title="Create Appointment"
            visible={isVisible}
            onCancel={onClose}
            footer={null}
            className="rounded-lg"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Chọn ngày"
                    name="date"
                    rules={[{ required: true, message: 'Please select the appointment date!' }]}
                >
                    <DatePicker
                        format="YYYY-MM-DD"
                        disabledDate={disablePastDates} // Disable past dates
                        onChange={handleChangeSelectedDate} // Update selected date
                    />
                </Form.Item>

                <Form.Item
                    label="Chọn slot"
                    name="slotId"
                    rules={[{ required: true, message: 'Please select a slot!' }]}
                    >
                        <Select
                            onChange={handleChangeSelectedSlot}
                            placeholder="Chọn slot"
                            className='w-[150px]'
                            options={
                                slots?.map((item) => ({
                                    value: item.id,
                                    label: `${item.startTime} - ${item.endTime}`
                                }))
                            }
                        />
                    </Form.Item>
    
                    <Form.Item
                        label="Chọn bác sĩ"
                        name="doctorId"
                        rules={[{ required: true, message: 'Please select a doctor!' }]}
                    >
                        <Select
                            onChange={handleChangeSelectedDoctor}
                            placeholder="Chọn bác sĩ"
                            className='w-[150px]'
                            options={
                                doctors?.map((item) => ({
                                    value: item.id,
                                    label: item.fullName
                                }))
                            }
                        />
                    </Form.Item>
    
                    <Form.Item
                        label="Chọn thai nhi"
                        name="fetalRecordId"
                        rules={[{ required: true, message: 'Please select a fetal record!' }]}
                    >
                        <Select
                            placeholder="Chọn thai nhi"
                            mode='multiple'
                            className='w-[150px]'
                            onChange={setSelectedFetalRecordIds}
                            options={
                                fetals?.map((item) => ({
                                    value: item.id,
                                    label: item.name
                                }))
                            }
                        />
                    </Form.Item>
    
                    <Form.Item>
                        <div className="flex justify-end">
                        <Button  onClick={onClose} className="bg-red-500 text-white mr-2">
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" >
                                Create Appointment
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };
    
    export default ModalCreateAppointment;