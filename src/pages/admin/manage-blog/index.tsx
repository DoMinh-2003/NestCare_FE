import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Image, message, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import ModalCreateUpdateUser, { UserData } from "../../../components/organisms/modal-create-update-user/ModalCreateUpdateUser";
import ModalDelete from "../../../components/organisms/modal-delete";
import { tableText } from "../../../constants/function";
import userUserService from "../../../services/userUserService";
import type { GetProps } from 'antd';
import { Input } from 'antd';
import useBlogService from '../../../services/useBlogService';
import { formatDate } from '../../../utils/formatDate';
type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

const AdminManageBlogs: React.FC = () => {
    const [blogs, setBlogs] = useState<[]>([]);
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [visible, setVisible] = useState(false);
    const { createUser, updateUser, deleteUser, getUsers, getUsersSearch } = userUserService();
    const { getBlog, getBlogs } = useBlogService();
    const [form] = Form.useForm(); // Create a form reference
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [roleToFilter, setRoleToFilter] = useState<string>('')
    const showModal = (user: UserData | null = null) => {
        if (user) {
            setCurrentUser(user);
        } else {
            setCurrentUser(null); // Reset currentUser  when adding a new user
            form.resetFields(); // Reset form fields when opening modal
        }
        setVisible(true);
    };

    const handleCreateOrUpdate = async (values: UserData) => {
        console.log("handleCreateOrUpdate:", values);
        if (currentUser) {
            // Update user logic can be added here
            const response = await updateUser(values);
            if (response) {
                message.success("Cập nhật dùng thành công");
                getBlogsFromAdmin();
                setVisible(false); // Close the modal only after successful creation
                form.resetFields(); // Reset the form fields
            }
        } else {
            // Create new user
            const response = await createUser(values);
            if (response) {
                message.success("Tạo người dùng thành công");
                getBlogsFromAdmin();
                setVisible(false); // Close the modal only after successful creation
                form.resetFields(); // Reset the form fields
            }
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };

    useEffect(() => {
        getBlogsFromAdmin();
    }, []);

    const getBlogsFromAdmin = async () => {
        const response = await getBlogs({
            categoryId: "",
            isPublished: 1,
            pageNum: 1,
            pageSize: 10
        });
        console.log("response: ", response);
        if (response) {
            setBlogs(response.data.pageData);
        }
    };

    const handleOpenModalDelete = (record: UserData) => {
        console.log("record: ", record)
        setCurrentUser(record);
        setIsModalDeleteOpen(true);
    };
    // Cấu hình cột cho bảng
    const columns = [
        {
            title: "Tiêu đề",
            render: (record) => (

                <p>{record.title}</p>
            )
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text: string) => formatDate(text)
        },
        {
            title: "Ngày sửa",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (text: string) => formatDate(text)
        },

        {
            title: 'Hành động',
            render: (record: UserData) => {
                return <div className="flex gap-2 text-xl">
                    <EditOutlined onClick={() => showModal(record)} className="text-blue" />
                    <DeleteOutlined onClick={() => handleOpenModalDelete(record)} className="text-red-500" />
                </div>
            }
        },
    ];

    const handleCancelModalDelete = () => {
        setIsModalDeleteOpen(false);
    };

    const handleOkModalDelete = async () => {
        console.log("currentUser: ", currentUser)
        if (!currentUser) return; // Ensure selectedService is defined
        await deleteUser(currentUser.id);
        message.success(`Xóa dịch vụ ${currentUser.fullName} thành công`);
        setCurrentUser(null);
        setIsModalDeleteOpen(false);
        getBlogsFromAdmin(); // Refresh the service list after deletion
    };

    const onSearch: SearchProps['onSearch'] = async (value, _e, info) => {
        const response = await getUsersSearch(value, roleToFilter);
        console.log("response: ", response);
        if (response) {
            setBlogs(response.data.pageData);
        }
    }

    return (
        <div>
            <div className='text-3xl font-semibold text-center mb-5'>
                Quản lý bài blog
            </div>
            <div className='flex gap-2 justify-between px-2'>
                <div className='gap-2 flex'>
                    <Search placeholder="Tìm kiếm bằng tên" className='w-[200px]' onSearch={onSearch} enterButton />


                </div>
                <div>
                    <Button onClick={() => showModal()} type="primary" style={{ marginBottom: 16 }}>
                        Thêm bài blog
                    </Button>
                </div>
            </div>
            <ModalDelete
                handleCancelModalDelete={handleCancelModalDelete}
                handleOkModalDelete={handleOkModalDelete}
                name={currentUser?.fullName || ""}
                isModalOpenDelete={isModalDeleteOpen}
            />
            <ModalCreateUpdateUser
                visible={visible}
                onCreate={handleCreateOrUpdate}
                onCancel={handleCancel}
                user={currentUser}
                form={form} // Pass the form reference to the modal
            />



            <Table rowClassName={() => tableText()} columns={columns} dataSource={blogs} rowKey="id" />
        </div>
    );
};

export default AdminManageBlogs;