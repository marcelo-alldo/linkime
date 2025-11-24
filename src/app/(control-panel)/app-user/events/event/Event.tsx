import { LinearProgress, styled, Tab, Tabs } from '@mui/material';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useParams } from 'react-router';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { SyntheticEvent, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import BasicInfosTab from './tabs/BasicInfosTab';
import { useGetEventsQuery } from '../eventsApi';
import EventHeader from './EventHeader';

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

const schema = z
  .object({
    uid: z.string().optional(),
    title: z.string().min(1, 'Título obrigatório'),
    description: z.string().optional(),
    startDate: z.string().min(1, 'Data de início obrigatória'),
    endDate: z.string().min(1, 'Data de término obrigatória'),
    location: z.string().optional(),
    type: z.string().optional(),
    status: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: 'A data de término deve ser posterior à data de início',
      path: ['endDate'],
    },
  );

const defaultValues = {
  uid: '',
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  location: '',
  type: '',
  status: 'scheduled',
};

type FormType = z.infer<typeof schema>;

/**
 * The event component.
 */

function Event() {
  const { uid } = useParams();
  const {
    data: eventData,
    isLoading: isLoadingEvent,
    refetch: refetchEvent,
  } = useGetEventsQuery(`uid=${uid}`, { refetchOnMountOrArgChange: true, skip: uid === 'new' });

  const [tabValue, setTabValue] = useState<string>('basic-info');

  const [localLoading, setLocalLoading] = useState(false);

  let event = undefined;

  if (Array.isArray(eventData?.data)) {
    event = eventData.data.find((e) => String(e.uid) === String(uid));
  } else if (eventData?.data && typeof eventData.data === 'object') {
    event = eventData.data;
  }

  const methods = useForm<FormType>({
    mode: 'all',
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { reset } = methods;

  useEffect(() => {
    if (event) {
      reset({
        uid: event.uid || '',
        title: event.title || '',
        description: event.description || '',
        startDate: event.startDate || '',
        endDate: event.endDate || '',
        location: event.location || '',
        type: event.type || '',
        status: event.status || 'scheduled',
      });
    }
  }, [event, reset]);

  function handleTabChange(event: SyntheticEvent, value: string) {
    setTabValue(value);
  }

  return (
    <FormProvider {...methods}>
      <Root
        header={
          <>
            {(isLoadingEvent || localLoading) && (
              <div className="w-full">
                <LinearProgress color="secondary" />
              </div>
            )}

            {!isLoadingEvent && <EventHeader setLoading={setLocalLoading} refetch={refetchEvent} />}
          </>
        }
        content={
          <div className="flex flex-1 flex-col overflow-x-auto overflow-y-hidden h-full">
            {!isLoadingEvent && (
              <div
                className="flex flex-1 flex-col overflow-x-auto overflow-y-hidden h-full w-full gap-6"
                style={{ padding: '20px' }}
              >
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="event tabs"
                  sx={{
                    '& .MuiTabs-indicator': {
                      backgroundColor: 'secondary.main',
                    }
                  }}
                >
                  <Tab
                    value="basic-info"
                    label="Informações do Evento"
                    sx={{
                      '&.Mui-selected': {
                        color: 'secondary.main',
                      }
                    }}
                  />
                </Tabs>
                <div className="w-full h-full">
                  <div className={tabValue !== 'basic-info' ? 'hidden' : ''}>
                    <BasicInfosTab />
                  </div>
                </div>
              </div>
            )}
          </div>
        }
      />
    </FormProvider>
  );
}

export default Event;
