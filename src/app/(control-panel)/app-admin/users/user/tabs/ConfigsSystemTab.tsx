import { Box, Typography, Button, IconButton, Paper, Divider, Alert, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import { useCreateConfigMutation, useGetConfigsQuery, useDeleteConfigMutation } from '@/store/api/configsApi';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from '@/store/hooks';
import { useParams } from 'react-router';

interface Flow {
  id: string;
  name: string;
  configUid?: string;
  markedForDeletion?: boolean;
}

interface GoogleCalendar {
  value: string;
  name: string;
  configUid?: string;
}

function ConfigsSystemTab() {
  const [flows, setFlows] = useState<Flow[]>([{ id: '', name: '' }]);
  const [googleCalendar, setGoogleCalendar] = useState<GoogleCalendar>({ value: '', name: '' });
  const [flowsToDelete, setFlowsToDelete] = useState<string[]>([]);
  const [googleCalendarToDelete, setGoogleCalendarToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [deletingFlowIndex, setDeletingFlowIndex] = useState<number | null>(null);
  const [deletingGoogleCalendar, setDeletingGoogleCalendar] = useState(false);
  const dispatch = useAppDispatch();
  const { uid } = useParams();
  
  const [createConfig, { isLoading: isCreating }] = useCreateConfigMutation();
  const [deleteConfig, { isLoading: isDeleting }] = useDeleteConfigMutation();
  const { data: config, isLoading, refetch } = useGetConfigsQuery(`uid=${uid}`, { 
    refetchOnMountOrArgChange: true 
  });

  useEffect(() => {
    if (config) {
      const existingFlows = config.data
        .filter((conf) => conf.key === 'FLOW')
        .map((flow) => ({
          id: flow.value,
          name: flow.name,
          configUid: flow.uid,
        }));

      setFlows(existingFlows.length > 0 ? existingFlows : [{ id: '', name: '' }]);

      const calendarConfig = config.data.find((conf) => conf.key === 'GOOGLE-CALENDAR-WEBHOOK');
      if (calendarConfig) {
        setGoogleCalendar({
          value: calendarConfig.value,
          name: calendarConfig.name,
          configUid: calendarConfig.uid,
        });
      }

      setFlowsToDelete([]);
      setGoogleCalendarToDelete(null);
    }
  }, [config]);

  const handleAddFlow = () => {
    setFlows([...flows, { id: '', name: '' }]);
    setHasUnsavedChanges(true);
  };

  const handleFlowChange = (index: number, field: keyof Flow, value: string) => {
    const newFlows = flows.map((flow, i) => 
      i === index ? { ...flow, [field]: value } : flow
    );
    setFlows(newFlows);
    setHasUnsavedChanges(true);
  };

  const handleDeleteFlow = (index: number) => {
    setDeletingFlowIndex(index);
    
    const flowToDelete = flows[index];

    if (flowToDelete.configUid) {
      setFlowsToDelete(prev => [...prev, flowToDelete.configUid!]);
    }

    const newFlows = flows.filter((_, i) => i !== index);
    setFlows(newFlows.length > 0 ? newFlows : [{ id: '', name: '' }]);
    setHasUnsavedChanges(true);
    
    setTimeout(() => setDeletingFlowIndex(null), 300);
  };

  const handleGoogleCalendarChange = (field: keyof GoogleCalendar, value: string) => {
    setGoogleCalendar({ ...googleCalendar, [field]: value });
    setHasUnsavedChanges(true);
  };

  const handleDeleteGoogleCalendar = () => {
    setDeletingGoogleCalendar(true);
    
    if (googleCalendar.configUid) {
      setGoogleCalendarToDelete(googleCalendar.configUid);
    }
    
    setGoogleCalendar({ value: '', name: '' });
    setHasUnsavedChanges(true);
    
    setTimeout(() => setDeletingGoogleCalendar(false), 300);
  };

  const validateFlows = (): boolean => {
    const validFlows = flows.filter(flow => flow.name.trim() || flow.id.trim());
    
    for (const flow of validFlows) {
      if (!flow.name.trim() || !flow.id.trim()) {
        dispatch(
          showMessage({
            message: 'Todos os fluxos devem ter nome e ID preenchidos',
            autoHideDuration: 3000,
            variant: 'warning',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          })
        );
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateFlows()) return;

    setIsSaving(true);

    try {
      for (const configUid of flowsToDelete) {
        try {
          await deleteConfig({ uid: configUid }).unwrap();
        } catch (error: any) {
          dispatch(
            showMessage({
              message: error?.data?.msg || 'Erro ao remover fluxo',
              autoHideDuration: 3000,
              variant: 'error',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
            })
          );
          setIsSaving(false);
          return;
        }
      }

      if (googleCalendarToDelete) {
        try {
          await deleteConfig({ uid: googleCalendarToDelete }).unwrap();
        } catch (error: any) {
          dispatch(
            showMessage({
              message: error?.data?.msg || 'Erro ao remover Google Calendar',
              autoHideDuration: 3000,
              variant: 'error',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
            })
          );
          setIsSaving(false);
          return;
        }
      }

      if (googleCalendar.name?.trim() && googleCalendar.value?.trim()) {
        if (!googleCalendar.configUid) {
          await createConfig({
            name: googleCalendar.name,
            key: 'GOOGLE-CALENDAR-WEBHOOK',
            value: googleCalendar.value,
            data: null,
            uid,
          }).unwrap();
        }
      }

      const flowsToSave = flows.filter(
        flow => flow.name.trim() && flow.id.trim() && !flow.configUid
      );

      for (const flow of flowsToSave) {
        await createConfig({
          name: flow.name,
          key: 'FLOW',
          value: flow.id,
          data: null,
          uid,
        }).unwrap();
      }

      setFlowsToDelete([]);
      setGoogleCalendarToDelete(null);
      await refetch();
      setHasUnsavedChanges(false);
      
      dispatch(
        showMessage({
          message: 'Configurações salvas com sucesso',
          autoHideDuration: 3000,
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        })
      );
    } catch (error: any) {
      dispatch(
        showMessage({
          message: error?.data?.msg || 'Erro ao salvar as configurações',
          autoHideDuration: 3000,
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        })
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isOperationInProgress = isSaving || isCreating || isDeleting;

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-[400px]">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="flex flex-col gap-6 max-w-3xl">
      <Box>
        <Typography variant="h5" gutterBottom fontWeight="600">
          Configurações do Sistema
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure os fluxos e integrações do sistema
        </Typography>
      </Box>

      {hasUnsavedChanges && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Você tem alterações não salvas
        </Alert>
      )}

      {flowsToDelete.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {flowsToDelete.length} fluxo(s) será(ão) excluído(s) quando você salvar as configurações
        </Alert>
      )}

      {googleCalendarToDelete && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Google Calendar será excluído quando você salvar as configurações
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box className="flex items-center justify-between mb-4">
          <Box>
            <Typography variant="h6" fontWeight="600">
              Fluxos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gerencie os fluxos de automação
            </Typography>
          </Box>
          <Button 
            startIcon={<AddIcon />} 
            onClick={handleAddFlow} 
            variant="outlined" 
            size="small"
            disabled={isOperationInProgress}
          >
            Adicionar
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box className="flex flex-col gap-3">
          {flows.map((flow, index) => (
            <Paper 
              key={index} 
              variant="outlined" 
              sx={{ p: 2, bgcolor: 'background.default' }}
            >
              <Box className="flex gap-3 items-start">
                <TextField
                  label="Nome do Fluxo"
                  value={flow.name}
                  onChange={(e) => handleFlowChange(index, 'name', e.target.value)}
                  size="small"
                  fullWidth
                  required
                  disabled={isOperationInProgress}
                  placeholder="Ex: Fluxo de Boas-vindas"
                />
                <TextField
                  label="ID do Fluxo"
                  value={flow.id}
                  onChange={(e) => handleFlowChange(index, 'id', e.target.value)}
                  size="small"
                  fullWidth
                  required
                  disabled={isOperationInProgress}
                  placeholder="Ex: flow_123"
                />
                <IconButton
                  onClick={() => handleDeleteFlow(index)}
                  color="error"
                  disabled={flows.length === 1 && !flow.configUid || deletingFlowIndex === index}
                  sx={{ mt: 0.5 }}
                >
                  {deletingFlowIndex === index ? (
                    <CircularProgress size={20} color="error" />
                  ) : (
                    <DeleteIcon />
                  )}
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box className="mb-4">
          <Typography variant="h6" fontWeight="600">
            Google Calendar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure o webhook do Google Calendar
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box className="flex gap-3">
          <TextField
            label="Nome da Integração"
            value={googleCalendar.name}
            onChange={(e) => handleGoogleCalendarChange('name', e.target.value)}
            size="small"
            fullWidth
            disabled={isOperationInProgress}
            placeholder="Ex: Webhook Principal"
          />
          <TextField
            label="URL do Webhook"
            value={googleCalendar.value}
            onChange={(e) => handleGoogleCalendarChange('value', e.target.value)}
            size="small"
            fullWidth
            disabled={isOperationInProgress}
            placeholder="https://..."
          />
          {googleCalendar.configUid && (
            <IconButton
              onClick={handleDeleteGoogleCalendar}
              color="error"
              disabled={deletingGoogleCalendar}
              sx={{ mt: 0.5 }}
              title="Excluir Google Calendar"
            >
              {deletingGoogleCalendar ? (
                <CircularProgress size={20} color="error" />
              ) : (
                <DeleteIcon />
              )}
            </IconButton>
          )}
        </Box>
      </Paper>

      <Box className="flex gap-3">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          startIcon={isOperationInProgress ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          disabled={isOperationInProgress}
          size="large"
        >
          {isOperationInProgress ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </Box>
    </Box>
  );
}

export default ConfigsSystemTab;