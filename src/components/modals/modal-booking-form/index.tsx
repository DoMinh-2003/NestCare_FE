import React from 'react';
import { Modal } from 'antd';
import BookingForm from '../../booking-form';

interface iModalBookingForm {
    isModalOpen: boolean;
    handleCancel: () => void;
}

const ModalBookingForm = ({ isModalOpen, handleCancel }: iModalBookingForm) => {
    return (
        <Modal
            footer=""
            closeIcon={<span style={{ fontSize: '14px' }}>×</span>} 
            width={800}
            open={isModalOpen}
            onCancel={handleCancel}
            style={{ width: "1200px", maxWidth: "100%" }}  // Đảm bảo không bị giới hạn width
            className="custom-modal"
        >
            <div className="text-5xl text-pink-700 font-bold text-center"> Đặt lịch ngay</div>
            <div className='text-center mt-5'>Bộ phận chăm sóc khách hàng sẽ liên hệ với quý khách để xác nhận lại cuộc hẹn</div>
            <BookingForm />
        </Modal>
    );
}

export default ModalBookingForm;
