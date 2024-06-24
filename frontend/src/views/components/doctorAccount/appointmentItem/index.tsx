import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatDate, formatTime } from '../../../../utils/date_parser';
import { Appointment, useAppointmentStore } from '../../../../data/appointment/appointmentStore'

interface AppointmentItemProps {
    appointment: Appointment;
    isMarked?: boolean;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ appointment, isMarked = false }: AppointmentItemProps) => {
    const { updateUnmarkedAppointment } = useAppointmentStore();

    const handleNoShowClick = (id: number) => {
        updateUnmarkedAppointment(id, "no show");
    }

    const handleCompletedClick = (id: number) => {
        updateUnmarkedAppointment(id, "completed");
    }

    return (
        <Box key={appointment.appointment_id} color={'rgba(137, 155, 181, 1)'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={'1rem 2rem'} sx={{ backgroundColor: 'rgba(238, 243, 248, 1)', borderRadius: '3rem' }}>
            <Typography variant="h5">
                {appointment.patient_name}
            </Typography>
            <Typography variant="h5">
                {formatDate(appointment.begins_at)}
            </Typography>
            <Typography variant="h5">
                {formatTime(appointment.begins_at)}
            </Typography>
            {isMarked ? (
                appointment.status === "no show"
                    ?
                    <CancelIcon fontSize='large' style={{ color: 'rgba(221, 101, 101, 1)' }} />
                    :
                    <DoneIcon fontSize='large' style={{ color: 'rgba(0, 255, 0, 1)' }} />
            ) : (
                <Box display={'flex'} gap={'2rem'}>
                    <IconButton onClick={() => handleNoShowClick(appointment.appointment_id)}><CancelIcon fontSize='large' style={{ color: 'rgba(221, 101, 101, 1)' }} /></IconButton>
                    <IconButton onClick={() => handleCompletedClick(appointment.appointment_id)}><DoneIcon fontSize='large' style={{ color: 'rgba(0, 255, 0, 1)' }} /></IconButton>
                </Box>
            )}
        </Box>
    );
}

export default AppointmentItem;