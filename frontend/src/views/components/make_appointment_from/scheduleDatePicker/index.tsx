import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { instance } from '../../../../utils/axios';

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
                const response = await instance.get(`/doctors/doctor-schedule/${doctorName}`);
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

    const formatTime = (datetime: string): string => {
        return dayjs(datetime).format('HH:mm');
    };

    const handleAppointmentClick = (appointmentId: number) => {
        onAppointmentSelect(appointmentId);
    };

    return (
        <Box>
            <Calendar
                onClickDay={onDateClick}
                tileDisabled={({ date }) => !isDateInAppointments(date)}
            />
            {selectedDate && (
                <Box mt={2}>
                    <Typography variant="h6">Appointments on {selectedDate.toDateString()}:</Typography>
                    <List>
                        {appointments
                            .filter(appointment =>
                                new Date(appointment.begins_at).toDateString() === selectedDate.toDateString()
                            )
                            .map(appointment => (
                                <ListItem
                                    key={appointment.appointment_id}
                                    button
                                    onClick={() => handleAppointmentClick(appointment.appointment_id)}
                                >
                                    <ListItemText primary={`${formatTime(appointment.begins_at)}`} />
                                </ListItem>
                            ))
                        }
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default DoctorScheduleCalendar;