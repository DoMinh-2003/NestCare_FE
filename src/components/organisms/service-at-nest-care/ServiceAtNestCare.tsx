import { useState } from 'react'
import ModalBookingForm from '../modal-booking-form';
import Title from '../../atoms/text/Title';

const ServiceAtNestCare = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
        console.log("a")
    };

    return (
        <div>
            <ModalBookingForm isModalOpen={isModalOpen} handleCancel={() => setIsModalOpen(false)} />
            <div className="mt-14 grid grid-cols-12 gap-4">
                <div className="col-span-5">
                    <Title text='Dịch vụ tại NextCare' className='mt-20'/>
                    <p className="mt-10">Tại NestCare, chúng tôi cung cấp đa dạng các dịch vụ từ hỗ trợ sinh sản cho đến các dịch vụ chăm sóc mẹ và bé sau sinh, bao gồm: Phụ khoa; Khám thai; Hiếm muộn; Sanh; Chăm sóc mẹ & bé; Nhi – sơ sinh; Kế hoạch hóa gia đình, Cận lâm sàng.</p>
                    <div className="mt-10">
                        <button onClick={showModal} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                            Đặt lịch ngay
                        </button>
                        <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                            Tìm hiểu thêm
                        </button>
                    </div>
                </div>
                <div className="col-span-7">
                    <img src="https://sihospital.com.vn/images/dichvu.jpg" className="w-full" alt="" />
                </div>
            </div>
        </div>
    )
}

export default ServiceAtNestCare