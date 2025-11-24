import Typography from '@mui/material/Typography';
import { Box, Card, CardContent, Grid } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import { MyEventType } from '../events/eventsApi';
import { isAfter, isBefore, addDays } from 'date-fns';

type MyEventsHeaderProps = {
  events: MyEventType[];
};

/**
 * The MyEvents header with summary metrics cards.
 */
function MyEventsHeader({ events }: MyEventsHeaderProps) {
  // Calcula métricas
  const totalEvents = events.length;
  const pendingEvents = events.filter((e) => e.participation.status === 'pending').length;

  // Eventos nos próximos 7 dias
  const now = new Date();
  const next7Days = addDays(now, 7);
  const upcomingEvents = events.filter((e) => {
    const startDate = new Date(e.startDate);
    return isAfter(startDate, now) && isBefore(startDate, next7Days);
  }).length;

  const metrics = [
    {
      title: 'Total de Eventos',
      value: totalEvents,
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      color: '#1e40af', // azul escuro
      bgColor: '#dbeafe', // azul claro
    },
    {
      title: 'Próximos 7 Dias',
      value: upcomingEvents,
      icon: <UpcomingIcon sx={{ fontSize: 40 }} />,
      color: '#059669', // verde
      bgColor: '#d1fae5', // verde claro
    },
    {
      title: 'Pendentes de Confirmação',
      value: pendingEvents,
      icon: <PendingActionsIcon sx={{ fontSize: 40 }} />,
      color: '#dc2626', // vermelho
      bgColor: '#fee2e2', // vermelho claro
    },
  ];

  return (
    <Box className="flex flex-col w-full px-24 sm:px-32 py-24">
      <Box className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <Typography className="text-3xl md:text-4xl font-extrabold tracking-tight leading-7 sm:leading-10 truncate">
          Meus Eventos
        </Typography>
      </Box>

      <Box display="flex" width="100%">
        <Grid container spacing={3} maxWidth="1200px">
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  minHeight: '140px',
                  minWidth: '320px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  '&:last-child': { pb: 3 }
                }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} width="100%">
                    <Box display="flex" flexDirection="column" justifyContent="center">
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          lineHeight: 1.4,
                        }}
                      >
                        {metric.title}
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: metric.color,
                          fontSize: '2.5rem',
                          lineHeight: 1,
                        }}
                      >
                        {metric.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: metric.bgColor,
                        color: metric.color,
                        flexShrink: 0,
                      }}
                    >
                      {metric.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default MyEventsHeader;