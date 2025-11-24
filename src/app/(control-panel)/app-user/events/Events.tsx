import { Box, ButtonBase, LinearProgress, styled, Tooltip, Chip } from '@mui/material';
import FusePageSimple from '@fuse/core/FusePageSimple';
import DefaultTable from '@/components/DefaultTable';
import { useNavigate } from 'react-router';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetPage, setPage } from '@/store/slices/paginationSlice';
import { useEffect, useState } from 'react';
import DefaultConfirmModal from '@/components/DefaultConfirmModal';
import { EventType, useGetEventsQuery, useDeleteEventMutation } from './eventsApi';
import EventsHeader from './EventsHeader';
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
 * The Events page.
 */

function Events() {
  const dispatch = useAppDispatch();
  const page = useAppSelector((state) => state.pagination.page);
  const navigate = useNavigate();

  // Detecta mudança de rota para resetar paginação
  useEffect(() => {
    return () => {
      const nextPath = window.location.pathname;
      const isDetail = /^\/events\/[\w-]+$/.test(nextPath);

      if (!isDetail) {
        dispatch(resetPage());
      }
    };
  }, [dispatch]);

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

  const {
    data: events,
    isLoading: isLoadingEvents,
    isFetching: isFetchingEvents,
    refetch: refetchEvents,
  } = useGetEventsQuery(`page=${page}&search=${search}`, { refetchOnMountOrArgChange: true });

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

  function handleOpenConfirmModal(event: EventType) {
    setSelectedEvent(event);
    setOpenConfirmModal(true);
  }

  const [deleteEvent, { isLoading: isLoadingDelete }] = useDeleteEventMutation();

  function handleDeleteEvent() {
    if (!selectedEvent) return;

    deleteEvent(selectedEvent.uid)
      .unwrap()
      .then(() => {
        setSelectedEvent(null);
        refetchEvents();
        setOpenConfirmModal(false);

        dispatch(
          showMessage({
            message: `Evento "${selectedEvent.title}" excluído com sucesso`,
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
            message: `Erro ao excluir o evento "${selectedEvent.title}"`,
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

  const columns = [
    {
      id: 'title',
      accessorKey: 'title',
      header: 'Título',
      size: 250,
    },
    {
      id: 'startDate',
      accessorKey: 'startDate',
      header: 'Data de Início',
      size: 200,
      accessorFn: (row: EventType) => formatDate(row.startDate),
    },
    {
      id: 'endDate',
      accessorKey: 'endDate',
      header: 'Data de Término',
      size: 200,
      accessorFn: (row: EventType) => formatDate(row.endDate),
    },
    {
      id: 'location',
      accessorKey: 'location',
      header: 'Local',
      size: 200,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      size: 150,
      accessorFn: (row: EventType) => (
        <Chip label={getStatusLabel(row.status)} color={getStatusColor(row.status)} size="small" sx={{ fontWeight: 500 }} />
      ),
    },
    {
      id: 'action',
      accessorKey: 'action',
      header: 'Ações',
      size: 60,
      accessorFn: (row: EventType) => (
        <Box display="flex" justifyContent="space-between" alignItems="center" width="120px">
          <ButtonBase sx={{ color: 'primary.main', padding: '5px', borderRadius: '5px' }} onClick={() => navigate(`/events/${row.uid}`)}>
            <Tooltip title="Editar">
              <CreateOutlinedIcon fontSize="medium" sx={{ color: '#fff' }} />
            </Tooltip>
          </ButtonBase>
          <ButtonBase
            sx={{ color: 'primary.main', padding: '5px', borderRadius: '5px' }}
            onClick={() => navigate(`/events/${row.uid}`, { state: { isView: true } })}
          >
            <Tooltip title="Visualizar">
              <VisibilityOutlinedIcon fontSize="medium" sx={{ color: '#fff' }} />
            </Tooltip>
          </ButtonBase>
          <ButtonBase sx={{ color: 'error.main', padding: '5px', borderRadius: '5px' }} onClick={() => handleOpenConfirmModal(row)}>
            <Tooltip title="Excluir">
              <DeleteOutlineIcon fontSize="medium" />
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
          {isFetchingEvents && (
            <div className="w-full">
              <LinearProgress color="secondary" />
            </div>
          )}
          {!isLoadingEvents && <EventsHeader />}
        </>
      }
      content={
        <div className="flex flex-1 flex-col overflow-x-auto overflow-y-hidden h-full">
          {!isLoadingEvents && (
            <>
              <DefaultTable
                data={events?.data}
                columns={columns}
                page={page}
                totalPages={events?.totalPages}
                onPageChange={(newPage) => dispatch(setPage(newPage))}
                globalFilter={search}
                onGlobalFilterChange={setSearch}
              />
              <DefaultConfirmModal
                onCancel={() => setOpenConfirmModal(false)}
                onConfirm={handleDeleteEvent}
                open={openConfirmModal}
                title="Excluir Evento"
                message={`Tem certeza que deseja excluir o evento "${selectedEvent?.title}"?`}
                confirmText="Excluir"
                cancelText="Cancelar"
                confirmColor="error"
                loading={isLoadingDelete}
              />
            </>
          )}
        </div>
      }
    />
  );
}

export default Events;
