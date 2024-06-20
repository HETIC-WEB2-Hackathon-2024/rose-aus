import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export function ComboBox({ options, onInputChange }) {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={options}
      sx={{ width: 600 }}
      onInputChange={(_, value) => onInputChange(value)}
      renderInput={(params) => <TextField {...params} label="Recherche par poste" />}
    />
  );
}