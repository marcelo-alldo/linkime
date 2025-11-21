import { useFormContext } from 'react-hook-form';
import { Box, Typography, Chip, Divider } from '@mui/material';
import { format } from 'date-fns';

function SubscriptionInfosTab() {
  const { watch } = useFormContext();
  const subscriptions = watch('subscriptions');

  const active = Array.isArray(subscriptions) ? subscriptions.find((sub) => sub.status === 'ACTIVE' || sub.status === 'TRIAL') : null;

  if (!active) {
    return <Typography color="text.secondary">Nenhuma assinatura ativa encontrada.</Typography>;
  }

  const traduceStatusMap = {
    ACTIVE: 'Ativa',
    CANCELED: 'Cancelada',
    EXPIRED: 'Expirada',
    TRIAL: 'Teste',
    PAYMENT_PENDING: 'Pagamento Pendente',
  };

  return (
    <Box className="flex flex-col gap-4 max-w-xl">
      <Typography variant="h6" gutterBottom>
        Assinatura Ativa
      </Typography>
      <Divider />
      <Box display="flex" gap={2} flexWrap="wrap">
        <Chip label={`Status: ${traduceStatusMap[active.status]}`} color={active.status === 'ACTIVE' ? 'success' : 'default'} />
        <Chip label={`Início: ${format(new Date(active.startDate), 'dd/MM/yyyy')}`} />
        <Chip label={`Fim: ${format(new Date(active.endDate), 'dd/MM/yyyy')}`} />
      </Box>
      <Box mt={2}>
        <Typography variant="body2" color="text.secondary">
          Criada em: {format(new Date(active.createdAt), 'dd/MM/yyyy HH:mm')}
        </Typography>
      </Box>
    </Box>
  );
}

export default SubscriptionInfosTab;
