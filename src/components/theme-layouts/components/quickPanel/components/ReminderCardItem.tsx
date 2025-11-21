import { styled } from '@mui/material/styles';
import { Card, CardContent, Box, Typography, Chip, IconButton, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { parseISO, format, isPast } from 'date-fns';
import type { Reminder as ReminderType } from '@/store/api/remindersApi';

const PriorityChip = styled(Chip)(({ priority }: { priority: string }) => {
  const getColor = () => {
    switch (priority) {
      case 'URGENT':
        return { bg: '#ffebee', color: '#c62828', border: '#f44336' };
      case 'HIGH':
        return { bg: '#fff3e0', color: '#ef6c00', border: '#ff9800' };
      case 'MEDIUM':
        return { bg: '#e3f2fd', color: '#1565c0', border: '#2196f3' };
      case 'LOW':
        return { bg: '#e8f5e8', color: '#2e7d32', border: '#4caf50' };
      default:
        return { bg: '#f5f5f5', color: '#757575', border: '#9e9e9e' };
    }
  };

  const colors = getColor();

  return {
    backgroundColor: colors.bg,
    color: colors.color,
    border: `1px solid ${colors.border}`,
    fontWeight: 600,
    fontSize: '0.75rem',
  };
});

type Props = {
  reminder: ReminderType;
  onDelete: (uid: string) => void;
  isDeleting: boolean;
  onEdit?: (reminder: ReminderType) => void;
};

const formatReminderDateTime = (dateTime: string) => {
  const date = parseISO(dateTime);
  return {
    full: format(date, "dd/MM/yyyy 'às' HH:mm"),
  };
};

const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    NONE: 'Nenhum',
    LOW: 'Baixo',
    MEDIUM: 'Médio',
    HIGH: 'Alto',
    URGENT: 'Urgente',
  };
  return labels[priority] || priority;
};

const ReminderCard = styled(Card)<{ isUrgent?: boolean }>(({ theme, isUrgent }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  boxShadow: isUrgent ? '0 4px 16px rgba(198,40,40,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease-in-out',
  border: isUrgent ? '2px solid #f44336' : 'none',
  background: isUrgent ? 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)' : '#ffffff',
  '&:hover': {
    boxShadow: isUrgent ? '0 6px 20px rgba(198,40,40,0.4)' : '0 4px 16px rgba(0,0,0,0.15)',
    transform: 'translateY(-2px)',
  },
}));

export default function ReminderCardItem({ reminder, onDelete, isDeleting, onEdit }: Props) {
  const datetime = formatReminderDateTime(reminder.dateTime);
  const overdue = !reminder.visualized && isPast(parseISO(reminder.dateTime));
  return (
    <ReminderCard isUrgent={reminder.priority === 'URGENT'} sx={{ width: '100%' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {reminder.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" color="primary" onClick={() => onEdit?.(reminder)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => onDelete(reminder.uid ?? reminder.id ?? '')} disabled={isDeleting}>
              {isDeleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon fontSize="small" />}
            </IconButton>
            <IconButton size="small" color={reminder.visualized ? 'success' : 'default'}>
              {reminder.visualized ? <CheckCircleIcon fontSize="small" /> : <RadioButtonUncheckedIcon fontSize="small" />}
            </IconButton>
          </Box>
        </Box>

        {reminder.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {reminder.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color={overdue ? 'error.main' : 'text.secondary'}>
            {datetime.full}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            {overdue && <Chip label="Atrasado" color="error" size="small" />}
            <PriorityChip label={getPriorityLabel(reminder.priority)} priority={reminder.priority} size="small" />
          </Box>
        </Box>
      </CardContent>
    </ReminderCard>
  );
}
