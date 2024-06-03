import React, { useState, useEffect } from 'react';
import { instance } from '../../../../utils/axios';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';

interface SpecialitySelectorProps {
    onSpecialityChange: (speciality: string) => void;
  }
  
  const SpecialitySelector: React.FC<SpecialitySelectorProps> = ({ onSpecialityChange }) => {
    const [specialities, setSpecialities] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const fetchSpecialities = async () => {
        try {
          const response = await instance.get('/doctors/all-specialities');
          setSpecialities(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching specialities:', error);
          setLoading(false);
        }
      };
  
      fetchSpecialities();
    }, []);
  
    const handleChange = (event: any) => {
      onSpecialityChange(event.target.value);
    };
  
    return (
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="select-speciality-label">Speciality</InputLabel>
        {loading ? (
          <CircularProgress />
        ) : (
          <Select
            labelId="select-speciality-label"
            onChange={handleChange}
            label="Speciality"
          >
            {specialities.map((speciality, index) => (
              <MenuItem key={index} value={speciality}>
                {speciality}
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>
    );
  };
  
  export default SpecialitySelector;