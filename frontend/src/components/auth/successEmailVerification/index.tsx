import React from 'react';
import styles from './successVerification.module.css'
import Header from '../../header';
import { Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { Button } from '@mui/material';


const SuccessVerificationForm = () => {
    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <img src="ok.png" alt="ok hand" height={400} style={{marginBottom: '2rem'}}/>
                
                <Typography variant="h5" component={"span"} sx={{ marginBottom: '1rem', color: 'rgba(8, 44, 77, 1)'}}>Вы успешно зарегистрировались!</Typography>
                
                <NavLink to="/login" color="inherit">
                    <Button className={styles.button} variant="contained">Войти</Button>
                </NavLink>
            </main>
        </div>
    );
};

export default SuccessVerificationForm;