import { Box, ButtonBase, Chip, LinearProgress, styled, Switch, Tooltip } from '@mui/material';
import FusePageSimple from '@fuse/core/FusePageSimple';
import DefaultTable from '@/components/DefaultTable';
import DefaultConfirmModal from '@/components/DefaultConfirmModal';
import UsersHeader from './UsersHeader';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect, useState } from 'react';
import { resetPage, setPage } from '@/store/slices/paginationSlice';
import { useGetUsersQuery, UsersType, useUpdateUserEnableMutation } from '@/store/api/userApi';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';

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
 * The Users.
 */

function Users() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const page = useAppSelector((state) => state.pagination.page);

  // Detecta mudança de rota para resetar paginação se sair de /admin/users e não for para /admin/users/:uid
  useEffect(() => {
    return () => {
      // Se o novo path não for /admin/users/:uid, reseta a paginação
      const nextPath = window.location.pathname;
      const isUserDetail = /^\/admin\/users\/[\w-]+$/.test(nextPath);

      if (!isUserDetail) {
        dispatch(resetPage()); // ou resetPage() se preferir
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

  // Usa o search na query da API
  const {
    data: users,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useGetUsersQuery(`page=${page}&search=${search}`, { refetchOnMountOrArgChange: true });

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Função para abrir o modal e setar o usuario selecionado
  function handleOpenConfirmModal(user) {
    setSelectedUser(user);
    setOpenConfirmModal(true);
  }

  const [updateUser, { isLoading: isLoadingUpdate }] = useUpdateUserEnableMutation();

  // Função para ativar/desativar
  function handleToggleEnableUser() {
    updateUser({ uid: selectedUser.uid, enable: !selectedUser.enable })
      .unwrap()
      .then(() => {
        setSelectedUser(null);
        refetchUsers();
        setOpenConfirmModal(false);

        dispatch(
          showMessage({
            message: `Usuário "${selectedUser.profile.name}" ${selectedUser.enable ? 'desativado' : 'ativado'} com sucesso`,
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
        setSelectedUser(null);
        setOpenConfirmModal(false);
        dispatch(
          showMessage({
            message: `Erro ao ${selectedUser.enable ? 'desativar' : 'ativar'} o usuário "${selectedUser.profile.name}"`,
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

  const columns = [
    {
      id: 'profile.name',
      accessorKey: 'profile.name',
      header: 'Nome',
      size: 250,
    },
    {
      id: 'enable',
      accessorKey: 'enable',
      header: 'Status',
      size: 250,
      accessorFn: (row: UsersType) => (
        <Chip
          label={row.enable ? 'Ativo' : 'Inativo'}
          color={row.enable ? 'success' : 'error'}
          size="small"
          icon={row.enable ? <CheckCircleOutlineIcon /> : <BlockIcon />}
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      id: 'action',
      accessorKey: 'action',
      header: 'Ações',
      size: 60,
      accessorFn: (row: UsersType) => (
        <Box display="flex" justifyContent="space-between" alignItems="center" width="90px">
          <ButtonBase sx={{ color: 'primary.main', padding: '5px', borderRadius: '5px' }} onClick={() => navigate(`/admin/users/${row.uid}`)}>
            <Tooltip title="Visualizar">
              <VisibilityOutlinedIcon fontSize="medium" color="primary" />
            </Tooltip>
          </ButtonBase>
          <Tooltip title={row.enable ? 'Desativar' : 'Ativar'}>
            <Switch
              checked={row.enable}
              color={row.enable ? 'success' : 'error'}
              onChange={() => handleOpenConfirmModal(row)}
              inputProps={{ 'aria-label': row.enable ? 'Desativar' : 'Ativar' }}
              size="small"
            />
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Root
      header={
        <>
          {isFetchingUsers && (
            <div className="w-full">
              <LinearProgress color="secondary" />
            </div>
          )}
          {!isLoadingUsers && <UsersHeader />}
        </>
      }
      content={
        <div className="flex flex-1 flex-col overflow-x-auto overflow-y-hidden h-full">
          {!isLoadingUsers && (
            <>
              <DefaultTable
                data={users?.data}
                columns={columns}
                page={page}
                totalPages={users?.totalPages}
                onPageChange={(newPage) => dispatch(setPage(newPage))}
                globalFilter={search}
                onGlobalFilterChange={setSearch}
              />
              <DefaultConfirmModal
                onCancel={() => setOpenConfirmModal(false)}
                onConfirm={handleToggleEnableUser}
                open={openConfirmModal}
                title={selectedUser?.enable ? 'Desativar usuário' : 'Ativar usuário'}
                message={
                  selectedUser?.enable
                    ? `Tem certeza que deseja desativar o usuário "${selectedUser?.profile.name}"?`
                    : `Tem certeza que deseja ativar o usuário "${selectedUser?.profile.name}"?`
                }
                confirmText={selectedUser?.enable ? 'Desativar' : 'Ativar'}
                cancelText="Cancelar"
                confirmColor={selectedUser?.enable ? 'error' : 'success'}
                loading={isLoadingUpdate}
              />
            </>
          )}
        </div>
      }
      // scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Users;
