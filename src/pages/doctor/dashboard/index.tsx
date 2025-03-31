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
    CalendarOutlined,
} from "@ant-design/icons";
import useAppointmentService from "../../../services/useAppointmentService";
import userUserService from "../../../services/userUserService";
import { formatDate } from "../../../utils/formatDate";

const { Title, Text } = Typography;

const DoctorDashboard = () => {
    const { getAppointmentsByDoctorDate } = useAppointmentService();
    const { getUserByRole } = userUserService();

    const [appointments, setAppointments] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [patientCount, setPatientCount] = useState(null);
    const [pendingAppointments, setPendingAppointments] = useState(0);
    const [completedAppointments, setCompletedAppointments] = useState(0);
    const [fetalCount, setFetalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const translateStatus = (status) => {
        const statusMap = {
            AWAITING_DEPOSIT: "Chờ đặt cọc",
            PENDING: "Đang chờ",
            CONFIRMED: "Đã xác nhận",
            CHECKED_IN: "Đã đến",
            IN_PROGRESS: "Đang tiến hành",
            COMPLETED: "Hoàn thành",
            CANCELED: "Đã hủy",
            FAIL: "Thất bại",
        };
        return statusMap[status] || "Không xác định";
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const storedUser = localStorage.getItem("USER");
                if (!storedUser) {
                    throw new Error("Không tìm thấy thông tin bác sĩ.");
                }

                const user = JSON.parse(storedUser);
                const doctorId = user.id;
                const today = new Date().toISOString().split("T")[0];

                // Gọi API đồng thời
                const [appointmentsResponse, patientsResponse] = await Promise.all([
                    getAppointmentsByDoctorDate(doctorId, today, "", ""),
                    getUserByRole("user"),
                ]);

                setAppointments(appointmentsResponse);
                setPatientCount(patientsResponse.length);

                // Lọc cuộc hẹn đang chờ và đã hoàn thành
                const pendingCount = appointmentsResponse.filter(appt => appt.status === "PENDING").length;
                const completedCount = appointmentsResponse.filter(appt => appt.status === "COMPLETED").length;
                setPendingAppointments(pendingCount);
                setCompletedAppointments(completedCount);

                // Tính tổng số thai nhi
                const totalFetals = appointmentsResponse.reduce(
                    (sum, appt) => sum + (appt.fetalRecords?.length || 0),
                    0
                );
                setFetalCount(totalFetals);

                // Xử lý dữ liệu biểu đồ theo trạng thái
                // Xử lý dữ liệu biểu đồ theo trạng thái
                const statusCounts = appointmentsResponse.reduce((acc, appt) => {
                    // Nếu appt.status nằm trong các status không mong muốn, bỏ qua
                    if (["AWAITING_DEPOSIT", "FAIL"].includes(appt.status)) {
                        return acc;
                    }

                    acc[appt.status] = (acc[appt.status] || 0) + 1;
                    return acc;
                }, {});


                const formattedChartData = Object.keys(statusCounts).map((status) => ({
                    status,
                    count: statusCounts[status],
                }));
                setChartData(formattedChartData);

            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
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
            title: "Bệnh nhân",
            dataIndex: ["fetalRecords", "0", "mother", "fullName"],
            key: "motherName",
            align: "center",
            render: (text, record) => record.fetalRecords?.[0]?.mother?.fullName || "N/A",
        },
        {
            title: "Thời gian bắt đầu",
            dataIndex: ["slot", "startTime"],
            key: "startTime",
            align: "center",
        },
        {
            title: "Thời gian kết thúc",
            dataIndex: ["slot", "endTime"],
            key: "endTime",
            align: "center",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (status) => translateStatus(status),
        },
        {
            title: "Tên thai nhi",
            key: "fetalName",
            align: "center",
            render: (record) => record.fetalRecords?.[0]?.name || "Không có",
        },
        {
            title: "Tình trạng thai nhi",
            key: "fetalHealth",
            align: "center",
            render: (record) => record.fetalRecords?.[0]?.healthStatus || "Không có",
        },
        {
            title: "Ngày dự sinh",
            key: "expectedDeliveryDate",
            align: "center",
            render: (record) => formatDate(record.fetalRecords?.[0]?.expectedDeliveryDate) || "Không có",
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>📊 Thống kê bác sĩ</Title>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        loading={loading}
                        bordered={false}
                        style={{ textAlign: "center", backgroundColor: "#fff7e6" }}
                    >
                        <CalendarOutlined style={{ fontSize: 24, color: "#faad14" }} />
                        <Title level={4} style={{ marginTop: 8 }}>
                            Cuộc hẹn hôm nay
                        </Title>
                        <Text strong>{appointments.length}</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        loading={loading}
                        bordered={false}
                        style={{ textAlign: "center", backgroundColor: "#e6fffb" }}
                    >
                        <CalendarOutlined style={{ fontSize: 24, color: "#13c2c2" }} />
                        <Title level={4} style={{ marginTop: 8 }}>
                            Cuộc hẹn đang chờ
                        </Title>
                        <Text strong>{pendingAppointments}</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        loading={loading}
                        bordered={false}
                        style={{ textAlign: "center", backgroundColor: "#f9f0ff" }}
                    >
                        <CalendarOutlined style={{ fontSize: 24, color: "#722ed1" }} />
                        <Title level={4} style={{ marginTop: 8 }}>
                            Cuộc hẹn đã hoàn thành
                        </Title>
                        <Text strong>{completedAppointments}</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card
                        loading={loading}
                        bordered={false}
                        style={{ textAlign: "center", backgroundColor: "#f6ffed" }}
                    >
                        <UserOutlined style={{ fontSize: 24, color: "#52c41a" }} />
                        <Title level={4} style={{ marginTop: 8 }}>
                            Tổng số thai nhi hôm nay
                        </Title>
                        <Text strong>{fetalCount}</Text>
                    </Card>
                </Col>
            </Row>

            <Skeleton active loading={loading}>
                <Title level={4}>📅 Biểu đồ cuộc hẹn theo trạng thái</Title>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="status"
                            tickFormatter={(status) => translateStatus(status)}
                        />
                        <YAxis allowDecimals={false} />

                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Số cuộc hẹn" />
                    </BarChart>
                </ResponsiveContainer>
            </Skeleton>

            <Skeleton active loading={loading} style={{ marginTop: 32 }}>
                <Title level={4}>📋 Danh sách cuộc hẹn hôm nay</Title>
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

export default DoctorDashboard;


// import React, { useEffect, useState } from "react";
// import {
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
// } from "recharts";
// import { Table, Card, Skeleton, Row, Col, Typography } from "antd";
// import {
//     UserOutlined,
//     ShoppingCartOutlined,
//     CalendarOutlined,
// } from "@ant-design/icons";
// import useAppointmentService from "../../../services/useApoitment";
// import userUserService from "../../../services/userUserService";
// import useOrderService from "../../../services/useOrderService";

// const { Title, Text } = Typography;

// const NurseDashboard = () => {
//     const { getAppointmentsByStatus } = useAppointmentService();
//     const { getUserByRole } = userUserService();
//     const { getOrderStatus } = useOrderService();

//     const [appointments, setAppointments] = useState([]);
//     const [chartData, setChartData] = useState([]);
//     const [userCount, setUserCount] = useState(null);
//     const [orderCount, setOrderCount] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [appointmentsResponse, usersResponse, ordersResponse] =
//                     await Promise.all([
//                         getAppointmentsByStatus("PENDING"),
//                         getUserByRole("user"),
//                         getOrderStatus("PAID"),
//                     ]);

//                 setAppointments(appointmentsResponse);

//                 const groupedData = appointmentsResponse.reduce((acc, item) => {
//                     const date = item.appointmentDate;
//                     acc[date] = (acc[date] || 0) + 1;
//                     return acc;
//                 }, {});

//                 const formattedChartData = Object.keys(groupedData).map((date) => ({
//                     date,
//                     count: groupedData[date],
//                 }));
//                 setChartData(formattedChartData);

//                 setUserCount(usersResponse.length);
//                 setOrderCount(ordersResponse.length);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     const columns = [
//         {
//             title: "Ngày hẹn",
//             dataIndex: "appointmentDate",
//             key: "appointmentDate",
//             align: "center",
//         },
//         {
//             title: "Bác sĩ",
//             dataIndex: ["doctor", "username"],
//             key: "doctor",
//             align: "center",
//         },
//         {
//             title: "Thời gian",
//             dataIndex: ["slot", "startTime"],
//             key: "startTime",
//             align: "center",
//         },
//         {
//             title: "Trạng thái",
//             dataIndex: "status",
//             key: "status",
//             align: "center",
//         },
//     ];

//     return (
//         <div style={{ padding: 24 }}>
//             <Title level={3}>📊 Tổng quan thống kê</Title>

//             <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
//                 <Col xs={24} sm={12} md={8}>
//                     <Card
//                         loading={loading}
//                         bordered={false}
//                         style={{ textAlign: "center", backgroundColor: "#f0f5ff" }}
//                     >
//                         <UserOutlined style={{ fontSize: 24, color: "#1890ff" }} />
//                         <Title level={4} style={{ marginTop: 8 }}>
//                             Khách hàng
//                         </Title>
//                         <Text strong>{userCount ?? "-"}</Text>
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={12} md={8}>
//                     <Card
//                         loading={loading}
//                         bordered={false}
//                         style={{ textAlign: "center", backgroundColor: "#fff7e6" }}
//                     >
//                         <ShoppingCartOutlined style={{ fontSize: 24, color: "#faad14" }} />
//                         <Title level={4} style={{ marginTop: 8 }}>
//                             Gói được mua
//                         </Title>
//                         <Text strong>{orderCount ?? "-"}</Text>
//                     </Card>
//                 </Col>
//                 <Col xs={24} sm={24} md={8}>
//                     <Card
//                         loading={loading}
//                         bordered={false}
//                         style={{ textAlign: "center", backgroundColor: "#e6fffb" }}
//                     >
//                         <CalendarOutlined style={{ fontSize: 24, color: "#13c2c2" }} />
//                         <Title level={4} style={{ marginTop: 8 }}>
//                             Cuộc hẹn đang chờ
//                         </Title>
//                         <Text strong>{appointments.length}</Text>
//                     </Card>
//                 </Col>
//             </Row>

//             <Skeleton active loading={loading}>
//                 <Title level={4}>📅 Biểu đồ cuộc hẹn theo ngày</Title>
//                 <ResponsiveContainer width="100%" height={300}>
//                     <BarChart data={chartData}>
//                         <XAxis dataKey="date" />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Bar dataKey="count" fill="#8884d8" name="Số cuộc hẹn" />
//                     </BarChart>
//                 </ResponsiveContainer>
//             </Skeleton>

//             <Skeleton active loading={loading} style={{ marginTop: 32 }}>
//                 <Title level={4}>📋 Danh sách cuộc hẹn đang chờ</Title>
//                 <Table
//                     columns={columns}
//                     dataSource={appointments}
//                     rowKey="id"
//                     pagination={{ pageSize: 5 }}
//                 />
//             </Skeleton>
//         </div>
//     );
// };

// export default NurseDashboard;
