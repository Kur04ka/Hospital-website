import React from 'react';
import { Box, FormControl, Typography, Select, MenuItem } from '@mui/material';

interface AppointmentControlsProps {
    selectedType: 'marked' | 'unmarked';
    handleChange: (event: any) => void;
}

const AppointmentControls: React.FC<AppointmentControlsProps> = ({ selectedType, handleChange }: AppointmentControlsProps) => (
    <Box display={'flex'} justifyContent={'space-between'}>
        <Box display={'flex'} justifyContent={'start'} alignItems={'center'} gap={'3rem'}>
            <Typography variant="h4">Мои приемы </Typography>
            <FormControl size='small'>
                <Select value={selectedType} onChange={handleChange} sx={{ borderRadius: '3rem' }}>
                    <MenuItem value="marked">Отмеченные</MenuItem>
                    <MenuItem value="unmarked">Неотмеченные</MenuItem>
                </Select>
            </FormControl>
        </Box>
    </Box>
);

export default AppointmentControls;