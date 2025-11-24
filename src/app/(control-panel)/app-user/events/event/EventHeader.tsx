import { Button } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useAppDispatch } from '@/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useFormContext } from 'react-hook-form';
import _ from 'lodash';
import PageTitle from '@/components/PageTitle';
import { useCreateEventMutation, useUpdateEventMutation } from '../eventsApi';
import { useEffect } from 'react';

/**
 * The event header component.
 */

interface EventHeaderProps {
  refetch: () => void;
  setLoading: (loading: boolean) => void;
}

function EventHeader({ refetch, setLoading }: EventHeaderProps) {
  const { uid } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { state } = useLocation();

  const methods = useFormContext();
  const { formState, watch, getValues } = methods;

  const { title } = watch();

  const { dirtyFields, isValid } = formState;
  const [createEvent, { isLoading: isLoadingCreate }] = useCreateEventMutation();

  useEffect(() => {
    setLoading(isLoadingCreate);
  }, [isLoadingCreate, setLoading]);

  // CREATE EVENT
  const handleCreateEvent = () => {
    const values = {
      title: getValues('title'),
      description: getValues('description'),
      startDate: getValues('startDate'),
      endDate: getValues('endDate'),
      location: getValues('location'),
      type: getValues('type'),
    };
    createEvent(values)
      .unwrap()
      .then((response) => {
        dispatch(
          showMessage({
            message: response?.msg || 'Evento criado com sucesso',
            autoHideDuration: 3000,
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          }),
        );
        navigate('/events');
      })
      .catch((error) => {
        dispatch(
          showMessage({
            message: error?.data?.msg || 'Erro ao criar evento',
            autoHideDuration: 3000,
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          }),
        );
      });
  };

  // UPDATE EVENT
  const [updateEvent, { isLoading: isLoadingUpdate }] = useUpdateEventMutation();

  useEffect(() => {
    setLoading(isLoadingUpdate);
  }, [isLoadingUpdate, setLoading]);

  const handleUpdateEvent = () => {
    const values = {
      uid,
      title: getValues('title'),
      description: getValues('description'),
      startDate: getValues('startDate'),
      endDate: getValues('endDate'),
      location: getValues('location'),
      type: getValues('type'),
      status: getValues('status'),
    };

    updateEvent(values)
      .unwrap()
      .then((response) => {
        refetch();
        dispatch(
          showMessage({
            message: response?.msg || 'Evento atualizado com sucesso',
            autoHideDuration: 3000,
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          }),
        );
      })
      .catch((error) => {
        dispatch(
          showMessage({
            message: error?.data?.msg || 'Erro ao atualizar evento',
            autoHideDuration: 3000,
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          }),
        );
      });
  };

  return (
    <div className="p-6 sm:p-8 w-full flex items-center sm:justify-between">
      <PageTitle title={uid === 'new' ? 'Novo Evento' : title} backNavigation />

      {!state?.isView && (
        <div className="flex flex-1 items-center justify-end space-x-0 sm:space-x-3">
          {uid === 'new' ? (
            <Button
              variant="contained"
              className="whitespace-nowrap"
              color="secondary"
              disabled={_.isEmpty(dirtyFields) || !isValid || isLoadingCreate}
              onClick={handleCreateEvent}
            >
              <FuseSvgIcon size={20}>heroicons-outline:plus-circle</FuseSvgIcon>
              <span className="hidden sm:flex mx-2">Criar Evento</span>
            </Button>
          ) : (
            <Button
              variant="contained"
              className="whitespace-nowrap"
              color="secondary"
              disabled={_.isEmpty(dirtyFields) || !isValid || isLoadingUpdate}
              onClick={handleUpdateEvent}
            >
              <FuseSvgIcon size={20}>heroicons-outline:check-circle</FuseSvgIcon>
              <span className="hidden sm:flex mx-2">Salvar</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default EventHeader;
