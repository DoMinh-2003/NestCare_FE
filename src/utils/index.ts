export const navigateByRole = (role: string, navigate) => {
    switch (role) {
        case "admin":
            navigate("/admin/overview");
            break;
        case "doctor":
            navigate("/doctor/overview");
            break;
        case "nurse":
            navigate("/nurse/dashboard");
            break;
        default:
            navigate("/");
            break;
    }
}