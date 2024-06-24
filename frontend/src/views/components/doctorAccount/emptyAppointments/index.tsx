import React from 'react'
import { Box, Typography } from '@mui/material';

const EmptyAppointment: React.FC = () => {
    return (
        <Box display={'flex'} gap={'3rem'} justifyContent={'center'} textAlign={'center'} padding={'3rem'} border={'3px solid rgba(238, 243, 248, 1)'} borderRadius={'3rem'}>
            <img src="./images/paper-tablet.png" alt="paper-tablet.png" height={'250px'} />
            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} gap={'1rem'}>
                <Typography variant='h5' sx={{ color: 'rgba(137, 155, 181, 1)', fontFamily: 'Gilroy' }}>Пока что тут пусто</Typography>
            </Box>
        </Box>
    )
};

export default EmptyAppointment