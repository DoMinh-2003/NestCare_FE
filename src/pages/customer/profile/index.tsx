import React, { useEffect, useState } from "react";
import { Avatar, Tabs, Input, Button, Typography, Divider, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("USER");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setPhone(parsedUser.phone || "");
            // Nếu sau này bạn có lưu address trong localStorage thì gán luôn
            setAddress(parsedUser.address || "");
        }
    }, []);

    const handleUpdate = () => {
        // Giả định cập nhật thông tin chỉ localStorage, thực tế bạn sẽ gọi API
        if (user) {
            const updatedUser = { ...user, phone, address };
            localStorage.setItem("USER", JSON.stringify(updatedUser));
            setUser(updatedUser);
            message.success("Cập nhật thông tin thành công!");
        }
    };

    if (!user) return <div>Đang tải...</div>;

    return (
        <div style={{ maxWidth: 600, margin: "auto", padding: 24 }}>
            <div style={{ textAlign: "center" }}>
                <Avatar
                    size={100}
                    src={user.image !== "string" ? user.image : undefined}
                    icon={<UserOutlined />}
                />
                <Title level={3} style={{ marginTop: 16 }}>{user.fullName}</Title>
            </div>

            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Thông tin cá nhân" key="1">
                    <Divider />
                    <Text strong>Email:</Text>
                    <Input value={user.email} disabled style={{ marginBottom: 16 }} />
                    <Text strong>Số điện thoại:</Text>
                    <Input
                        placeholder="Nhập số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ marginBottom: 16 }}
                    />
                    <Text strong>Địa chỉ:</Text>
                    <Input
                        placeholder="Nhập địa chỉ"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={{ marginBottom: 16 }}
                    />
                    <Button type="primary" onClick={handleUpdate}>Cập nhật</Button>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Đổi mật khẩu" key="2">
                    <Divider />
                    <Text strong>Mật khẩu hiện tại:</Text>
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Nhập mật khẩu hiện tại"
                        style={{ marginBottom: 16 }}
                    />
                    <Text strong>Mật khẩu mới:</Text>
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Nhập mật khẩu mới"
                        style={{ marginBottom: 16 }}
                    />
                    <Text strong>Xác nhận mật khẩu mới:</Text>
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Nhập lại mật khẩu mới"
                        style={{ marginBottom: 16 }}
                    />
                    <Button type="primary">Đổi mật khẩu</Button>
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default Profile;
