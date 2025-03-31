import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Table, Card, Skeleton, Row, Col, Typography } from "antd";
import {
    UserOutlined,
    ShoppingCartOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import useAppointmentService from "../../../services/useApoitment";
import userUserService from "../../../services/userUserService";
import useOrderService from "../../../services/useOrderService";

const { Title, Text } = Typography;

const NurseDashboard = () => {
    const { getAppointmentsByStatus } = useAppointmentService();
    const { getUserByRole } = userUserService();
    const { getOrderStatus } = useOrderService();

    const [appointments, setAppointments] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [userCount, setUserCount] = useState(null);
    const [orderCount, setOrderCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appointmentsResponse, usersResponse, ordersResponse] =
                    await Promise.all([
                        getAppointmentsByStatus("PENDING"),
                        getUserByRole("user"),
                        getOrderStatus("PAID"),
                    ]);

                setAppointments(appointmentsResponse);

                const groupedData = appointmentsResponse.reduce((acc, item) => {
                    const date = item.appointmentDate;
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {});

                const formattedChartData = Object.keys(groupedData).map((date) => ({
                    date,
                    count: groupedData[date],
                }));
                setChartData(formattedChartData);

                setUserCount(usersResponse?.length);
                setOrderCount(ordersResponse?.length);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const columns = [
        {
            title: "Ngày hẹn",
            dataIndex: "appointmentDate",
            key: "appointmentDate",
            align: "center",
        },
        {
            title: "Bác sĩ",
            dataIndex: ["doctor", "username"],
            key: "doctor",
            align: "center",
        },
        {
            title: "Thời gian",
            dataIndex: ["slot", "startTime"],
            key: "startTime",
            align: "center",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center",
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>📊 Tổng quan thống kê</Title>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={8}>
                    <Card
                        loading={loading}
                        bordered={false}
                        style={{ textAlign: "center", backgroundColor: "#f0f5ff" }}
                    >
                        <UserOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                        <Title level={4} style={{ marginTop: 8 }}>
                            Khách hàng
                        </Title>
                        <Text strong>{userCount ?? "-"}</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card
                        loading={loading}
                        bordered={false}
                        style={{ textAlign: "center", backgroundColor: "#fff7e6" }}
                    >
                        <ShoppingCartOutlined style={{ fontSize: 24, color: "#faad14" }} />
                        <Title level={4} style={{ marginTop: 8 }}>
                            Gói được mua
                        </Title>
                        <Text strong>{orderCount ?? "-"}</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8}>
                    <Card
                        loading={loading}
                        bordered={false}
                        style={{ textAlign: "center", backgroundColor: "#e6fffb" }}
                    >
                        <CalendarOutlined style={{ fontSize: 24, color: "#13c2c2" }} />
                        <Title level={4} style={{ marginTop: 8 }}>
                            Cuộc hẹn đang chờ
                        </Title>
                        <Text strong>{appointments?.length}</Text>
                    </Card>
                </Col>
            </Row>

            <Skeleton active loading={loading}>
                <Title level={4}>📅 Biểu đồ cuộc hẹn theo ngày</Title>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Số cuộc hẹn" />
                    </BarChart>
                </ResponsiveContainer>
            </Skeleton>

            <Skeleton active loading={loading} style={{ marginTop: 32 }}>
                <Title level={4}>📋 Danh sách cuộc hẹn đang chờ</Title>
                <Table
                    columns={columns}
                    dataSource={appointments}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />
            </Skeleton>
        </div>
    );
};

export default NurseDashboard;
