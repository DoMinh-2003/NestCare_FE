// import { Card, Col, Row, Statistic } from "antd";
// import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
// import React, { useEffect, useState } from "react";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   Legend,
//   Pie,
//   PieChart,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import useAdminService from "../../../services/useAdminService";
// import api from "../../../config/api";

// function Overview() {
//   const [data, setData] = useState([]);
//   const [top5Mentor, seTop5Mentor] = useState([]);
//   const { getStats } = useAdminService();
//   const fetchData = async () => {
//     const response = await getStats();
//     console.log(response);
//     const formatData = response.top5MostBookedMentors.map((item) => ({
//       name: item?.userResponse.fullName,
//       totalBooking: item?.bookingCount,
//     }));
//     seTop5Mentor(formatData);
//     setData(response);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
//   return (
//     <div>
//       <Row gutter={16}>
//         <Col span={12}>
//           <Card bordered={false}>
//             <Statistic
//               title="Total Mentor"
//               value={data?.mentorCount}
//               valueStyle={{
//                 color: "#cf1322",
//               }}
//               prefix={<ArrowDownOutlined />}
//               suffix=""
//             />
//           </Card>
//         </Col>
//         <Col span={12}>
//           <Card bordered={false}>
//             <Statistic
//               title="Student Customer"
//               value={data?.studentCount}
//               valueStyle={{
//                 color: "#cf1322",
//               }}
//               prefix={<ArrowDownOutlined />}
//               suffix=""
//             />
//           </Card>
//         </Col>
//       </Row>
//       <PieChart width={400} height={200}>
//         <Pie
//           data={data?.topProduct}
//           dataKey="totalSold"
//           nameKey="productName"
//           cx="50%"
//           cy="50%"
//           outerRadius={50}
//           fill="#8884d8"
//           label
//         >
//           {data?.topProduct?.map((item, index) => (
//             <Cell key={index} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie>
//         <Tooltip />
//         <Legend />
//       </PieChart>
//       <BarChart width={500} height={250} data={top5Mentor}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey="totalBooking" fill="#8884d8" />
//       </BarChart>
//     </div>
//   );
// }

// export default Overview;


import React from 'react'

function Overview() {
  return (
    <div>Overview</div>
  )
}

export default Overview
