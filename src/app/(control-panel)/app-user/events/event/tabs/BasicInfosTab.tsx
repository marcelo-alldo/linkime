import { TextField, MenuItem } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useFormContext, Controller } from 'react-hook-form';
import { useLocation } from 'react-router';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

const eventTypes = [
  { value: 'conference', label: 'Conferência' },
  { value: 'meeting', label: 'Reunião' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'training', label: 'Treinamento' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Outro' },
];

const eventStatuses = [
  { value: 'scheduled', label: 'Agendado' },
  { value: 'ongoing', label: 'Em Andamento' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
];

function BasicInfosTab() {
  const { register, formState, control } = useFormContext();
  const { state } = useLocation();
  const isNew = window.location.pathname.includes('/new');

  const getHelperText = (field) => (typeof field?.message === 'string' ? field.message : undefined);

  return (
    <div className="flex flex-col gap-4 max-w-xl">
      <TextField
        label="Título"
        {...register('title')}
        required
        disabled={state?.isView}
        error={!!formState.errors.title}
        helperText={getHelperText(formState.errors.title)}
        fullWidth
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label="Descrição"
        {...register('description')}
        disabled={state?.isView}
        error={!!formState.errors.description}
        helperText={getHelperText(formState.errors.description)}
        fullWidth
        multiline
        rows={4}
        InputLabelProps={{ shrink: true }}
      />

      <Controller
        name="startDate"
        control={control}
        render={({ field }) => (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DateTimePicker
              label="Data e Hora de Início"
              value={field.value ? (typeof field.value === 'string' ? new Date(field.value) : field.value) : null}
              onChange={(date) => {
                const str = date instanceof Date && !isNaN(date.getTime()) ? date.toISOString() : '';
                field.onChange(str);
              }}
              disabled={state?.isView}
              slotProps={{
                textField: {
                  required: true,
                  error: !!formState.errors.startDate,
                  helperText: getHelperText(formState.errors.startDate),
                },
              }}
            />
          </LocalizationProvider>
        )}
      />

      <Controller
        name="endDate"
        control={control}
        render={({ field }) => (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DateTimePicker
              label="Data e Hora de Término"
              value={field.value ? (typeof field.value === 'string' ? new Date(field.value) : field.value) : null}
              onChange={(date) => {
                const str = date instanceof Date && !isNaN(date.getTime()) ? date.toISOString() : '';
                field.onChange(str);
              }}
              disabled={state?.isView}
              slotProps={{
                textField: {
                  required: true,
                  error: !!formState.errors.endDate,
                  helperText: getHelperText(formState.errors.endDate),
                },
              }}
            />
          </LocalizationProvider>
        )}
      />

      <TextField
        label="Local"
        {...register('location')}
        disabled={state?.isView}
        error={!!formState.errors.location}
        helperText={getHelperText(formState.errors.location)}
        fullWidth
        InputLabelProps={{ shrink: true }}
      />

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <TextField
            label="Tipo de Evento"
            select
            {...field}
            disabled={state?.isView}
            error={!!formState.errors.type}
            helperText={getHelperText(formState.errors.type)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          >
            {eventTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      {!isNew && (
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <TextField
              label="Status"
              select
              {...field}
              disabled={state?.isView}
              error={!!formState.errors.status}
              helperText={getHelperText(formState.errors.status)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            >
              {eventStatuses.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      )}
    </div>
  );
}

export default BasicInfosTab;
