export enum AppointmentStatus {
    PENDING = 'PENDING', // Đang chờ xác nhận
    CONFIRMED = 'CONFIRMED', // Đã xác nhận
    CHECKED_IN = 'CHECKED_IN', // Bệnh nhân đã đến bệnh viện
    IN_PROGRESS = 'IN_PROGRESS', // Đang được khám
    COMPLETED = 'COMPLETED', // Đã hoàn tất
    CANCELED = 'CANCELED', // Đã hủy
}