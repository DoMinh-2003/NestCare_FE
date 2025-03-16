import { useState } from 'react'
import ModalBookingForm from '../modal-booking-form';
import Title from '../../atoms/text/Title';

const ServiceAtNestCare = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
        console.log("a");
    };

    return (
        <div className="py-8">
            <ModalBookingForm
                isModalOpen={isModalOpen}
                handleCancel={() => setIsModalOpen(false)}
            />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mt-14">
                {/* Left side: Content */}
                <div className="md:col-span-5 flex flex-col justify-center">
                    <Title text="Dịch vụ tại NextCare" className="mb-6" />
                    <p className="mb-6 text-gray-700 leading-relaxed">
                        Tại NestCare, chúng tôi cung cấp đa dạng các dịch vụ từ hỗ trợ sinh sản cho đến các dịch vụ chăm sóc mẹ và bé sau sinh, bao gồm: Phụ khoa; Khám thai; Hiếm muộn; Sanh; Chăm sóc mẹ & bé; Nhi – sơ sinh; Kế hoạch hóa gia đình, Cận lâm sàng.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={showModal}
                            type="button"
                            className="flex-1 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                            Đặt lịch ngay
                        </button>
                        <button
                            type="button"
                            className="flex-1 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                            Tìm hiểu thêm
                        </button>
                    </div>
                </div>
                {/* Right side: Image */}
                <div className="md:col-span-7 flex justify-center">
                    <img
                        src="https://sihospital.com.vn/images/dichvu.jpg"
                        className="w-full rounded-lg shadow-lg"
                        alt="Dịch vụ NestCare"
                    />
                </div>
            </div>
        </div>
    );
};

export default ServiceAtNestCare;
