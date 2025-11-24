import { Box, ButtonBase, LinearProgress, styled, Tooltip, Chip } from '@mui/material';
import FusePageSimple from '@fuse/core/FusePageSimple';
import DefaultTable from '@/components/DefaultTable';
import { useNavigate } from 'react-router';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetPage, setPage } from '@/store/slices/paginationSlice';
import { useEffect, useState } from 'react';
import DefaultConfirmModal from '@/components/DefaultConfirmModal';
import { MyEventType, useGetMyEventsQuery, useConfirmParticipationMutation, useCancelParticipationMutation } from '../events/eventsApi';
import MyEventsHeader from './MyEventsHeader';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .container': {
    maxWidth: '100%!important',
  },
  '& .FusePageSimple-header': {
    backgroundColor: theme.vars.palette.background.default,
    borderStyle: 'solid',
    borderColor: theme.vars.palette.divider,
  },
}));

/**
 * The MyEvents page - Shows events user is participating in.
 */

function MyEvents() {
  const dispatch = useAppDispatch();
  const page = useAppSelector((state) => state.pagination.page);
  const navigate = useNavigate();

  // Detecta mudança de rota para resetar paginação
  useEffect(() => {
    return () => {
      const nextPath = window.location.pathname;
      const isDetail = /^\/my-events\/[\w-]+$/.test(nextPath);

      if (!isDetail) {
        dispatch(resetPage());
      }
    };
  }, [dispatch]);

  const [search, setSearch] = useState('');
  const [participationStatusFilter, setParticipationStatusFilter] = useState('');

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

  const queryString = `page=${page}&search=${search}${participationStatusFilter ? `&participationStatus=${participationStatusFilter}` : ''}`;

  const {
    data: myEvents,
    isLoading: isLoadingMyEvents,
    isFetching: isFetchingMyEvents,
    refetch: refetchMyEvents,
  } = useGetMyEventsQuery(queryString, { refetchOnMountOrArgChange: true });

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MyEventType | null>(null);

  function handleOpenConfirmModal(event: MyEventType) {
    setSelectedEvent(event);
    setOpenConfirmModal(true);
  }

  function handleOpenCancelModal(event: MyEventType) {
    setSelectedEvent(event);
    setOpenCancelModal(true);
  }

  const [confirmParticipation, { isLoading: isLoadingConfirm }] = useConfirmParticipationMutation();
  const [cancelParticipation, { isLoading: isLoadingCancel }] = useCancelParticipationMutation();

  function handleConfirmParticipation() {
    if (!selectedEvent) return;

    confirmParticipation(selectedEvent.uid)
      .unwrap()
      .then(() => {
        setSelectedEvent(null);
        refetchMyEvents();
        setOpenConfirmModal(false);

        dispatch(
          showMessage({
            message: `Participação no evento "${selectedEvent.title}" confirmada com sucesso`,
            autoHideDuration: 3000,
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          }),
        );
      })
      .catch(() => {
        setSelectedEvent(null);
        setOpenConfirmModal(false);
        dispatch(
          showMessage({
            message: `Erro ao confirmar participação no evento "${selectedEvent.title}"`,
            autoHideDuration: 3000,
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          }),
        );
      });
  }

  function handleCancelParticipation() {
    if (!selectedEvent) return;

    cancelParticipation(selectedEvent.uid)
      .unwrap()
      .then(() => {
        setSelectedEvent(null);
        refetchMyEvents();
        setOpenCancelModal(false);

        dispatch(
          showMessage({
            message: `Participação no evento "${selectedEvent.title}" cancelada com sucesso`,
            autoHideDuration: 3000,
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          }),
        );
      })
      .catch(() => {
        setSelectedEvent(null);
        setOpenCancelModal(false);
        dispatch(
          showMessage({
            message: `Erro ao cancelar participação no evento "${selectedEvent.title}"`,
            autoHideDuration: 3000,
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          }),
        );
      });
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
      case 'agendado':
        return 'info';
      case 'ongoing':
      case 'em andamento':
        return 'warning';
      case 'completed':
      case 'concluído':
        return 'success';
      case 'cancelled':
      case 'cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'Agendado';
      case 'ongoing':
        return 'Em Andamento';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getParticipationStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'declined':
        return 'error';
      default:
        return 'default';
    }
  };

  const getParticipationStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'declined':
        return 'Recusado';
      default:
        return status;
    }
  };

  const columns = [
    {
      id: 'title',
      accessorKey: 'title',
      header: 'Título',
      size: 200,
    },
    {
      id: 'startDate',
      accessorKey: 'startDate',
      header: 'Data de Início',
      size: 180,
      accessorFn: (row: MyEventType) => formatDate(row.startDate),
    },
    {
      id: 'endDate',
      accessorKey: 'endDate',
      header: 'Data de Término',
      size: 180,
      accessorFn: (row: MyEventType) => formatDate(row.endDate),
    },
    {
      id: 'location',
      accessorKey: 'location',
      header: 'Local',
      size: 150,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status do Evento',
      size: 130,
      accessorFn: (row: MyEventType) => (
        <Chip label={getStatusLabel(row.status)} color={getStatusColor(row.status)} size="small" sx={{ fontWeight: 500 }} />
      ),
    },
    {
      id: 'participationStatus',
      accessorKey: 'participation.status',
      header: 'Minha Participação',
      size: 150,
      accessorFn: (row: MyEventType) => (
        <Chip
          label={getParticipationStatusLabel(row.participation.status)}
          color={getParticipationStatusColor(row.participation.status)}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      id: 'participantCount',
      accessorKey: 'participantCount',
      header: 'Participantes',
      size: 100,
      accessorFn: (row: MyEventType) => `${row.participantCount} pessoa${row.participantCount !== 1 ? 's' : ''}`,
    },
    {
      id: 'action',
      accessorKey: 'action',
      header: 'Ações',
      size: 60,
      accessorFn: (row: MyEventType) => (
        <Box display="flex" justifyContent="space-between" alignItems="center" width="150px">
          <ButtonBase
            sx={{ color: 'primary.main', padding: '5px', borderRadius: '5px' }}
            onClick={() => navigate(`/events/${row.uid}`, { state: { isView: true } })}
          >
            <Tooltip title="Visualizar">
              <VisibilityOutlinedIcon fontSize="medium" sx={{ color: '#fff' }} />
            </Tooltip>
          </ButtonBase>

          {row.participation.status === 'pending' && (
            <ButtonBase sx={{ color: 'success.main', padding: '5px', borderRadius: '5px' }} onClick={() => handleOpenConfirmModal(row)}>
              <Tooltip title="Confirmar Participação">
                <CheckCircleOutlineIcon fontSize="medium" />
              </Tooltip>
            </ButtonBase>
          )}

          <ButtonBase sx={{ color: 'error.main', padding: '5px', borderRadius: '5px' }} onClick={() => handleOpenCancelModal(row)}>
            <Tooltip title="Cancelar Participação">
              <CancelOutlinedIcon fontSize="medium" />
            </Tooltip>
          </ButtonBase>
        </Box>
      ),
    },
  ];

  return (
    <Root
      header={
        <>
          {isFetchingMyEvents && (
            <div className="w-full">
              <LinearProgress color="secondary" />
            </div>
          )}
          {!isLoadingMyEvents && <MyEventsHeader events={myEvents?.data || []} />}
        </>
      }
      content={
        <div className="flex flex-1 flex-col overflow-x-auto overflow-y-hidden h-full">
          {!isLoadingMyEvents && (
            <>
              <DefaultTable
                data={myEvents?.data}
                columns={columns}
                page={page}
                totalPages={myEvents?.totalPages}
                onPageChange={(newPage) => dispatch(setPage(newPage))}
                globalFilter={search}
                onGlobalFilterChange={setSearch}
              />
              <DefaultConfirmModal
                onCancel={() => setOpenConfirmModal(false)}
                onConfirm={handleConfirmParticipation}
                open={openConfirmModal}
                title="Confirmar Participação"
                message={`Deseja confirmar sua participação no evento "${selectedEvent?.title}"?`}
                confirmText="Confirmar"
                cancelText="Cancelar"
                confirmColor="success"
                loading={isLoadingConfirm}
              />
              <DefaultConfirmModal
                onCancel={() => setOpenCancelModal(false)}
                onConfirm={handleCancelParticipation}
                open={openCancelModal}
                title="Cancelar Participação"
                message={`Tem certeza que deseja cancelar sua participação no evento "${selectedEvent?.title}"?`}
                confirmText="Cancelar Participação"
                cancelText="Voltar"
                confirmColor="error"
                loading={isLoadingCancel}
              />
            </>
          )}
        </div>
      }
    />
  );
}

export default MyEvents;
