import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  List,
  ListItem,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { selectQuickPanelOpen, toggleQuickPanel } from './quickPanelSlice';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useCreateReminderMutation, useDeleteReminderMutation, useGetRemindersQuery, useUpdateReminderMutation } from '@/store/api/remindersApi';
import type { Reminder as ReminderType } from '@/store/api/remindersApi';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import ReminderCardItem from './components/ReminderCardItem';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(() => ({
  '& .MuiDrawer-paper': {
    width: 320,
  },
}));

function QuickPanel() {
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectQuickPanelOpen);
  const [createReminder, { isLoading }] = useCreateReminderMutation();
  const [deleteReminder, { isLoading: isDeleting }] = useDeleteReminderMutation();
  const [updateReminder, { isLoading: isUpdating }] = useUpdateReminderMutation();
  const {
    data: remindersData,
    refetch: refetchReminders,
    isLoading: isLoadingReminders,
  } = useGetRemindersQuery({
    limit: 10,
    page: 1,
  });

  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<ReminderType | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    date: z.date(),
    time: z.date(),
    priority: z.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, dirtyFields, isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      date: new Date(),
      time: new Date(),
      priority: 'MEDIUM',
    },
    mode: 'onChange',
  });

  const handleCloseModal = () => {
    reset();
    setOpenModal(false);
    setIsEditing(false);
    setSelectedReminder(null);
  };

  const handleDeleteReminder = async (uid: string) => {
    setDeletingId(uid);
    try {
      await deleteReminder(uid).unwrap();
      dispatch(
        showMessage({
          message: 'Lembrete deletado com sucesso!',
          autoHideDuration: 3000,
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        }),
      );
    } catch (error) {
      dispatch(
        showMessage({
          message: error?.data?.msg || 'Erro ao deletar lembrete',
          autoHideDuration: 3000,
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        }),
      );
    } finally {
      setDeletingId(null);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const combinedDateTime = new Date(
        data.date.getFullYear(),
        data.date.getMonth(),
        data.date.getDate(),
        data.time.getHours(),
        data.time.getMinutes(),
        data.time.getSeconds(),
      );

      const isoDateTime = combinedDateTime.toISOString();
      if (isEditing && selectedReminder) {
        await updateReminder({
          uid: (selectedReminder.uid ?? selectedReminder.id) as string,
          title: data.title,
          description: data.description,
          dateTime: isoDateTime,
          priority: data.priority,
          notified: false,
        }).unwrap();

        dispatch(
          showMessage({
            message: 'Lembrete atualizado com sucesso!',
            autoHideDuration: 3000,
            variant: 'success',
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          }),
        );
      } else {
        await createReminder({
          title: data.title,
          description: data.description,
          dateTime: isoDateTime,
          priority: data.priority,
        }).unwrap();

        dispatch(
          showMessage({
            message: 'Lembrete criado com sucesso!',
            autoHideDuration: 3000,
            variant: 'success',
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          }),
        );
      }

      refetchReminders();
      handleCloseModal();
    } catch (error) {
      dispatch(
        showMessage({
          message: error?.data?.msg || (isEditing ? 'Erro ao atualizar lembrete' : 'Erro ao criar lembrete'),
          autoHideDuration: 3000,
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        }),
      );
    }
  };

  const reminders = Array.isArray(remindersData?.data) ? (remindersData?.data as any) : (remindersData?.data?.reminders as any) || [];

  const handleEditReminder = (reminder: ReminderType) => {
    setSelectedReminder(reminder);
    setIsEditing(true);
    const dt = new Date(reminder.dateTime);
    reset({
      title: reminder.title,
      description: reminder.description || '',
      date: dt,
      time: dt,
      priority: (reminder.priority as any) || 'MEDIUM',
    });
    setOpenModal(true);
  };

  return (
    <StyledSwipeableDrawer open={open} anchor="right" onOpen={() => {}} onClose={() => dispatch(toggleQuickPanel())} disableSwipeToOpen>
      <FuseScrollbars>
        <ListSubheader component="div">Hoje</ListSubheader>

        <div className="mb-0 px-6 py-4">
          <Typography className="mb-3 text-5xl" color="text.secondary">
            {format(new Date(), 'eeee', { locale: ptBR })}
          </Typography>
          <div className="flex">
            <Typography className="text-5xl leading-none mr-2" color="text.secondary">
              {format(new Date(), 'dd')}
            </Typography>

            <Typography className="text-5xl leading-none" color="text.secondary">
              {format(new Date(), 'MMMM', { locale: ptBR })}
            </Typography>
          </div>
        </div>
        <Divider />

        <Box sx={{ p: 2, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              Lembretes ({reminders.length})
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                reset({
                  title: '',
                  description: '',
                  date: new Date(),
                  time: new Date(),
                  priority: 'MEDIUM',
                });
                setIsEditing(false);
                setSelectedReminder(null);
                setOpenModal(true);
              }}
            >
              Adicionar
            </Button>
          </Box>

          {isLoadingReminders ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 200,
              }}
            >
              <CircularProgress />
            </Box>
          ) : reminders.length === 0 ? (
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 2,
                backgroundColor: 'grey.50',
              }}
            >
              <Typography color="text.secondary">Nenhum lembrete encontrado</Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 1 }}
                onClick={() => {
                  reset({
                    title: '',
                    description: '',
                    date: new Date(),
                    time: new Date(),
                    priority: 'MEDIUM',
                  });
                  setIsEditing(false);
                  setSelectedReminder(null);
                  setOpenModal(true);
                }}
              >
                Criar primeiro lembrete
              </Button>
            </Paper>
          ) : (
            <List sx={{ py: 0 }}>
              {reminders.map((reminder) => (
                <ListItem key={reminder.uid ?? reminder.id} sx={{ px: 0, py: 0.5, position: 'relative' }}>
                  <ReminderCardItem
                    reminder={reminder}
                    onDelete={handleDeleteReminder}
                    isDeleting={deletingId === (reminder.uid ?? reminder.id)}
                    onEdit={handleEditReminder}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </FuseScrollbars>

      <Dialog
        open={openModal}
        onClose={!isLoading && !isUpdating ? handleCloseModal : undefined}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1,
            boxShadow: 8,
            position: 'relative',
            zIndex: 1300,
          },
        }}
      >
        <Backdrop
          sx={{
            position: 'absolute',
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: 4,
          }}
          open={isLoading || isUpdating}
        >
          <CircularProgress />
        </Backdrop>
        <Paper elevation={0} sx={{ p: 2, borderRadius: 4 }}>
          <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem', pb: 1 }}>{isEditing ? 'Editar lembrete' : 'Adicionar lembrete'}</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent sx={{ pt: 1 }}>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Título"
                  fullWidth
                  required
                  {...register('title')}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  disabled={isLoading || isUpdating}
                />

                <TextField
                  label="Descrição"
                  fullWidth
                  multiline
                  minRows={3}
                  {...register('description')}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={isLoading || isUpdating}
                />

                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={ptBR}
                  dateFormats={{
                    monthAndYear: 'LLLL yyyy',
                    year: 'yyyy',
                  }}
                >
                  <Box display="flex" gap={2}>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="Data"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          format="dd/MM/yyyy"
                          disabled={isLoading || isUpdating}
                          slotProps={{
                            popper: {
                              sx: {
                                zIndex: 9999,
                              },
                            },
                            dialog: {
                              sx: {
                                '& .MuiDialog-paper': {
                                  zIndex: 9999,
                                },
                              },
                            },
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="time"
                      control={control}
                      render={({ field }) => (
                        <TimePicker
                          label="Hora"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          ampm={false}
                          views={['hours', 'minutes']}
                          timeSteps={{ minutes: 1 }}
                          disabled={isLoading || isUpdating}
                          slotProps={{
                            popper: {
                              sx: {
                                zIndex: 9999,
                              },
                            },
                            dialog: {
                              sx: {
                                '& .MuiDialog-paper': {
                                  zIndex: 9999,
                                },
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                </LocalizationProvider>

                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth disabled={isLoading || isUpdating}>
                      <InputLabel id="priority-label">Prioridade</InputLabel>
                      <Select labelId="priority-label" label="Prioridade" {...field} value={field.value}>
                        <MenuItem value="NONE">Nenhum</MenuItem>
                        <MenuItem value="LOW">Baixo</MenuItem>
                        <MenuItem value="MEDIUM">Médio</MenuItem>
                        <MenuItem value="HIGH">Alto</MenuItem>
                        <MenuItem value="URGENT">Urgente</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseModal} disabled={isLoading || isUpdating}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={!isValid || Object.keys(dirtyFields).length === 0 || isLoading || isUpdating}
                startIcon={isLoading || isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isEditing ? (isUpdating ? 'Atualizando...' : 'Atualizar') : isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogActions>
          </form>
        </Paper>
      </Dialog>
    </StyledSwipeableDrawer>
  );
}

export default QuickPanel;
