import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Descriptions, Spin, Alert, Table } from "antd";
import useFetalService from "../../../services/useFetalService";

const FetailDetail = () => {
    const { id } = useParams();
    const [fetalRecord, setFetalRecord] = useState(null);
    const { getFetailAndMotherDetail } = useFetalService();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFetalRecord = async () => {
            try {
                const response = await getFetailAndMotherDetail(id);
                console.log(response)
                setFetalRecord(response.data);
            } catch (err) {
                setError("Không thể tải dữ liệu hồ sơ thai nhi.");
            } finally {
                setLoading(false);
            }
        };
        fetchFetalRecord();
    }, [id]);

    if (loading) return <Spin size="large" />;
    if (error) return <Alert message={error} type="error" showIcon />;

    return (
        <div>
            <Card title={`Thông tin hồ sơ thai nhi: ${fetalRecord.name}`}>
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Ghi chú">{fetalRecord.note}</Descriptions.Item>
                    <Descriptions.Item label="Ngày bắt đầu thai kỳ">{fetalRecord.dateOfPregnancyStart}</Descriptions.Item>
                    <Descriptions.Item label="Ngày dự sinh">{fetalRecord.expectedDeliveryDate}</Descriptions.Item>
                    <Descriptions.Item label="Tình trạng sức khỏe">{fetalRecord.healthStatus}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">{fetalRecord.status}</Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="Danh sách cuộc hẹn" style={{ marginTop: 20 }}>
                <Table
                    dataSource={fetalRecord.appointments}
                    rowKey="id"
                    columns={[
                        { title: "Mã cuộc hẹn", dataIndex: "id" },
                        { title: "Ngày hẹn", dataIndex: "appointmentDate" },
                        { title: "Trạng thái", dataIndex: "status" },
                    ]}
                />
            </Card>

            <Card title="Thông tin mẹ" style={{ marginTop: 20 }}>
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Họ tên">{fetalRecord.mother.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{fetalRecord.mother.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{fetalRecord.mother.phone}</Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
};

export default FetailDetail;
