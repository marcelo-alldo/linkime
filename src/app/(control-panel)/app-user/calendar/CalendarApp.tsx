import { styled } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { DatesSetArg, EventInput } from '@fullcalendar/core';
import { format } from 'date-fns';
import CalendarHeader from './CalendarHeader';
import { EventType, useGetCalendarEventsQuery } from './CalendarApi';
import { LinearProgress } from '@mui/material';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .container': {
    maxWidth: '100%!important',
  },
  '& a': {
    color: `${theme.palette.text.primary}!important`,
    textDecoration: 'none!important',
  },
  '&  .fc-media-screen': {
    minHeight: '100%',
    width: '100%',
  },
  '& .fc-scrollgrid, & .fc-theme-standard td, & .fc-theme-standard th': {
    borderColor: `${theme.palette.divider}!important`,
  },
  '&  .fc-scrollgrid-section > td': {
    border: 0,
  },
  '& .fc-daygrid-day': {
    '&:last-child': {
      borderRight: 0,
    },
  },
  '& .fc-col-header-cell': {
    borderWidth: '0 1px 0 1px',
    padding: '8px 0 0 0',
    '& .fc-col-header-cell-cushion': {
      color: theme.palette.text.secondary,
      fontWeight: 500,
      fontSize: 12,
      textTransform: 'uppercase',
    },
  },
  '& .fc-view ': {
    '& > .fc-scrollgrid': {
      border: 0,
    },
  },
  '& .fc-daygrid-day.fc-day-today': {
    backgroundColor: 'transparent!important',
    '& .fc-daygrid-day-number': {
      borderRadius: '100%',
      backgroundColor: `${theme.palette.secondary.main}!important`,
      color: `${theme.palette.secondary.contrastText}!important`,
    },
  },
  '& .fc-daygrid-day-top': {
    justifyContent: 'center',
    '& .fc-daygrid-day-number': {
      color: theme.palette.text.secondary,
      fontWeight: 500,
      fontSize: 12,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 26,
      height: 26,
      margin: '4px 0',
      borderRadius: '50%',
      float: 'none',
      lineHeight: 1,
    },
  },
  '& .fc-h-event': {
    border: '0!important',
    background: 'initial',
  },
  '& .fc-event': {
    border: 0,
    padding: '0 ',
    fontSize: 12,
    margin: '0 6px 4px 6px!important',
  },
}));

const convertSchedulesToEvents = (schedules: EventType[]): EventInput[] => {
  return schedules?.map((event) => ({
    id: event.id,
    title: `${event.summary}`,
    start: event.start.dateTime,
    end: event.end.dateTime,
    display: 'block',
  }));
};

/**
 * The calendar app.
 */
function CalendarApp() {
  const [currentDate, setCurrentDate] = useState<DatesSetArg>();
  const [dateRange, setDateRange] = useState<string>('');

  // Construir a query string baseada no range de datas
  const { data, isLoading, isFetching } = useGetCalendarEventsQuery(dateRange);
  const calendarRef = useRef<FullCalendar>(null);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const [events, setEvents] = useState<EventInput[]>([]);

  useEffect(() => {
    if (data?.data) {
      const calendarEvents = convertSchedulesToEvents(data?.data);
      setEvents(calendarEvents);
    }
  }, [data?.data]);

  // Definir range inicial quando o componente carregar
  useEffect(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const startDate = format(startOfMonth, 'yyyy-MM-dd');
    const endDate = format(endOfMonth, 'yyyy-MM-dd');

    const initialQuery = `after=${startDate}&before=${endDate}`;
    setDateRange(initialQuery);
  }, []);

  useEffect(() => {
    setLeftSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    // Correct calendar dimentions after sidebar toggles
    setTimeout(() => {
      calendarRef.current?.getApi()?.updateSize();
    }, 300);
  }, [leftSidebarOpen]);

  const handleDates = (rangeInfo: DatesSetArg) => {
    setCurrentDate(rangeInfo);

    // Formatear as datas para o formato esperado pela API
    const startDate = format(rangeInfo.start, 'yyyy-MM-dd');
    const endDate = format(rangeInfo.end, 'yyyy-MM-dd');

    // Criar a query string
    const queryString = `after=${startDate}&before=${endDate}`;
    setDateRange(queryString);
  };

  //   if (isLoading) {
  //     return <FuseLoading />;
  //   }

  return (
    <>
      <Root
        header={
          <>
            {(isFetching || isLoading) && <LinearProgress color="secondary" />}
            {!isLoading && <CalendarHeader calendarRef={calendarRef} currentDate={currentDate} />}
          </>
        }
        content={
          !isLoading && (
            <FullCalendar
              locale={ptBrLocale}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={false}
              initialView="dayGridMonth"
              weekends
              datesSet={handleDates}
              events={events}
              initialDate={new Date()}
              ref={calendarRef}
            />
          )
        }
        // leftSidebarContent={<CalendarAppSidebar />}
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarOnClose={() => setLeftSidebarOpen(false)}
        leftSidebarWidth={256}
        scroll="content"
      />
    </>
  );
}

export default CalendarApp;
