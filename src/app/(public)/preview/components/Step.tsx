import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';

export interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stepNumber: number | string;
  accentColor?: string; // opcional para customizar glow
  className?: string;
}

function Step({ icon, title, description, stepNumber, accentColor, className }: StepProps) {
  const theme = useTheme();
  const glowColor = accentColor || theme.palette.secondary.main;
  return (
    <Paper
      elevation={0}
      className={className}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: { xs: 3, md: 5 },
        borderRadius: 4,
        backgroundColor: alpha(theme.palette.background.paper, 0.4),
        backdropFilter: 'blur(4px)',
        boxShadow: `0 0 2px 0px ${alpha(theme.palette.divider, 0.3)}`,
        overflow: 'hidden',
      }}
    >
      {/* Ícone com glow */}
      <Box
        sx={{
          position: 'absolute',

          top: 16,
          left: 16,
          width: '56px',
          height: '56px',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: alpha(glowColor, 0.1),
          boxShadow: `0 0 18px 2px ${alpha(glowColor, 0.25)}, 0 0 32px 2px ${alpha(glowColor, 0.15)}`,
          color: glowColor,
        }}
      >
        {icon}
      </Box>
      {/* Conteúdo texto */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" fontWeight={700} color="common.white" className="mt-14">
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.4 }} className="text-2xl">
          {description}
        </Typography>
      </Box>
      {/* Número grande alinhado à direita */}
      <Typography
        component="span"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          fontSize: { xs: 54 },
          fontWeight: 700,
          lineHeight: 1,
          color: alpha(glowColor, 0.12),
          userSelect: 'none',
        }}
      >
        {String(stepNumber).padStart(2, '0')}
      </Typography>
    </Paper>
  );
}

export default Step;
