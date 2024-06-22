import React from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import { Typography, Button, Box, DialogTitle } from '@mui/material';
import styles from './dialog.module.css'
import { useAppointmentStore } from '../../../../../../data/appointment/appointmentStore';

interface ConfirmationDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    appointmentId: number | null;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, setOpen, appointmentId }) => {
    const {removeCurrentAppointment} = useAppointmentStore();

    const handleClose = () => {
        setOpen(false);
    };

    const handleRemoveAppointment = () => {
        if (appointmentId !== null) {
            removeCurrentAppointment(appointmentId);
            setOpen(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: '3rem', padding: '2rem' } }}>
                <DialogTitle >
                    <Typography variant="h5" color={'rgba(8, 44, 77, 1)'} gutterBottom>Вы уверены, что хотите отменить запись?</Typography>
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} justifyContent={'space-evenly'}>
                        <Button onClick={handleRemoveAppointment} className={styles.button} style={{ backgroundColor: 'rgba(19, 84, 147, 1)' }} variant="contained">Отменить запись</Button>
                        <Button onClick={handleClose} className={styles.button} variant="outlined">Вернуться назад</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ConfirmationDialog;