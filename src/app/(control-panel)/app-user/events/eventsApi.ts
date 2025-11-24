import { apiService as api } from 'src/store/apiService';

export const addTagTypes = ['create_event', 'get_events', 'update_event', 'delete_event'] as const;

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

export const { useCreateEventMutation, useGetEventsQuery, useUpdateEventMutation, useDeleteEventMutation } = EventsApi;
