import React, { useState } from 'react'
import ModalBookingForm from '../modal-booking-form';
import Title from '../../atoms/text/Title';

const OutStandingService = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div>
            <ModalBookingForm isModalOpen={isModalOpen} handleCancel={handleCancel} />
            {/* Dịch vụ nổi bật */}
            <div className="grid grid-cols-12 gap-10">
                <div className="col-span-7">
                    <img src="https://sihospital.com.vn/uploads/202406/24/WqAQbn-dichvunoibat-3.jpg" alt="" />
                </div>
                <div className="col-span-5">
                    <Title text='Dịch vụ nổi bật' className='mt-20'/>
                    <div className="mt-10">
                        Với hành trình 23 năm phát triển trong nghành sản – phụ khoa, NestCare tự hào là đơn vị tiên phong mang tiêu chuẩn dịch vụ bệnh viện Phụ sản Quốc tế đến Việt Nam. Khám phá các thế mạnh dịch vụ của NestCare tại đây.
                    </div>
                    <div className="mt-10">
                        <button onClick={showModal} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                            Đặt lịch ngay
                        </button>
                        <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                            Tìm hiểu thêm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OutStandingService