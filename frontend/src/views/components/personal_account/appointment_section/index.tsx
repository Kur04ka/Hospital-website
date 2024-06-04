import React, { useEffect, useState } from 'react';
import { Box, FormControl, Typography, Select, MenuItem, Button} from '@mui/material';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ConfirmationDialog from './confirmationDialog'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAppointmentStore } from '../../../../data/appointment/appointmentStore';
import styles from './appointment.module.css';
import { formatDate, formatTime } from '../../../../utils/date_parser';
import EditDialog from './editDialog';
import EmptyAppointment from './emptyAppointment';
import MakeAppointmentForm from '../../make_appointment_from';


const AppointmentSection = () => {
    const {
        currentAppointments,
        archiveAppointments,
        fetchCurrentAppointments,
        fetchArchiveAppointments,
        updateCurrentAppointment,
        removeCurrentAppointment,
    } = useAppointmentStore();

    const [selectedType, setSelectedType] = useState<'current' | 'archive'>('current');
    const [hasArchiveAppointments, setHasArchiveAppointments] = useState<boolean>(false);
    const [hasCurrentAppointments, setHasCurrentAppointments] = useState<boolean>(false);
    const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [isMakeAppointmentOpen, setMakeAppointmentOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number>(0);
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');

    const handleDeleteClick = (appointmentId: number) => {
        setSelectedAppointmentId(appointmentId);
        setConfirmationDialogOpen(true);
    };

    const handleEditClick = (appointmentId: number, doctorName: string) => {
        setSelectedAppointmentId(appointmentId);
        setSelectedDoctor(doctorName)
        setEditDialogOpen(true);
    };

    const handleMakeAppointmentFormClick = () => {
        setMakeAppointmentOpen(true)
    }

    useEffect(() => {
        if (selectedType === 'current') {
            fetchCurrentAppointments();
        } else {
            fetchArchiveAppointments();
        }
    }, [selectedType]);

    useEffect(() => {
        if (currentAppointments !== null) {
            setHasCurrentAppointments(currentAppointments.length > 0);
        }
        if (archiveAppointments !== null) {
            setHasArchiveAppointments(archiveAppointments.length > 0);
        }
    }, [currentAppointments, archiveAppointments]);

    const handleChange = (event: any) => {
        setSelectedType(event.target.value as 'current' | 'archive');
    };

    const appointments = selectedType === 'current' ? currentAppointments || [] : archiveAppointments || [];

    return (
        <Box display={'flex'} flexDirection={'column'} gap={'2rem'} padding={'3rem'} border={'3px solid rgba(238, 243, 248, 1)'} sx={{ borderRadius: '3rem' }}>
            <Box display={'flex'} justifyContent={'space-between'}>
                <Box display={'flex'} justifyContent={'start'} alignItems={'center'} gap={'3rem'}>
                    <Typography variant="h4">Записи на прием к врачу</Typography>
                    <FormControl size='small'>
                        <Select value={selectedType} onChange={handleChange} sx={{ borderRadius: '3rem' }}>
                            <MenuItem value="current">Текущие</MenuItem>
                            <MenuItem value="archive">Архив</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Button className={styles.button} onClick={handleMakeAppointmentFormClick} variant="contained">Записаться на прием</Button>
            </Box>
            <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
                {selectedType === 'current' ? (
                    hasCurrentAppointments ? ( // Проверяем наличие текущих записей перед их отображением
                        appointments.map((appointment) => (
                            <Box key={appointment.appointment_id} display={'flex'} justifyContent={'space-between'} padding={'1rem'} sx={{ backgroundColor: 'rgba(238, 243, 248, 1)', borderRadius: '3rem' }}>
                                <Typography variant="h6" color={'rgba(137, 155, 181, 1)'}>
                                    {appointment.doctor_name}
                                </Typography>
                                <Typography variant="h6" color={'rgba(137, 155, 181, 1)'}>
                                    {formatDate(appointment.begins_at)}
                                </Typography>
                                <Typography variant="h6" color={'rgba(137, 155, 181, 1)'}>
                                    {formatTime(appointment.begins_at)}
                                </Typography>
                                <Box display={'flex'} gap={'2rem'}>
                                    <IconButton onClick={() => handleEditClick(appointment.appointment_id, appointment.doctor_name)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDeleteClick(appointment.appointment_id)}><DeleteIcon style={{ color: 'rgba(221, 101, 101, 1)' }} /></IconButton>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <EmptyAppointment />
                    )
                ) : (
                    hasArchiveAppointments ? (
                        appointments.map((appointment) => (
                            <Box key={appointment.appointment_id} display={'flex'} justifyContent={'space-between'} borderRadius={4} padding={'1rem'} sx={{ backgroundColor: 'rgba(238, 243, 248, 1)' }}>
                                <Typography variant="h6" color={'rgba(137, 155, 181, 1)'}>
                                    {appointment.doctor_name}
                                </Typography>
                                <Typography variant="h6" color={'rgba(137, 155, 181, 1)'}>
                                    {formatDate(appointment.begins_at)}
                                </Typography>
                                <Typography variant="h6" color={'rgba(137, 155, 181, 1)'}>
                                    {formatTime(appointment.begins_at)}
                                </Typography>
                                <CheckCircleOutlineIcon sx={{ color: 'green', marginRight: '1rem', marginTop: '0.2rem' }} />
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body1">Пока что у вас нет архивных записей</Typography>
                    )
                )}
            </Box>

            <ConfirmationDialog open={isConfirmationDialogOpen} setOpen={setConfirmationDialogOpen} appointmentId={selectedAppointmentId} removeAppointment={removeCurrentAppointment} />
            <EditDialog open={isEditDialogOpen} setOpen={setEditDialogOpen} old_appointmentId={selectedAppointmentId} doctorName={selectedDoctor} updateCurrentAppointment={updateCurrentAppointment} />
            <MakeAppointmentForm open={isMakeAppointmentOpen} setOpen={setMakeAppointmentOpen} />
        </Box>
    );
};

export default AppointmentSection;
