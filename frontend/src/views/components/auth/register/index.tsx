import React, { Fragment, useState } from 'react';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Typography } from '@mui/material';
import { Select } from '@mui/material';
import { InputLabel } from '@mui/material';
import { MenuItem } from '@mui/material';
import { FormControl } from '@mui/material';
import { NavLink } from 'react-router-dom';
import styles from "./register.module.css"
import dayjs, { Dayjs } from 'dayjs';
import { instance } from '../../../../utils/axios';
import Header from '../../header';
import WomanWithHeart from "../../shared/womanWithHeart"
import { MuiTelInput } from 'mui-tel-input'
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = (): JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [repeatPassword, setRepeatPassword] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [birthDate, setBirthDate] = React.useState<Dayjs | null>()
  const [sex, setSex] = useState('')
  const [phone, setPhone] = useState('')

  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const isLongEnough = password.length >= 5;

    return isLongEnough;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsPasswordValid(validatePassword(newPassword));
  };

  const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRepeatPassword = e.target.value;
    setRepeatPassword(newRepeatPassword);
    setIsPasswordMatch(password === newRepeatPassword);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    const birth_date = birthDate
    const phone_number = phone
    const created_at = new Date()

    const userData = {
      email,
      password,
      name,
      surname,
      sex,
      birth_date,
      phone_number,
      created_at,
    }

    const user = await instance.post('auth/sign-up', userData)

    localStorage.setItem('email', email)

    navigate('/verify-email');
  }

  return (
    <div className={styles.container_main}>
      <Header />
      <main className={styles.main}>
        <WomanWithHeart />
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <Typography variant="h3" component={"span"} sx={{ marginBottom: 4, textAlign: 'center' }}>Регистрация</Typography>

          <div className={styles.container_text_fields}>

            <TextField onChange={(e) => setName(e.target.value)} className={styles.item} required label="Имя" placeholder="Введите ваше имя" />
            <TextField onChange={(e) => setSurname(e.target.value)} className={styles.item} required label="Фамилия" placeholder="Введите вашу фамилию" />

            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DatePicker value={birthDate} onChange={(birthDate) => setBirthDate(birthDate)} className={styles.item} format='DD-MM-YYYY' label="Дата рождения" slotProps={{ textField: { required: true } }} />
            </LocalizationProvider>
            <FormControl className={styles.item} required>
              <InputLabel >Пол</InputLabel>
              <Select label='Пол' onChange={(e) => setSex(e.target.value)} value={sex}>
                <MenuItem value={"Мужчина"}>Мужчина</MenuItem>
                <MenuItem value={"Женщина"}>Женщина</MenuItem>
              </Select>
            </FormControl>

            <TextField  helperText={!isPasswordValid ? 'Пароль должен содержать более 5 символов' : ''} onChange={handlePasswordChange} className={styles.item} required type='text' label="Пароль" placeholder="Введите ваш пароль" />
            <TextField onChange={(e) => setEmail(e.target.value)} className={styles.item} required type='email' label="Электронная почта" placeholder="example@mail.com" />

            <TextField helperText={!isPasswordMatch ? 'Пароли не совпадают.' : ''} onChange={handleRepeatPasswordChange} className={styles.item} required type='password' label="Подтвердите пароль" placeholder="Подтвердите ваш пароль" />
            <MuiTelInput onChange={(newValue) => setPhone(newValue)} value={phone} defaultCountry='RU' className={styles.item} label="Телефон" required fullWidth />

          </div>

          <Button type='submit' className={styles.button} fullWidth variant="contained">Зарегистрироваться</Button>
          <NavLink className={styles.link} to={'/login'}>Есть аккаунт? Войти</NavLink>
        </form>
      </main>
    </div>
  );
}

export default RegisterPage;