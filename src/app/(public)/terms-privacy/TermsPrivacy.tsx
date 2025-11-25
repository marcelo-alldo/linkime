import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useMediaQuery } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useNavigate } from 'react-router';
import { TermsDefault } from '@/components/TermsDefault';
import Logo from '@/components/theme-layouts/components/Logo';

/**
 * The simple pricing page.
 */
function TermsPrivacy() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const contact1Formatted = import.meta.env.VITE_APP_CONTACT_1 ? '55' + import.meta.env.VITE_APP_CONTACT_1.replace(/\D/g, '') : '';
  const contact2Formatted = import.meta.env.VITE_APP_CONTACT_2 ? '55' + import.meta.env.VITE_APP_CONTACT_2.replace(/\D/g, '') : '';

  const handlePosition = (position: number | string) => {
    if (typeof position === 'string') {
      const el = document.getElementById(position);

      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setVisible(window.scrollY > 200);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <IconButton
        onClick={() => handlePosition(0)}
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 2000,
          bgcolor: 'white',
          boxShadow: 3,
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity 0.3s',
          '&:hover': { bgcolor: 'primary.light' },
        }}
        size="large"
        aria-label="Voltar ao topo"
      >
        <KeyboardArrowUpIcon fontSize="inherit" />
      </IconButton>
    );
  }

  return (
    <div className="relative flex min-w-0 flex-auto flex-col overflow-hidden">
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          top: 0,
          left: 0,
          width: '100%',
          height: '80px',
          justifyContent: 'space-between',
          // backgroundColor: (theme) => theme.palette.secondary.main,
        }}
        className="bg-black/10"
      >
        <Box sx={{ marginLeft: 5, height: '100%' }} display={'flex'} alignItems={'center'}>
          <Logo />
        </Box>
        <Box sx={{ marginLeft: 'auto', marginRight: '20px' }} display={'flex'} alignItems={'center'} height={'100%'}>
          <Button onClick={() => navigate('/sign-in')} variant="contained" sx={{ marginRight: '20px' }} color="secondary">
            Entrar
          </Button>
          <Button onClick={() => navigate('/sign-up')} variant="contained" color="primary">
            Criar conta
          </Button>
        </Box>
      </Box>

      <TermsDefault />

      <ScrollToTopButton />
    </div>
  );
}

export default TermsPrivacy;
