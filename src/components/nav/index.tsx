import { useState } from "react";
import ModalBookingForm from "../modals/modal-booking-form";


const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const menuItems = [
        "Giới thiệu",
        "Chuyên khoa",
        "Dịch vụ",
        "Bác sĩ",
        "Tin tức",
        "Hướng dẫn",
        "Kiến thức",
        "Tuyển dụng",
        "Liên hệ",
    ];
    return (
        <div className='mx-3'>
            <ModalBookingForm isModalOpen={isModalOpen} handleCancel={handleCancel} />
            <div className='flex justify-between items-center font-bold'>
                <div className='flex items-center'>
                    <img className='mr-5' src="https://sihospital.com.vn/images/logo.png" alt="" />
                    <div className="flex space-x-5">
                        {menuItems.map((item, index) => (
                            <p key={index} className="cursor-pointer">
                                {item} {["Chuyên khoa", "Dịch vụ", "Hướng dẫn", "Kiến thức"].includes(item) && "▼"}
                            </p>
                        ))}
                    </div>
                </div>

                <div>
                    <button onClick={showModal} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                        Đặt lịch ngay </button>
                </div>
            </div>
        </div>
    )
};

export default Navbar;
