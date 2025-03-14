import React, { useEffect, useState } from "react";
import userUserService from "../../../services/userUserService";
import { Button, message, Table, Form } from "antd";
import ModalCreateUpdateUser, { UserData } from "../../../components/organisms/modal-create-update-user/ModalCreateUpdateUser";
interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    phone: string;
    role: "user";
    isDeleted: boolean;
}

const NurseManageUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser , setCurrentUser ] = useState<User | null>(null);
    const { getUsers } = userUserService();
    const [visible, setVisible] = useState(false);
    const { createUser  } = userUserService();
    const [form] = Form.useForm(); // Create a form reference

    const showModal = (user: User | null = null) => {
        if (user) {
            setCurrentUser (user);
        } else {
            setCurrentUser (null); // Reset currentUser  when adding a new user
            form.resetFields(); // Reset form fields when opening modal
        }
        setVisible(true);
    };

    const handleCreateOrUpdate = async (values: UserData) => {
        console.log("handleCreateOrUpdate:", values);
        if (currentUser ) {
            // Update user logic can be added here
        } else {
            // Create new user
            const response = await createUser (values);
            if (response) {
                message.success("Tạo người dùng thành công");
                getUsersFromAdmin();
                setVisible(false); // Close the modal only after successful creation
                form.resetFields(); // Reset the form fields
            }
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };

    useEffect(() => {
        getUsersFromAdmin();
    }, []);

    const getUsersFromAdmin = async () => {
        const response = await getUsers();
        console.log("response: ", response);
        if (response) {
            setUsers(response.filter((item: User) => item.role === "user"));
        }
    };

    // Cấu hình cột cho bảng
    const columns = [
        {
            title: "Tên đầy đủ",
            dataIndex: "fullName",
            key: "fullName",
        },
        {
            title: "Tên đăng nhập",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Vai trò",
            dataIndex: "role",
            key: "role",
        },
    ];

    return (
        <div>
            <ModalCreateUpdateUser
                visible={visible}
                onCreate={handleCreateOrUpdate}
                onCancel={handleCancel}
                user={currentUser }
                form={form} // Pass the form reference to the modal
            />
            <Button onClick={() => showModal()} type="primary" style={{ marginBottom: 16 }}>
                Thêm người dùng
            </Button>

            <Table columns={columns} dataSource={users?.filter((user) => !user.isDeleted)} rowKey="id" />
        </div>
    );
};

export default NurseManageUsers;