import { AppstoreOutlined, AreaChartOutlined, CalendarOutlined, HeartOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown } from 'antd';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { USER_ROUTES } from '../../../constants/routes';
import { Button } from "../../atoms/button/Button";
import MainLogo from "../../atoms/logo/MainLogo";
import NavbarMenuList from "../../molecules/nav-menu-list/NavBarMenuList";
import ModalBookingForm from "../modal-booking-form";

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userString = localStorage.getItem("USER");
        if (userString) {
            setUser(JSON.parse(userString));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("USER");
        navigate(USER_ROUTES.LOGIN);
    };

    const items: MenuProps['items'] = [
        {
            key: '10',
            label: (
                <p>Xem thông tin tài khoản</p>
            ),
            icon: <Avatar />
        },
        {
            key: '1',
            label: (
                <p>Các gói đã đăng ký</p>
            ),
            icon: <ShoppingCartOutlined />
        },
        {
            key: '2',
            label: (
                <p>Dịch vụ của bạn</p>
            ),
            icon: <AppstoreOutlined />
        },
        {
            key: '5',
            label: (
                <p>
                    Xem Lịch Khám
                </p>
            ),
            icon: <CalendarOutlined />,
        },
        {
            key: '6',
            label: (
                <p>
                    Biểu đồ phát triển
                </p>
            ),
            icon: <AreaChartOutlined />,
        },
        {
            key: '4',
            danger: true,
            label: 'Đăng xuất',
        },
    ];

    // Handle menu item clicks
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        switch (e.key) {
            case '1':
                // Navigate to a page for viewing purchased packages
                navigate(USER_ROUTES.PURCHASED_HISTORY);
                break;
            case '2':
                navigate(USER_ROUTES.MY_SERVICES);
                break;
            case '3':
                // Disabled item, no action
                break;
            case '4':
                // Logout action
                handleLogout();
                break;
            case '5':
                // Logout action
                navigate(USER_ROUTES.APPOINTMENT_HISTORY);
                break;
            case '6':
                navigate(USER_ROUTES.FETAL_CHART)
                break;
            case '10':
                navigate('/profile')
                break;
            default:
                break;
        }
    };

    return (
        <div className="mx-3">
            <ModalBookingForm isModalOpen={isModalOpen} handleCancel={() => setIsModalOpen(false)} />
            <div className="flex justify-between items-center font-bold">
                <div className="flex items-center">
                    <MainLogo />
                    <NavbarMenuList />
                </div>

                <div className='flex gap-6'>
                    {user ?
                        <Dropdown
                            menu={{ items, onClick: handleMenuClick }}
                            placement="bottom"
                            arrow={{ pointAtCenter: true }}>
                            <Avatar size={40} icon={<UserOutlined />} className='cursor-pointer' />
                        </Dropdown>
                        :
                        (
                            <Button
                                onClick={() => navigate("/auth/login")}
                                type="button"
                                status="pending"
                                styleClass="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                            >
                                Đăng nhập
                            </Button>)
                    }
                    <Button
                        onClick={() => navigate(USER_ROUTES.BOOKING_DOCTOR)}
                        type="button"
                        status="pending"
                        styleClass="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    >
                        Đặt lịch ngay
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default Navbar;
