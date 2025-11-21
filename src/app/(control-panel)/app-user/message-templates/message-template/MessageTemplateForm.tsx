import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Switch,
  FormControlLabel,
  useTheme,
  Box,
  Typography,
} from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import WhatsAppPreview from '../../../../../components/WhatsAppPreview';

const categoryOptions = [
  { value: 'MARKETING', label: 'Marketing', color: '#4CAF50' },
  { value: 'UTILITY', label: 'Utilidade', color: '#FF9800' },
];

interface MessageTemplateFormProps {
  viewOnly?: boolean;
}

function MessageTemplateForm({ viewOnly }: MessageTemplateFormProps) {
  const { register, formState, control, watch } = useFormContext();
  const theme = useTheme();

  const messageContent = watch('message', '');

  const getHelperText = (field) => (typeof field?.message === 'string' ? field.message : undefined);

  const getCategoryColor = (category: string) => {
    const option = categoryOptions.find((opt) => opt.value === category);
    return option?.color || '#757575';
  };

  const getCategoryLabel = (category: string) => {
    const option = categoryOptions.find((opt) => opt.value === category);
    return option?.label || category;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl">
      <div className="flex-1 p-6">
        <div className="flex flex-col gap-6 max-w-2xl">
          <div className="flex flex-col gap-4">
            <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 2 }}>
              Informações do Modelo
            </Typography>
            <TextField
              label="Nome do Modelo"
              {...register('name')}
              required
              disabled={viewOnly}
              InputLabelProps={viewOnly ? { shrink: true } : undefined}
              error={!!formState.errors.name}
              helperText={getHelperText(formState.errors.name)}
              fullWidth
              // placeholder="Ex: Mensagem de Boas-vindas"
            />

            <div className="flex gap-4">
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!formState.errors.category} sx={{ minWidth: 200 }}>
                    <InputLabel shrink>Categoria *</InputLabel>
                    <Select
                      {...field}
                      label="Categoria *"
                      displayEmpty
                      disabled={viewOnly}
                      sx={{
                        // Evita que o conteúdo (Chip) fique acinzentado quando o Select estiver desabilitado
                        '& .MuiSelect-select.Mui-disabled': {
                          WebkitTextFillColor: 'unset',
                          color: 'inherit',
                          opacity: 1,
                        },
                        // Garante que o Chip mantenha suas cores
                        '& .MuiChip-root': {
                          opacity: 1,
                          filter: 'none',
                        },
                      }}
                      renderValue={(selected) => {
                        if (!selected) {
                          return <span style={{ color: theme.palette.text.secondary }}>Selecione uma categoria</span>;
                        }

                        return (
                          <Chip
                            label={getCategoryLabel(selected)}
                            size="small"
                            sx={{
                              backgroundColor: getCategoryColor(selected),
                              color: 'white',
                              fontWeight: 500,
                            }}
                          />
                        );
                      }}
                    >
                      {categoryOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Chip
                              label={option.label}
                              size="small"
                              sx={{
                                backgroundColor: option.color,
                                color: 'white',
                                fontWeight: 500,
                              }}
                            />
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                    {formState.errors.category && <FormHelperText>{getHelperText(formState.errors.category)}</FormHelperText>}
                  </FormControl>
                )}
              />

              <Controller
                name="enable"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    disabled={viewOnly}
                    control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} color="primary" />}
                    label="Ativo"
                    sx={{ minWidth: 150 }}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 2 }}>
              Conteúdo da Mensagem
            </Typography>

            <TextField
              label="Mensagem"
              {...register('message')}
              disabled={viewOnly}
              required
              InputLabelProps={viewOnly ? { shrink: true } : undefined}
              error={!!formState.errors.message}
              helperText={getHelperText(formState.errors.message) || 'Digite o conteúdo da mensagem que será enviada'}
              fullWidth
              multiline
              minRows={6}
              maxRows={12}
            />
          </div>

          <Box
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.info.light,
              p: 3,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.mode === 'dark' ? theme.palette.info.light : theme.palette.info.dark,
                mb: 2,
                fontWeight: 600,
              }}
            >
              Sobre as Categorias:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="Marketing" size="small" sx={{ backgroundColor: '#4CAF50', color: 'white', fontSize: '11px' }} />
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? theme.palette.info.light : theme.palette.info.dark }}>
                  Promoções, ofertas, campanhas publicitárias, newsletters
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label="Utilidade" size="small" sx={{ backgroundColor: '#FF9800', color: 'white', fontSize: '11px' }} />
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? theme.palette.info.light : theme.palette.info.dark }}>
                  Notificações, lembretes, atualizações de status, informações gerais
                </Typography>
              </Box>
            </Box>
          </Box>
        </div>
      </div>

      <div className="lg:w-96 lg:sticky lg:top-6 lg:self-start">
        <div className="mb-4">
          <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 1 }}>
            Preview da Mensagem
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Veja como sua mensagem aparecerá no WhatsApp
          </Typography>
        </div>
        <WhatsAppPreview message={messageContent} />
      </div>
    </div>
  );
}

export default MessageTemplateForm;
