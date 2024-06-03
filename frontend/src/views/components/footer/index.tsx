import React from 'react';
import { Box, Typography, TextField, IconButton, Grid, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import styles from './footer.module.css'
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import TelegramIcon from '@mui/icons-material/Telegram';

const Footer = () => {
    return (
        <div className={styles.main}>
            <Box display={'flex'} justifyContent={'space-between'} textAlign={'start'} padding={'1rem'} >
                <Box display={'flex'} alignItems={'start'} flexDirection={'column'}>
                    <Typography variant="h4" sx={{ fontFamily: 'Gilroy Bold' }} gutterBottom>ЗАПИШИТЕСЬ НА КОНСУЛЬТАЦИЮ</Typography>
                    <Typography variant="h6" className={styles.typography} gutterBottom>
                        Дарим 10% скидку на следующий приём при записи<br />на бесплатную первичную консультацию с нашего сайта.
                    </Typography>
                </Box>
                <Box display={'flex'} justifyContent={'space-between'} flexDirection={'column'} gap={'3rem'}>
                    <Box display={'flex'} gap={'4rem'} justifyContent={'space-between'}>
                        <Box display={'flex'} flexDirection={'column'} >
                            <Typography variant="h5" gutterBottom fontFamily={'Gilroy'}>КЛИЕНТАМ</Typography>
                            <NavLink to="/page-not-found">
                                <Typography variant="body1" className={styles.typography} gutterBottom>Запись на прием</Typography>
                            </NavLink>
                            <NavLink to="/page-not-found">
                                <Typography variant="body1" className={styles.typography} gutterBottom>Врачи</Typography>
                            </NavLink>
                            <NavLink to="/page-not-found">
                                <Typography variant="body1" className={styles.typography} gutterBottom>Отзывы</Typography>
                            </NavLink>
                        </Box>
                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography variant="h5" gutterBottom fontFamily={'Gilroy'}>О КОМПАНИИ</Typography>
                            <NavLink to="/page-not-found">
                                <Typography variant="body1" className={styles.typography} gutterBottom>О нас</Typography>
                            </NavLink>
                            <NavLink to="/page-not-found">
                                <Typography variant="body1" className={styles.typography} gutterBottom >Контакты</Typography>
                            </NavLink>
                        </Box>
                    </Box>
                    <Box display={'flex'}>
                        <Box sx={{ display: 'flex', gap: '2rem', textAlign: 'center' }}>
                            <Typography variant="h5" textAlign={'center'} fontFamily={'Gilroy'}>СОЦ. СЕТИ</Typography>
                            <IconButton sx={{ color: 'rgba(246, 237, 235, 1)' }}><YouTubeIcon /></IconButton>
                            <IconButton sx={{ color: 'rgba(246, 237, 235, 1)' }}><InstagramIcon /></IconButton>
                            <IconButton sx={{ color: 'rgba(246, 237, 235, 1)' }}><PinterestIcon /></IconButton>
                            <IconButton sx={{ color: 'rgba(246, 237, 235, 1)' }}><TelegramIcon /></IconButton>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box display={'flex'} justifyContent={'space-between'} sx={{ borderTop: '1px solid rgba(246, 237, 235, 1)', marginTop: '1rem', paddingTop: '1rem' }}>
                <NavLink to="/page-not-found">
                    <Typography variant="subtitle1" className={styles.typography}>©2024. Все права защищены</Typography>
                </NavLink>

                <NavLink to="/page-not-found">
                    <Typography variant="subtitle1" className={styles.typography}>Политика конфиденциальности</Typography>
                </NavLink>
            </Box>
        </div>
    );
};

export default Footer;