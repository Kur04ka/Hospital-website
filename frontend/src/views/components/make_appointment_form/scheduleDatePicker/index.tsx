import React, { useEffect, useState } from 'react';
import { Box, Grid, ListItemButton, ListItemText, Typography } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './schedule.module.css'
import { instance } from '../../../../utils/axios';
import { formatTime } from '../../../../utils/date_parser';

interface Appointment {
    appointment_id: number;
    doctor_name: string;
    begins_at: string;
    ends_at: string;
}

interface DoctorScheduleCalendarProps {
    doctorName: string;
    onAppointmentSelect: (appointmentId: number) => void;
}

const DoctorScheduleCalendar: React.FC<DoctorScheduleCalendarProps> = ({ doctorName, onAppointmentSelect }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await instance.get(`/appointments/doctor-schedule/${doctorName}`);
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, [doctorName]);

    const getAppointmentDates = (): Date[] => {
        return appointments.map(appointment => new Date(appointment.begins_at));
    };

    const isDateInAppointments = (date: Date): boolean => {
        return getAppointmentDates().some(appointmentDate =>
            appointmentDate.toDateString() === date.toDateString()
        );
    };

    const onDateClick = (date: Date) => {
        if (isDateInAppointments(date)) {
            setSelectedDate(date);
        }
    };

    const handleAppointmentClick = (appointmentId: number) => {
        onAppointmentSelect(appointmentId);
    };

    // TODO: Наладить отображение записей
    return (
        <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'} gap={'2rem'}>
            <Calendar
                onClickDay={onDateClick}
                tileDisabled={({ date }) => !isDateInAppointments(date)}
            />
            {selectedDate && (
                <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
                    <Typography variant="h5" style={{ color: 'rgba(8, 44, 77, 1)', fontFamily: 'Gilroy medium', textAlign: 'center' }}>Доступное время:</Typography>
                    <Grid container spacing={2}>
                        {appointments
                            .filter(appointment =>
                                new Date(appointment.begins_at).toDateString() === selectedDate.toDateString()
                            )
                            .map((appointment, index) => (
                                <Grid item xs={6} key={appointment.appointment_id} width={200}>
                                    <ListItemButton
                                        className={styles.list_item}
                                        onClick={() => handleAppointmentClick(appointment.appointment_id)}
                                    >
                                        <ListItemText primary={`${formatTime(appointment.begins_at)}`} />
                                    </ListItemButton>
                                </Grid>
                            ))}
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default DoctorScheduleCalendar;