import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Typography } from '@mui/material';
import { Button } from '@mui/material';
import styles from './dialog.module.css'
import React from 'react';


interface DialogAcceptedProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}  

const DialogAccepted: React.FC<DialogAcceptedProps> = ({ open, setOpen }) => {
    const handleClose = () => {
        setOpen(false);
      };

    return (
        <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: '3rem', padding: '2rem' } }}>
            <DialogContent>
                <DialogContentText>
                    <Typography gutterBottom variant="h4" className={styles.dialog_item} sx={{ color: 'rgba(19, 84, 147, 1);' }}>Ваша заявка успешно отправлена!</Typography>
                    <Typography gutterBottom variant="h6" className={styles.dialog_item} sx={{ color: 'rgba(137, 155, 181, 1)' }}>Ожидайте звонка от нашего специалиста в течение нескольких минут.</Typography>
                </DialogContentText>
            </DialogContent>
            <div style={{ textAlign: 'center', justifyContent: 'center', display: 'flex' }}>
                <Button className={styles.button} onClick={handleClose} variant="contained" style={{ width: '50%' }}>Отлично</Button>
            </div>
        </Dialog>
    )
}

export default DialogAccepted;