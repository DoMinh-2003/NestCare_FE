import React from "react";
import { Avatar, Tabs, Input, Button, Typography, Divider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Profile = () => {
    return (
        <div style={{ maxWidth: 600, margin: "auto", padding: 24 }}>
            <div style={{ textAlign: "center" }}>
                <Avatar size={100} icon={<UserOutlined />} />
                <Title level={3} style={{ marginTop: 16 }}>Nguyễn Văn A</Title>
            </div>

            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Thông tin cá nhân" key="1">
                    <Divider />
                    <Text strong>Email:</Text>
                    <Input value="nguyenvana@example.com" disabled style={{ marginBottom: 16 }} />
                    <Text strong>Số điện thoại:</Text>
                    <Input placeholder="Nhập số điện thoại" style={{ marginBottom: 16 }} />
                    <Text strong>Địa chỉ:</Text>
                    <Input placeholder="Nhập địa chỉ" style={{ marginBottom: 16 }} />
                    <Button type="primary">Cập nhật</Button>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Đổi mật khẩu" key="2">
                    <Divider />
                    <Text strong>Mật khẩu hiện tại:</Text>
                    <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu hiện tại" style={{ marginBottom: 16 }} />
                    <Text strong>Mật khẩu mới:</Text>
                    <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" style={{ marginBottom: 16 }} />
                    <Text strong>Xác nhận mật khẩu mới:</Text>
                    <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu mới" style={{ marginBottom: 16 }} />
                    <Button type="primary">Đổi mật khẩu</Button>
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default Profile;