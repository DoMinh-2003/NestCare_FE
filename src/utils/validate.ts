// validators.ts
export const validateFullName = (_: any, value: string) => {
    if (!value || value.trim().split(' ').length < 2) {
        return Promise.reject(new Error('Họ tên phải có ít nhất 2 chữ!'));
    }
    return Promise.resolve();
};

export const validatePassword = (_: any, value: string) => {
    if (!value || value.length < 6) {
        return Promise.reject(new Error('Mật khẩu phải có ít nhất 6 ký tự!'));
    }
    return Promise.resolve();
};

export const validatePhoneNumber = (_: any, value: string) => {
    const phoneRegex = /^\d{10}$/; // Biểu thức chính quy để kiểm tra 10 chữ số
    if (!value || !phoneRegex.test(value)) {
        return Promise.reject(new Error('Số điện thoại phải là 10 chữ số!'));
    }
    return Promise.resolve();
};

export const validateUsername = (_: any, value: string) => {
    const usernameRegex = /^[a-zA-Z0-9._]{3,}$/; // Tên người dùng phải có ít nhất 3 ký tự và chỉ chứa chữ cái, số, dấu gạch dưới và dấu chấm
    if (!value || !usernameRegex.test(value)) {
        return Promise.reject(new Error('Tên người dùng phải có ít nhất 3 ký tự và chỉ chứa chữ cái, số, dấu gạch dưới và dấu chấm!'));
    }
    return Promise.resolve();
};