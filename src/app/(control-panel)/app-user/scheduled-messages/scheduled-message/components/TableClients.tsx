import { Box, Paper, Tooltip, Typography } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DefaultTable from '@/components/DefaultTable';
import { useEffect, useState } from 'react';
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import { RecipientsType, useGetRecipientsQuery } from '../../scheduledMessagesApi';
import { useFormContext } from 'react-hook-form';
import { phoneToRemoteJid } from '@/utils/remoteJidToPhone';
import { useParams } from 'react-router';

/**
 * The Clients.
 */

interface TableClientsProps {
  changeRecipients: (change: boolean) => void;
  page: number;
  setPage: (page: number) => void;
}

function TableClients({ changeRecipients, page, setPage }: TableClientsProps) {
  const { uid } = useParams();
  const { setValue, getValues } = useFormContext();
  const [clients, setClients] = useState<RecipientsType[]>([]);

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
  const { data, isLoading: isLoadingClients } = useGetRecipientsQuery(`clients=true&page=${page}&search=${search}&message=${uid}`, {
    refetchOnMountOrArgChange: true,
  });

  // Sempre que data mudar, atualizar selectedsRecipients mantendo os antigos e adicionando novos ativos sem duplicar
  useEffect(() => {
    if (data?.data?.length > 0) {
      setClients(data.data);

      // Obter selectedsRecipients atuais
      const currentSelectedRecipients = getValues('selectedsRecipients') || [];

      // Filtrar apenas clients que têm scheduledMessageRecipients preenchido (ativos)
      const activeClients = data.data.filter((client) => client?.scheduledMessageRecipients && client.scheduledMessageRecipients.length > 0);

      // Mapear para o formato esperado em selectedsRecipients
      const activeRecipientsToAdd = activeClients.map((client) => ({
        remoteJid: client.clientProfile.phone ? phoneToRemoteJid(client.clientProfile.phone) : client.clientProfile.phone || '',
        name: client.clientProfile.name || '',
        clientUid: client.uid,
      }));

      // Filtrar novos recipients que ainda não estão em selectedsRecipients
      const newActiveRecipients = activeRecipientsToAdd.filter(
        (newRecipient) =>
          !currentSelectedRecipients.some(
            (existing) => existing.clientUid === newRecipient.clientUid || existing.remoteJid === newRecipient.remoteJid,
          ),
      );

      // Combinar antigos com novos (se houver novos)
      if (newActiveRecipients.length > 0) {
        setValue('selectedsRecipients', [...currentSelectedRecipients, ...newActiveRecipients]);
      }
    }
  }, [data, setValue, getValues]);

  // Função para ativar/desativar
  function handleToggleEnableClient(uid: string) {
    const clientFind = clients.find((client) => client.uid === uid);

    if (!clientFind) return;

    // Verifica se o client já está ativo (tem scheduledMessageRecipients)
    const isActive = clientFind.scheduledMessageRecipients && clientFind.scheduledMessageRecipients.length > 0;

    if (isActive) {
      // DESATIVAR: Remover da scheduledMessageRecipients e lidar com removedRecipients/newRecipients
      setClients((prev) => prev.map((client) => (client.uid === uid ? { ...client, scheduledMessageRecipients: [] } : client)));

      // Obter valores atuais
      const currentNewRecipients = getValues('newRecipients') || [];
      const currentRemovedRecipients = getValues('removedRecipients') || [];

      // Remover de newRecipients se estiver lá
      const updatedNewRecipients = currentNewRecipients.filter((recipient) => recipient.clientUid !== uid);
      setValue('newRecipients', updatedNewRecipients);

      // Adicionar a removedRecipients se não estiver lá
      const recipientUid = clientFind.scheduledMessageRecipients?.[0]?.uid;

      if (recipientUid && !currentRemovedRecipients.includes(recipientUid)) {
        setValue('removedRecipients', [...currentRemovedRecipients, recipientUid]);
      }

      // Atualizar contador
      const currentCount = getValues('clientsRecipientsCount') || 0;
      setValue('clientsRecipientsCount', Math.max(0, currentCount - 1));
    } else {
      // ATIVAR: Adicionar scheduledMessageRecipients e lidar com newRecipients/removedRecipients
      setClients((prev) => prev.map((client) => (client.uid === uid ? { ...client, scheduledMessageRecipients: [{ uid }] } : client)));

      // Obter valores atuais
      const currentNewRecipients = getValues('newRecipients') || [];
      const currentRemovedRecipients = getValues('removedRecipients') || [];

      // Remover de removedRecipients se estiver lá
      setValue(
        'removedRecipients',
        currentRemovedRecipients.filter((recipientUid) => recipientUid !== uid),
      );

      // Adicionar a newRecipients se não estiver lá
      const clientToAdd = {
        remoteJid: clientFind.clientProfile.phone ? phoneToRemoteJid(clientFind.clientProfile.phone) : clientFind.clientProfile.phone || '',
        name: clientFind.clientProfile.name || '',
        clientUid: clientFind.uid,
      };

      const alreadyInNew = currentNewRecipients.some((recipient) => recipient.clientUid === uid);

      if (!alreadyInNew) {
        setValue('newRecipients', [...currentNewRecipients, clientToAdd]);
      }

      // Atualizar contador
      const currentCount = getValues('clientsRecipientsCount') || 0;
      setValue('clientsRecipientsCount', currentCount + 1);
    }

    setValue('recipientsUpdate', true);
    changeRecipients(true);
  }

  const columns = [
    {
      id: 'clientProfile.name',
      accessorKey: 'clientProfile.name',
      header: 'Nome',
      size: 250,
    },
    {
      id: 'clientProfile.phone',
      accessorKey: 'clientProfile.phone',
      header: 'Telefone',
      size: 250,
    },
    {
      id: 'clientProfile.email',
      accessorKey: 'clientProfile.email',
      header: 'E-mail',
      size: 250,
    },
    {
      id: 'enable',
      accessorKey: 'enable',
      header: 'Status do cliente',
      size: 250,
      accessorFn: (row) => (
        <Chip
          label={row?.enable ? 'Ativo' : 'Inativo'}
          color={row?.enable ? 'success' : 'error'}
          size="small"
          icon={row?.enable ? <CheckCircleOutlineIcon /> : <BlockIcon />}
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      id: 'action',
      accessorKey: 'action',
      header: 'Adicionar/Remover',
      accessorFn: (row) => (
        <Box>
          {/* <ButtonBase
            sx={{ color: 'primary.main', padding: '5px', borderRadius: '5px' }}
            onClick={() => navigate(`/clients/${row.uid}`, { state: { isView: true } })}
          >
            <Tooltip title="Visualizar">
              <VisibilityOutlinedIcon fontSize="medium" color="primary" />
            </Tooltip>
          </ButtonBase> */}
          <Tooltip title={row?.scheduledMessageRecipients && row.scheduledMessageRecipients.length > 0 ? 'Remover da lista' : 'Adicionar à lista'}>
            <Switch
              checked={row?.scheduledMessageRecipients && row.scheduledMessageRecipients.length > 0}
              color={row?.scheduledMessageRecipients && row.scheduledMessageRecipients.length > 0 ? 'success' : 'error'}
              onChange={() => handleToggleEnableClient(row?.uid)}
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
        Clientes - {getValues('clientsRecipientsCount')} participando
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
        {!isLoadingClients && (
          <DefaultTable
            data={clients || []}
            columns={columns}
            page={page}
            totalPages={data?.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            globalFilter={search}
            onGlobalFilterChange={setSearch}
          />
        )}
      </Box>
    </Paper>
  );
}

export default TableClients;
