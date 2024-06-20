import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export function ComboBox({ options, onInputChange, value }) {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={options}
      value={value}
      className="search-bar"
      onInputChange={(_, newValue) => onInputChange(newValue)}
      isOptionEqualToValue={(option, value) => option.label === value || value === ''}
      renderInput={(params) => <TextField {...params} label="Recherche par poste" />}
      sx={{ width: 400 }}
    />
  );
}

export function CityComboBox({ options, onInputChange, value }) {
  return (
    <Autocomplete
      disablePortal
      id="city-combo-box-demo"
      options={options}
      value={value}
      className="search-bar"
      onInputChange={(_, newValue) => onInputChange(newValue)}
      isOptionEqualToValue={(option, value) => option.label === value || value === ''}
      renderInput={(params) => <TextField {...params} label="Recherche par ville" />}
      sx={{ width: 400 }}
    />
  );
}