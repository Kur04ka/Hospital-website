import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { formatDate, formatTime } from '../../../../../../utils/date_parser';
import { Appointment } from '../../../../../../data/appointment/appointmentStore'

interface AppointmentItemProps {
    appointment: Appointment;
    handleEditClick?: (appointmentId: number, doctorName: string) => void;
    handleDeleteClick?: (appointmentId: number) => void;
    isArchive?: boolean;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ appointment, handleEditClick, handleDeleteClick, isArchive = false }: AppointmentItemProps) => (
    <Box key={appointment.appointment_id} color={'rgba(137, 155, 181, 1)'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={'1rem 2rem'} sx={{ backgroundColor: 'rgba(238, 243, 248, 1)', borderRadius: '3rem' }}>
        <Typography variant="h5">
            {appointment.doctor_name}
        </Typography>
        <Typography variant="h5">
            {formatDate(appointment.begins_at)}
        </Typography>
        <Typography variant="h5">
            {formatTime(appointment.begins_at)}
        </Typography>
        {isArchive ? (
            <>
                {appointment.status === 'completed' && (
                    <CheckCircleOutlineIcon sx={{ color: 'green' }} fontSize={'large'} />
                )}
                {appointment.status === 'no show' && (
                    <CancelIcon sx={{ color: 'red' }} fontSize={'large'} />
                )}
                {appointment.status === 'pending' && (
                    <HourglassBottomIcon sx={{ color: 'gray' }} fontSize={'large'} />
                )}
            </>
        ) : (
            <Box display={'flex'} gap={'2rem'}>
                <IconButton onClick={() => handleEditClick && handleEditClick(appointment.appointment_id, appointment.doctor_name)}><EditIcon fontSize='large' style={{ color: 'gray' }} /></IconButton>
                <IconButton onClick={() => handleDeleteClick && handleDeleteClick(appointment.appointment_id)}><DeleteIcon fontSize='large' style={{ color: 'red' }} /></IconButton>
            </Box>
        )}
    </Box>
);

export default AppointmentItem;