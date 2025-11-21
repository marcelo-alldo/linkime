import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Grid, useMediaQuery } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useNavigate } from 'react-router';
import { TermsDefault } from '@/components/TermsDefault';

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
          backgroundColor: (theme) => theme.palette.secondary.main,
          minHeight: '80px',
          backgroundImage: 'url(/assets/images/banner/back-banner.png)', // ajuste o caminho conforme necessário
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right top',
          backgroundSize: 'contain', // ajuste conforme o tamanho desejado
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            top: 0,
            left: 0,
            width: '100%',
            height: '80px',
            // backgroundColor: (theme) => theme.palette.secondary.main,
          }}
          className="bg-black/10"
        >
          <Box height="80%">
            <img className="h-full" src={import.meta.env.VITE_APP_LOGO}></img>
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
      </Box>

      <TermsDefault />

      <div className="pt-20" style={{ backgroundColor: 'black' }}>
        <div className="container">
          <Grid container spacing={4} sx={{ padding: '20px' }} className="flex items-center justify-center text-white">
            {/* Logo e Slogan */}
            <Grid size={{ xs: 12, md: 4 }} className="flex items-center flex-col justify-center">
              <img src={import.meta.env.VITE_APP_LOGO_FOOTER} width={'200px'} className="mb-5" alt="logo" />
              <Typography variant="h6" className="mt-2">
                Seu assistente inteligente,
                <br /> 24 horas por dia.
              </Typography>
            </Grid>

            {/* Links Rápidos */}
            <Grid size={{ xs: 12, md: 4 }} className="flex items-center flex-col justify-center">
              <h3 className="font-semibold mb-2">Links Rápidos</h3>
              <ul className="text-sm flex flex-col items-center">
                <li>
                  <Button color={'secondary'} className="min-w-0" onClick={() => navigate('/preview')}>
                    Início
                  </Button>
                </li>
                <li>
                  <Button color={'secondary'} onClick={() => navigate('/preview#funcionalides')}>
                    Funcionalidades
                  </Button>
                </li>
                <li>
                  <Button color={'secondary'} onClick={() => navigate('/preview#planos')}>
                    Planos e Preços
                  </Button>
                </li>
                <li>
                  <Button color={'secondary'} onClick={() => navigate('/preview#duvidas')}>
                    Duvidas frequentes
                  </Button>
                </li>
              </ul>
            </Grid>

            {/* Contato */}
            <Grid size={{ xs: 12, md: 4 }} className="flex items-center flex-col justify-center">
              <h3 className="font-semibold mb-2">Contato</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <WhatsAppIcon className="inline-block mr-2" sx={{ color: 'white', fontSize: '25px' }} />
                  <a
                    style={{
                      textDecoration: 'none',
                      background: 'none',
                      boxShadow: 'none',
                      color: 'inherit',
                    }}
                    target="_blank"
                    href={`https://wa.me/${contact1Formatted}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre o Alldo.')}`}
                    rel="noreferrer"
                  >
                    <Button color="secondary">{import.meta.env.VITE_APP_CONTACT_1}</Button>
                  </a>
                </li>
                {contact2Formatted && contact2Formatted.length > 10 && (
                  <li>
                    <WhatsAppIcon className="inline-block mr-2" sx={{ color: 'white', fontSize: '25px' }} />
                    <a
                      style={{
                        textDecoration: 'none',
                        background: 'none',
                        boxShadow: 'none',
                        color: 'inherit',
                      }}
                      target="_blank"
                      href={`https://wa.me/${contact2Formatted}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre o Alldo.')}`}
                      rel="noreferrer"
                    >
                      <Button color="secondary">{import.meta.env.VITE_APP_CONTACT_2}</Button>
                    </a>
                  </li>
                )}
              </ul>
            </Grid>
            <Grid size={12}>
              <div className=" border-t w-full border-gray-700 pt-4 text-center text-sm text-gray-400">
                © 2025 Alldo Tecnologia Ltda. Todos os direitos reservados. |{' '}
                <Button onClick={() => handlePosition('terms')} color="secondary">
                  Termos de uso
                </Button>{' '}
                |{' '}
                <Button onClick={() => handlePosition('start-privacy')} color="secondary">
                  Política de privacidade
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default TermsPrivacy;
