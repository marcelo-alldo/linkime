import { Box, Chip, Paper, Switch, Tooltip, Typography } from '@mui/material';
import DefaultTable from '@/components/DefaultTable';
import { useEffect, useState } from 'react';
import { useGetRecipientsQuery } from '../../scheduledMessagesApi';
import { useFormContext } from 'react-hook-form';
import { phoneToRemoteJid } from '@/utils/remoteJidToPhone';
import { useParams } from 'react-router';
import { LeadType } from '@/store/api/leadsApi';

/**
 * The leads.
 */
interface TableLeadsProps {
  changeRecipients: (change: boolean) => void;
  page: number;
  setPage: (page: number) => void;
}

function TableLeads({ changeRecipients, page, setPage }: TableLeadsProps) {
  const { uid } = useParams();
  const { setValue, getValues } = useFormContext();
  const [leads, setLeads] = useState([]);

  const [search, setSearch] = useState('');

  // Atualiza a query string ao pesquisar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [search]);

  // Usa o search na query da API

  const { data, isLoading: isLoadingLeads } = useGetRecipientsQuery(`leads=true&page=${page}&search=${search}&message=${uid}`, {
    refetchOnMountOrArgChange: true,
  });

  // Sempre que data mudar, atualizar selectedsRecipients mantendo os antigos e adicionando novos ativos sem duplicar
  useEffect(() => {
    if (data?.data) {
      setLeads(data.data);

      if (data.data.length > 0) {
        // Obter selectedsRecipients atuais
        const currentSelectedRecipients = getValues('selectedsRecipients') || [];

        // Filtrar apenas leads que têm scheduledMessageRecipients preenchido (ativos)
        const activeLeads = data.data.filter((lead) => lead?.scheduledMessageRecipients && lead.scheduledMessageRecipients.length > 0);

        // Mapear para o formato esperado em selectedsRecipients
        const activeRecipientsToAdd = activeLeads.map((lead) => ({
          remoteJid: lead.phone ? phoneToRemoteJid(lead.phone) : lead.phone || '',
          name: lead.name || '',
          leadUid: lead.uid,
        }));

        // Filtrar novos recipients que ainda não estão em selectedsRecipients
        const newActiveRecipients = activeRecipientsToAdd.filter(
          (newRecipient) =>
            !currentSelectedRecipients.some((existing) => existing.leadUid === newRecipient.leadUid || existing.remoteJid === newRecipient.remoteJid),
        );

        // Combinar antigos com novos (se houver novos)
        if (newActiveRecipients.length > 0) {
          setValue('selectedsRecipients', [...currentSelectedRecipients, ...newActiveRecipients]);
        }
      }
    }
  }, [data, setValue, getValues, isLoadingLeads]);

  // Função para ativar/desativar
  function handleToggleEnableLead(uid: string) {
    const leadFind = leads.find((lead) => lead.uid === uid);

    if (!leadFind) return;

    // Verifica se o lead já está ativo (tem scheduledMessageRecipients)
    const isActive = leadFind.scheduledMessageRecipients && leadFind.scheduledMessageRecipients.length > 0;

    if (isActive) {
      // DESATIVAR: Remover da scheduledMessageRecipients e lidar com removedRecipients/newRecipients
      setLeads((prev) => prev.map((lead) => (lead.uid === uid ? { ...lead, scheduledMessageRecipients: [] } : lead)));

      // Obter valores atuais
      const currentNewRecipients = getValues('newRecipients') || [];
      const currentRemovedRecipients = getValues('removedRecipients') || [];

      // Remover de newRecipients se estiver lá
      const updatedNewRecipients = currentNewRecipients.filter((recipient) => recipient.leadUid !== uid);
      setValue('newRecipients', updatedNewRecipients);

      // Adicionar a removedRecipients se não estiver lá
      const recipientUid = leadFind.scheduledMessageRecipients?.[0]?.uid;

      if (recipientUid && !currentRemovedRecipients.includes(recipientUid)) {
        setValue('removedRecipients', [...currentRemovedRecipients, recipientUid]);
      }

      // Atualizar contador
      const currentCount = getValues('leadsRecipientsCount') || 0;
      setValue('leadsRecipientsCount', Math.max(0, currentCount - 1));
    } else {
      // ATIVAR: Adicionar scheduledMessageRecipients e lidar com newRecipients/removedRecipients
      setLeads((prev) => prev.map((lead) => (lead.uid === uid ? { ...lead, scheduledMessageRecipients: [{ uid }] } : lead)));

      // Obter valores atuais
      const currentNewRecipients = getValues('newRecipients') || [];
      const currentRemovedRecipients = getValues('removedRecipients') || [];

      // Remover de removedRecipients se estiver lá
      setValue(
        'removedRecipients',
        currentRemovedRecipients.filter((recipientUid) => recipientUid !== uid),
      );

      // Adicionar a newRecipients se não estiver lá
      const leadToAdd = {
        remoteJid: leadFind.phone ? phoneToRemoteJid(leadFind.phone) : leadFind.phone || '',
        name: leadFind.name || '',
        leadUid: leadFind.uid,
      };

      const alreadyInNew = currentNewRecipients.some((recipient) => recipient.leadUid === uid);

      if (!alreadyInNew) {
        setValue('newRecipients', [...currentNewRecipients, leadToAdd]);
      }

      // Atualizar contador
      const currentCount = getValues('leadsRecipientsCount') || 0;
      setValue('leadsRecipientsCount', currentCount + 1);
    }

    setValue('recipientsUpdate', true);
    changeRecipients(true);
  }

  const columns = [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Nome',
      size: 450,
    },
    {
      id: 'phone',
      accessorKey: 'phone',
      header: 'Telefone',
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: 'E-mail',
    },
    {
      id: 'alldo-service',
      accessorFn: (row) => {
        const stepUid = row.step?.uid;

        if (stepUid === import.meta.env.VITE_APP_START_CONVERSATION_UID) {
          return (
            <Box display="flex" justifyContent="space-between">
              <Chip
                label={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src="/assets/images/logo/alldo-sem-fundo-face.png" alt="logo Alldo" width={20} style={{ display: 'block' }} />
                    <span>Em atendimento</span>
                  </div>
                }
                color="secondary"
                variant="filled"
                size="small"
              />
            </Box>
          );
        }

        return (
          <Box display="flex" justifyContent="space-between" width="70px">
            <Chip label="Não" color="default" variant="outlined" size="small" />
          </Box>
        );
      },
      header: 'Atendimento Alldo',
      size: 250,
    },
    {
      id: 'action',
      accessorKey: 'action',
      header: 'Adicionar/Remover',
      accessorFn: (row) => (
        <Box>
          {/* <ButtonBase
            sx={{ color: 'primary.main', padding: '5px', borderRadius: '5px' }}
            onClick={() => navigate(`/leads/${row.uid}`, { state: { isView: true } })}
          >
            <Tooltip title="Visualizar">
              <VisibilityOutlinedIcon fontSize="medium" color="primary" />
            </Tooltip>
          </ButtonBase> */}
          <Tooltip title={row?.scheduledMessageRecipients && row.scheduledMessageRecipients.length > 0 ? 'Remover da lista' : 'Adicionar à lista'}>
            <Switch
              checked={row?.scheduledMessageRecipients && row.scheduledMessageRecipients.length > 0}
              color={row?.scheduledMessageRecipients && row.scheduledMessageRecipients.length > 0 ? 'success' : 'error'}
              onChange={() => handleToggleEnableLead(row?.uid)}
              inputProps={{ 'aria-label': row?.enable ? 'Remover' : 'Adicionar' }}
              size="small"
            />
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Paper className="w-full h-full flex flex-col p-2">
      <Typography variant="h6" className="p-4">
        Leads - {getValues('leadsRecipientsCount')} participando
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          overflowX: 'auto',
          overflowY: 'hidden',
          height: '100%',
          backgroundColor: 'background.default',
        }}
      >
        {!isLoadingLeads && (
          <>
            <DefaultTable
              data={leads || []}
              columns={columns}
              page={page}
              totalPages={data?.totalPages || 0}
              onPageChange={(newPage) => setPage(newPage)}
              globalFilter={search}
              onGlobalFilterChange={setSearch}
            />
          </>
        )}
      </Box>
    </Paper>
  );
}

export default TableLeads;
