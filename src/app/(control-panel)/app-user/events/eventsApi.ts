import { apiService as api } from 'src/store/apiService';

export const addTagTypes = ['create_event', 'get_events', 'update_event', 'delete_event', 'get_my_events', 'confirm_participation', 'cancel_participation'] as const;

// Mock data storage
let mockEvents: EventType[] = [
  {
    uid: '1',
    title: 'Reunião de Planejamento Q1',
    description: 'Reunião para planejamento estratégico do primeiro trimestre',
    startDate: '2025-02-01T10:00:00.000Z',
    endDate: '2025-02-01T12:00:00.000Z',
    location: 'Sala de Reuniões A',
    type: 'meeting',
    status: 'scheduled',
    createdAt: '2025-01-20T10:00:00.000Z',
    updatedAt: '2025-01-20T10:00:00.000Z',
    userUid: 'user-1',
  },
  {
    uid: '2',
    title: 'Workshop de Tecnologia',
    description: 'Workshop sobre as novas tecnologias e ferramentas para o time',
    startDate: '2025-02-05T14:00:00.000Z',
    endDate: '2025-02-05T18:00:00.000Z',
    location: 'Auditório Principal',
    type: 'workshop',
    status: 'scheduled',
    createdAt: '2025-01-21T10:00:00.000Z',
    updatedAt: '2025-01-21T10:00:00.000Z',
    userUid: 'user-1',
  },
  {
    uid: '3',
    title: 'Conferência Anual de Vendas',
    description: 'Conferência anual para apresentação de resultados e estratégias',
    startDate: '2025-03-15T09:00:00.000Z',
    endDate: '2025-03-15T17:00:00.000Z',
    location: 'Centro de Convenções',
    type: 'conference',
    status: 'scheduled',
    createdAt: '2025-01-22T10:00:00.000Z',
    updatedAt: '2025-01-22T10:00:00.000Z',
    userUid: 'user-1',
  },
  {
    uid: '4',
    title: 'Treinamento de Onboarding',
    description: 'Treinamento para novos colaboradores',
    startDate: '2025-01-10T09:00:00.000Z',
    endDate: '2025-01-10T17:00:00.000Z',
    location: 'Sala de Treinamento',
    type: 'training',
    status: 'completed',
    createdAt: '2025-01-05T10:00:00.000Z',
    updatedAt: '2025-01-10T18:00:00.000Z',
    userUid: 'user-1',
  },
  {
    uid: '5',
    title: 'Happy Hour do Time',
    description: 'Confraternização do time de desenvolvimento',
    startDate: '2025-01-25T18:00:00.000Z',
    endDate: '2025-01-25T22:00:00.000Z',
    location: 'Bar do Zé',
    type: 'social',
    status: 'scheduled',
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-01-15T10:00:00.000Z',
    userUid: 'user-1',
  },
];

// Mock participations storage
let mockParticipations: ParticipationType[] = [
  {
    uid: 'p1',
    userUid: 'user-1', // Current user
    eventUid: '1',
    status: 'confirmed',
    joinedAt: '2025-01-20T11:00:00.000Z',
  },
  {
    uid: 'p2',
    userUid: 'user-1',
    eventUid: '2',
    status: 'pending',
    joinedAt: '2025-01-21T11:00:00.000Z',
  },
  {
    uid: 'p3',
    userUid: 'user-1',
    eventUid: '4',
    status: 'confirmed',
    joinedAt: '2025-01-05T11:00:00.000Z',
  },
  {
    uid: 'p4',
    userUid: 'user-1',
    eventUid: '5',
    status: 'confirmed',
    joinedAt: '2025-01-15T11:00:00.000Z',
  },
  // Participações de outros usuários
  {
    uid: 'p5',
    userUid: 'user-2',
    eventUid: '1',
    status: 'confirmed',
    joinedAt: '2025-01-20T12:00:00.000Z',
  },
  {
    uid: 'p6',
    userUid: 'user-3',
    eventUid: '2',
    status: 'confirmed',
    joinedAt: '2025-01-21T12:00:00.000Z',
  },
];

const EventsApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      createEvent: build.mutation<CreateEventApiResponse, CreateEventApiArg>({
        queryFn: async (event) => {
          // Simula delay de rede
          await new Promise((resolve) => setTimeout(resolve, 500));

          const newEvent: EventType = {
            uid: `${Date.now()}`,
            ...event,
            status: 'scheduled',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userUid: 'user-1',
          };

          mockEvents = [newEvent, ...mockEvents];

          return {
            data: {
              data: [newEvent],
              total: mockEvents.length,
              success: true,
              page: 1,
              pageSize: 10,
              totalPages: Math.ceil(mockEvents.length / 10),
              msg: 'Evento criado com sucesso',
            },
          };
        },
        invalidatesTags: ['create_event', 'get_events'],
      }),
      getEvents: build.query<GetEventsApiResponse, GetEventsApiArg>({
        queryFn: async (query) => {
          // Simula delay de rede
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Parse query params
          const params = new URLSearchParams(query);
          const page = parseInt(params.get('page') || '1');
          const search = params.get('search') || '';
          const uid = params.get('uid') || '';
          const pageSize = 10;

          let filteredEvents = [...mockEvents];

          // Filtrar por UID se fornecido
          if (uid) {
            filteredEvents = filteredEvents.filter((event) => event.uid === uid);
          }

          // Filtrar por busca
          if (search) {
            const searchLower = search.toLowerCase();
            filteredEvents = filteredEvents.filter(
              (event) =>
                event.title.toLowerCase().includes(searchLower) ||
                event.description?.toLowerCase().includes(searchLower) ||
                event.location?.toLowerCase().includes(searchLower),
            );
          }

          // Paginação
          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

          return {
            data: {
              data: uid ? filteredEvents : paginatedEvents,
              total: filteredEvents.length,
              success: true,
              page,
              pageSize,
              totalPages: Math.ceil(filteredEvents.length / pageSize),
              msg: 'Eventos listados com sucesso',
            },
          };
        },
        providesTags: ['get_events'],
      }),
      updateEvent: build.mutation<UpdateEventApiResponse, UpdateEventApiArg>({
        queryFn: async (event) => {
          // Simula delay de rede
          await new Promise((resolve) => setTimeout(resolve, 500));

          const index = mockEvents.findIndex((e) => e.uid === event.uid);

          if (index === -1) {
            return {
              error: {
                status: 404,
                data: { msg: 'Evento não encontrado' },
              },
            };
          }

          mockEvents[index] = {
            ...mockEvents[index],
            ...event,
            updatedAt: new Date().toISOString(),
          };

          return {
            data: {
              data: [mockEvents[index]],
              total: mockEvents.length,
              success: true,
              page: 1,
              pageSize: 10,
              totalPages: Math.ceil(mockEvents.length / 10),
              msg: 'Evento atualizado com sucesso',
            },
          };
        },
        invalidatesTags: ['update_event', 'get_events'],
      }),
      deleteEvent: build.mutation<DeleteEventApiResponse, DeleteEventApiArg>({
        queryFn: async (uid) => {
          // Simula delay de rede
          await new Promise((resolve) => setTimeout(resolve, 500));

          const index = mockEvents.findIndex((e) => e.uid === uid);

          if (index === -1) {
            return {
              error: {
                status: 404,
                data: { msg: 'Evento não encontrado' },
              },
            };
          }

          const deletedEvent = mockEvents[index];
          mockEvents = mockEvents.filter((e) => e.uid !== uid);

          return {
            data: {
              data: [deletedEvent],
              total: mockEvents.length,
              success: true,
              page: 1,
              pageSize: 10,
              totalPages: Math.ceil(mockEvents.length / 10),
              msg: 'Evento excluído com sucesso',
            },
          };
        },
        invalidatesTags: ['delete_event', 'get_events'],
      }),
      getMyEvents: build.query<GetMyEventsApiResponse, GetMyEventsApiArg>({
        queryFn: async (query) => {
          // Simula delay de rede
          await new Promise((resolve) => setTimeout(resolve, 300));

          const currentUserUid = 'user-1';

          // Parse query params
          const params = new URLSearchParams(query);
          const page = parseInt(params.get('page') || '1');
          const search = params.get('search') || '';
          const participationStatus = params.get('participationStatus') || '';
          const pageSize = 10;

          // Busca participações do usuário atual
          let userParticipations = mockParticipations.filter((p) => p.userUid === currentUserUid);

          // Filtra por status de participação
          if (participationStatus) {
            userParticipations = userParticipations.filter((p) => p.status === participationStatus);
          }

          // Busca os eventos correspondentes e adiciona dados de participação
          let myEvents: MyEventType[] = userParticipations
            .map((participation) => {
              const event = mockEvents.find((e) => e.uid === participation.eventUid);
              if (!event) return null;

              // Conta total de participantes do evento
              const participantCount = mockParticipations.filter((p) => p.eventUid === event.uid && p.status === 'confirmed').length;

              return {
                ...event,
                participation,
                participantCount,
              };
            })
            .filter((event): event is MyEventType => event !== null);

          // Filtrar por busca
          if (search) {
            const searchLower = search.toLowerCase();
            myEvents = myEvents.filter(
              (event) =>
                event.title.toLowerCase().includes(searchLower) ||
                event.description?.toLowerCase().includes(searchLower) ||
                event.location?.toLowerCase().includes(searchLower),
            );
          }

          // Ordena por data de início (mais próximos primeiro)
          myEvents.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

          // Paginação
          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedEvents = myEvents.slice(startIndex, endIndex);

          return {
            data: {
              data: paginatedEvents,
              total: myEvents.length,
              success: true,
              page,
              pageSize,
              totalPages: Math.ceil(myEvents.length / pageSize),
              msg: 'Meus eventos listados com sucesso',
            },
          };
        },
        providesTags: ['get_my_events'],
      }),
      confirmParticipation: build.mutation<ConfirmParticipationApiResponse, ConfirmParticipationApiArg>({
        queryFn: async (eventUid) => {
          // Simula delay de rede
          await new Promise((resolve) => setTimeout(resolve, 500));

          const currentUserUid = 'user-1';

          // Verifica se já existe participação
          const existingParticipation = mockParticipations.find((p) => p.eventUid === eventUid && p.userUid === currentUserUid);

          if (existingParticipation) {
            // Atualiza status para confirmed
            const index = mockParticipations.findIndex((p) => p.uid === existingParticipation.uid);
            mockParticipations[index] = {
              ...mockParticipations[index],
              status: 'confirmed',
            };

            return {
              data: {
                data: mockParticipations[index],
                success: true,
                msg: 'Participação confirmada com sucesso',
              },
            };
          }

          // Cria nova participação
          const newParticipation: ParticipationType = {
            uid: `p${Date.now()}`,
            userUid: currentUserUid,
            eventUid,
            status: 'confirmed',
            joinedAt: new Date().toISOString(),
          };

          mockParticipations = [newParticipation, ...mockParticipations];

          return {
            data: {
              data: newParticipation,
              success: true,
              msg: 'Participação confirmada com sucesso',
            },
          };
        },
        invalidatesTags: ['get_my_events', 'confirm_participation'],
      }),
      cancelParticipation: build.mutation<CancelParticipationApiResponse, CancelParticipationApiArg>({
        queryFn: async (eventUid) => {
          // Simula delay de rede
          await new Promise((resolve) => setTimeout(resolve, 500));

          const currentUserUid = 'user-1';

          // Busca a participação
          const participation = mockParticipations.find((p) => p.eventUid === eventUid && p.userUid === currentUserUid);

          if (!participation) {
            return {
              error: {
                status: 404,
                data: { msg: 'Participação não encontrada' },
              },
            };
          }

          // Remove a participação
          mockParticipations = mockParticipations.filter((p) => p.uid !== participation.uid);

          return {
            data: {
              data: participation,
              success: true,
              msg: 'Participação cancelada com sucesso',
            },
          };
        },
        invalidatesTags: ['get_my_events', 'cancel_participation'],
      }),
    }),
    overrideExisting: false,
  });

export default EventsApi;

export type EventsApiType = {
  [EventsApi.reducerPath]: ReturnType<typeof EventsApi.reducer>;
};

export type CreateEventApiResponse = EventsResponse;
export type CreateEventApiArg = CreateEventType;

export type GetEventsApiResponse = EventsResponse;
export type GetEventsApiArg = string;

export type UpdateEventApiResponse = EventsResponse;
export type UpdateEventApiArg = UpdateEventType;

export type DeleteEventApiResponse = EventsResponse;
export type DeleteEventApiArg = string;

export type CreateEventType = {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  type?: string;
};

export type UpdateEventType = {
  uid: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  type?: string;
  status?: string;
};

export type EventType = {
  uid: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  type?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userUid: string;
};

export type EventsResponse = {
  data: EventType[];
  total: number;
  success: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  msg: string;
};

// Participation types
export type ParticipationType = {
  uid: string;
  userUid: string;
  eventUid: string;
  status: 'confirmed' | 'pending' | 'declined';
  joinedAt: string;
};

export type MyEventType = EventType & {
  participation: ParticipationType;
  participantCount: number;
};

export type GetMyEventsApiResponse = {
  data: MyEventType[];
  total: number;
  success: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  msg: string;
};

export type GetMyEventsApiArg = string;

export type ConfirmParticipationApiResponse = {
  data: ParticipationType;
  success: boolean;
  msg: string;
};

export type ConfirmParticipationApiArg = string;

export type CancelParticipationApiResponse = {
  data: ParticipationType;
  success: boolean;
  msg: string;
};

export type CancelParticipationApiArg = string;

export const { useCreateEventMutation, useGetEventsQuery, useUpdateEventMutation, useDeleteEventMutation, useGetMyEventsQuery, useConfirmParticipationMutation, useCancelParticipationMutation } = EventsApi;
