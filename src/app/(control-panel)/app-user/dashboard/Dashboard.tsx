import { Container, LinearProgress, styled, useTheme, Paper, Typography, Box } from '@mui/material';
import FusePageSimple from '@fuse/core/FusePageSimple';
import DashboardHeader from './DashboardHeader';
import { motion } from 'motion/react';
import DefaultWidget from './widgets/DefaultWidget';
import { useGetDashboardUserQuery } from '@/store/api/resportsApi';
import LeadsClientsWidget from './widgets/LeadsClientsWidget';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventIcon from '@mui/icons-material/Event';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .container': {
    maxWidth: '100%!important',
  },
  '& .FusePageSimple-header': {
    backgroundColor: theme.vars.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.vars.palette.divider,
  },
  '& .FusePageSimple-content': {
    backgroundColor: theme.vars.palette.background.default,
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  transition: 'all 0.3s ease',
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper} 100%)`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  width: 56,
  height: 56,
  borderRadius: theme.shape.borderRadius * 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: color ? `${color}15` : theme.palette.primary.light + '15',
  color: color || theme.palette.primary.main,
  '& svg': {
    fontSize: 28,
  },
}));

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const container = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function Dashboard() {
  const { data: dashboardData, isLoading: isLoadingDashboard } = useGetDashboardUserQuery(undefined, { 
    refetchOnMountOrArgChange: true 
  });
  const theme = useTheme();

  // Mock data para Participantes
  const mockParticipantsPerMonth = [12, 19, 25, 31, 28, 35, 42, 38, 45, 52, 48, 55];
  const mockTotalParticipantsActive = 380;
  const mockTotalParticipantsInactive = 45;
  const mockTotalParticipants = mockTotalParticipantsActive + mockTotalParticipantsInactive;
  
  // Mock data para Eventos
  const mockTotalEvents = 28;
  const mockActiveEvents = 5;

  const totalLeads = dashboardData?.data?.totalLeads || 0;
  const leadsThisYear = dashboardData?.data?.leadsPerMonth?.reduce((acc, curr) => acc + Number(curr), 0) || 0;
  const participantsThisYear = mockParticipantsPerMonth.reduce((acc, curr) => acc + curr, 0);

  return (
    <Root
      header={<DashboardHeader />}
      content={
        <>
          {isLoadingDashboard ? (
            <div className="w-full">
              <LinearProgress color="secondary" />
            </div>
          ) : (
            <Container maxWidth="xl" sx={{ py: 4, px: { xs: 3, sm: 4, md: 6 } }}>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
              >
                {/* Seção de Estatísticas Principais */}
                <motion.div variants={item}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 3, 
                      fontWeight: 600,
                      color: theme.palette.text.primary 
                    }}
                  >
                    Visão Geral
                  </Typography>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <motion.div variants={item}>
                    <StatsCard elevation={2}>
                      <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Total de Leads
                          </Typography>
                          <Typography variant="h4" fontWeight="bold" color="text.primary">
                            {totalLeads}
                          </Typography>
                          <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TrendingUpIcon sx={{ fontSize: 16 }} />
                            {leadsThisYear} este ano
                          </Typography>
                        </Box>
                        <IconWrapper color={theme.palette.info.main}>
                          <PersonAddIcon />
                        </IconWrapper>
                      </Box>
                    </StatsCard>
                  </motion.div>

                  <motion.div variants={item}>
                    <StatsCard elevation={2}>
                      <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Participantes Ativos
                          </Typography>
                          <Typography variant="h4" fontWeight="bold" color="text.primary">
                            {mockTotalParticipantsActive}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                            {mockTotalParticipantsInactive} inativos
                          </Typography>
                        </Box>
                        <IconWrapper color={theme.palette.success.main}>
                          <PeopleIcon />
                        </IconWrapper>
                      </Box>
                    </StatsCard>
                  </motion.div>

                  <motion.div variants={item}>
                    <StatsCard elevation={2}>
                      <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Total de Participantes
                          </Typography>
                          <Typography variant="h4" fontWeight="bold" color="text.primary">
                            {mockTotalParticipants}
                          </Typography>
                          <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TrendingUpIcon sx={{ fontSize: 16 }} />
                            {participantsThisYear} este ano
                          </Typography>
                        </Box>
                        <IconWrapper color={theme.palette.warning.main}>
                          <EventIcon />
                        </IconWrapper>
                      </Box>
                    </StatsCard>
                  </motion.div>

                  <motion.div variants={item}>
                    <StatsCard elevation={2}>
                      <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Total de Eventos
                          </Typography>
                          <Typography variant="h4" fontWeight="bold" color="text.primary">
                            {mockTotalEvents}
                          </Typography>
                          <Typography variant="caption" color="success.main" sx={{ mt: 1 }}>
                            {mockActiveEvents} eventos ativos
                          </Typography>
                        </Box>
                        <IconWrapper color={theme.palette.secondary.main}>
                          <CalendarMonthIcon />
                        </IconWrapper>
                      </Box>
                    </StatsCard>
                  </motion.div>
                </div>

                {/* Seção de Gráficos */}
                <motion.div variants={item}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 3, 
                      fontWeight: 600,
                      color: theme.palette.text.primary 
                    }}
                  >
                    Análise Temporal
                  </Typography>
                </motion.div>

                <motion.div variants={item}>
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <LeadsClientsWidget
                      usersIssuesData={{
                        overview: {
                          year: {
                            'all-year-leads': leadsThisYear,
                            'all-year-clients': participantsThisYear,
                          },
                        },
                        series: {
                          year: [
                            {
                              name: 'Leads',
                              type: 'line',
                              data: dashboardData?.data?.leadsPerMonth || [],
                            },
                            {
                              name: 'Participantes',
                              type: 'bar',
                              data: mockParticipantsPerMonth,
                            },
                          ],
                        },
                        ranges: {
                          year: 'Ano',
                        },
                        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                      }}
                    />
                  </Paper>
                </motion.div>
              </motion.div>
            </Container>
          )}
        </>
      }
    />
  );
}

export default Dashboard;