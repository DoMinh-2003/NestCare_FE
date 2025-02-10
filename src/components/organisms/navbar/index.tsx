import MainLogo from "../../atoms/logo/MainLogo";
import NavbarMenuList from "../../molecules/nav-menu-list/NavBarMenuList";
import { Button } from "../../atoms/button/Button";
import ModalBookingForm from "../modal-booking-form";
import { useState } from "react";

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
        console.log("a")
    };
    return (
        <div className="mx-3">
            <ModalBookingForm isModalOpen={isModalOpen} handleCancel={() => setIsModalOpen(false)} />
            <div className="flex justify-between items-center font-bold">
                <div className="flex items-center">
                    <MainLogo />
                    <NavbarMenuList />
                </div>
                <Button
                    onClick={showModal}
                    type="button"
                    status="pending"
                    styleClass="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                    Đặt lịch ngay
                </Button>

            </div>
        </div>
    );
};

export default Navbar;
