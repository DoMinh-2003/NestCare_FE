import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Descriptions, Spin, Alert, Table, Tag, Button } from "antd";
import useFetalService from "../../../services/useFetalService";
import { formatDate } from "../../../utils/formatDate";
import { AppointmentStatus, PregnancyStatus } from "../../../constants/status";

const FetailDetail = () => {
    const { id } = useParams();
    const [fetalRecord, setFetalRecord] = useState(null);
    const { getFetailAndMotherDetail } = useFetalService();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFetalRecord = async () => {
            if (!id) {
                setError("Không tìm thấy id hồ sơ.");
                setLoading(false);
                return;
            }
            try {
                const response = await getFetailAndMotherDetail(id);
                console.log(response);
                setFetalRecord(response);
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
    const getStatusTag = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.PENDING:
                return <Tag color="orange">Đang chờ xác nhận</Tag>;
            case AppointmentStatus.CONFIRMED:
                return <Tag color="blue">Đã xác nhận</Tag>;
            case AppointmentStatus.CHECKED_IN:
                return <Tag color="cyan">Đã đến bệnh viện</Tag>;
            case AppointmentStatus.IN_PROGRESS:
                return <Tag color="purple">Đang khám</Tag>;
            case AppointmentStatus.COMPLETED:
                return <Tag color="green">Hoàn tất</Tag>;
            case AppointmentStatus.CANCELED:
                return <Tag color="red">Đã hủy</Tag>;
            default:
                return <Tag color="default">Không xác định</Tag>;
        }
    };

    const getPregnancyStatusTag = (status: PregnancyStatus) => {
        switch (status) {
            case PregnancyStatus.PREGNANT:
                return <Tag color="blue">Đang mang thai</Tag>;
            case PregnancyStatus.BORN:
                return <Tag color="green">Đã sinh</Tag>;
            case PregnancyStatus.MISSED:
                return <Tag color="orange">Mất thai không có dấu hiệu</Tag>;
            case PregnancyStatus.STILLBIRTH:
                return <Tag color="red">Thai chết lưu</Tag>;
            case PregnancyStatus.ABORTED:
                return <Tag color="volcano">Phá thai</Tag>;
            case PregnancyStatus.MISCARRIAGE:
                return <Tag color="magenta">Thai chết lưu tự nhiên</Tag>;
            default:
                return <Tag color="default">Không xác định</Tag>;
        }
    };
    return (
        <div>
            <Button className="mb-2" onClick={() => navigate(-1)} type="primary">
                Quay lại
            </Button>
            <Card title={`Thông tin hồ sơ thai nhi: ${fetalRecord.name}`}>
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Ghi chú">{fetalRecord.note}</Descriptions.Item>
                    <Descriptions.Item label="Ngày bắt đầu thai kỳ">{formatDate(fetalRecord.dateOfPregnancyStart)}</Descriptions.Item>
                    <Descriptions.Item label="Ngày dự sinh">{formatDate(fetalRecord.expectedDeliveryDate)}</Descriptions.Item>
                    <Descriptions.Item label="Tình trạng sức khỏe">{fetalRecord.healthStatus}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">{getPregnancyStatusTag(fetalRecord.status)}</Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="Danh sách cuộc hẹn" style={{ marginTop: 20 }}>
                <Table
                    dataSource={fetalRecord.appointments}
                    rowKey="id"
                    columns={[
                        { title: "Mã cuộc hẹn", dataIndex: "id" },
                        { title: "Ngày hẹn", dataIndex: "appointmentDate", render: (value) => formatDate(value) },
                        { title: "Trạng thái", dataIndex: "status", render: (value: AppointmentStatus) => getStatusTag(value), },
                    ]}
                />
            </Card>

            <Card title="Thông tin mẹ" style={{ marginTop: 20, marginBottom: 10 }}>
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
