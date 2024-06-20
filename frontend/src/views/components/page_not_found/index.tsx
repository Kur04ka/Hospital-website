import styles from './notfound.module.css'
import { Typography, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className={styles.container}>
            <div>
                <img src="/images/page-not-found.png" height={700} />
            </div>
            <div>
                <div>
                    <Typography gutterBottom variant="h2" sx={{ marginBottom: '1rem', color: 'rgba(8, 44, 77, 1)' }}>Упс!</Typography>
                    <Typography gutterBottom  variant="h5" sx={{ marginBottom: '2rem', color: 'rgba(137, 155, 181, 1)' }}>Такой страницы не существует или она находится в разработке :(</Typography>

                    <NavLink to="/" color="inherit">
                        <Button className={styles.button} variant="contained">Вернуться на главную</Button>
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
