import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import userUserService from "../../../services/userUserService";

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  isDeleted: boolean;
}


const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>();
  const {getUsers} = userUserService()
  
  useEffect(()=>{
    getUsersFromAdmin()
  }, [])
 
  const getUsersFromAdmin = async ()=>{
    const response = await getUsers()
    console.log("response: ", response)
    if(response){
     
      setUsers(response);
    }
  }
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
      <Button type="primary" style={{ marginBottom: 16 }}>
        Thêm người dùng
      </Button>

      <Table columns={columns} dataSource={users?.filter((user) => !user.isDeleted)} rowKey="id" />

      {/* Modal thêm user */}
    </div>
  );
};

export default ManageUsers;
