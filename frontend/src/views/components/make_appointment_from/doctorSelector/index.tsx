import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { instance } from '../../../../utils/axios';

interface DoctorSelectorProps {
  speciality: string;
  onDoctorChange: (doctor: string) => void;
}

const DoctorSelector: React.FC<DoctorSelectorProps> = ({ speciality, onDoctorChange }) => {
  const [doctors, setDoctors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');

  useEffect(() => {
    if (speciality) {
      const fetchDoctors = async () => {
        setLoading(true);
        try {
          const response = await instance.get(`/doctors/doctor-by-speciality/${speciality}`);
          setDoctors(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching doctors:', error);
          setLoading(false);
        }
      };

      fetchDoctors();
    }
  }, [speciality]);

  const handleChange = (event: any) => {
    const doctor = event.target.value as string;
    setSelectedDoctor(doctor);
    onDoctorChange(doctor);
  };

  return (
    <FormControl fullWidth variant="outlined" margin="normal" disabled={!speciality}>
      <InputLabel id="select-doctor-label">Doctor</InputLabel>
      {loading ? (
        <CircularProgress />
      ) : (
        <Select
          labelId="select-doctor-label"
          value={selectedDoctor}
          onChange={handleChange}
          label="Doctor"
          disabled={!speciality}
        >
          {doctors.map((doctor, index) => (
            <MenuItem key={index} value={doctor}>
              {doctor}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};

export default DoctorSelector;