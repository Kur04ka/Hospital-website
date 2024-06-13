import { useState } from 'react';
import styles from './leave_phone.module.css';
import { Typography, TextField, Button, FormHelperText } from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import { instance } from '../../../../utils/axios';
import { isValidPhoneNumber } from 'libphonenumber-js';
import DialogAccepted from './dialogAccepted';

const LeavePhoneForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!isValidPhoneNumber(phone)) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);

    try {
      const callRequestData = {
        name,
        phone,
      };

      await instance.post('call-request/leave-call-request', callRequestData);

      setName('');
      setPhone('');

      setOpen(true);

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.main}>
      <Typography gutterBottom variant="h3" sx={{ color: 'rgba(8, 44, 77, 1)', marginBottom: 3 }}>Есть вопросы по здоровью?<br />Специалисты подскажут и помогут!</Typography>
      <Typography gutterBottom variant="h6" sx={{ color: 'rgba(137, 155, 181, 1)', marginBottom: 6 }}>Записывайтесь на консультацию в нашу клинику<br />Вам перезвонят за считанные минуты</Typography>

      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField className={styles.item} onChange={(e) => setName(e.target.value)} value={name} required label="Имя" placeholder="Введите ваше Имя" />
        <div className={styles.item}>
          <MuiTelInput 
            onChange={(newValue) => setPhone(newValue)} 
            value={phone} 
            defaultCountry='RU' 
            label="Телефон" 
            required 
            error={phoneError}
          />
          {phoneError && (
            <FormHelperText error>Неверный номер телефона</FormHelperText>
          )}
        </div>
        <Button type='submit' className={`${styles.button} ${styles.item}`} variant="contained">Оставить заявку</Button>
      </form>

        <DialogAccepted open={open} setOpen={setOpen}/>
    </div>
  );
};

export default LeavePhoneForm;