
export const generateTimeSlots = () => {
    const slots = [];
    const startHour = 7; // Bắt đầu từ 7:00
    const endHour = 16; // Kết thúc tại 16:00
    let hour = startHour;
    let minute = 0;

    while (hour < endHour || (hour === endHour && minute === 0)) {
        const start = `${hour}:${minute === 0 ? '00' : minute}`;
        const end = `${hour}:${minute === 0 ? '30' : '00'}`;

        slots.push({
            value: `${start}-${end}`,
            label: `${start} - ${end}`,
        });

        minute = minute === 0 ? 30 : 0;
        if (minute === 0) {
            hour++;
        }
    }

    return slots;
};