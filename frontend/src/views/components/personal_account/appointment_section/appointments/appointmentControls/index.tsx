import React from 'react';
import { Box, FormControl, Typography, Select, MenuItem, Button } from '@mui/material';
import styles from './controls.module.css'

interface AppointmentControlsProps {
    selectedType: 'current' | 'archive';
    handleChange: (event: any) => void;
    handleMakeAppointmentFormClick: () => void;
}

const AppointmentControls: React.FC<AppointmentControlsProps> = ({ selectedType, handleChange, handleMakeAppointmentFormClick }: AppointmentControlsProps) => (
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
        <Button variant="contained" className={styles.button} onClick={handleMakeAppointmentFormClick}>Записаться на прием</Button>
    </Box>
);

export default AppointmentControls;