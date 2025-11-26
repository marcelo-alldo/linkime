import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { darken, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import clsx from 'clsx';
import { motion } from 'motion/react';
import PricingCard from './components/PricingCard';
import PricingItemType from './PricingItemType';
import { alpha, Grid, Paper, useMediaQuery, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useNavigate } from 'react-router';
import Step from './components/Step';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Logo from '@/components/theme-layouts/components/Logo';

/**
 * The simple pricing page.
 */
function Preview() {
  const [period, setPeriod] = useState<PricingItemType['period']>('ano');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const contact1Formatted = import.meta.env.VITE_APP_CONTACT_1 ? '55' + import.meta.env.VITE_APP_CONTACT_1.replace(/\D/g, '') : '';
  const contact2Formatted = import.meta.env.VITE_APP_CONTACT_2 ? '55' + import.meta.env.VITE_APP_CONTACT_2.replace(/\D/g, '') : '';

  const container = {
    show: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 100 },
    show: { opacity: 1, y: 0 },
  };

  // Variants para o logo "Linkime"
  const logoContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const linkVariant = {
    hidden: { opacity: 0, x: -140, rotate: -8, scale: 0.9 },
    show: {
      opacity: 1,
      x: 0,
      rotate: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 18,
        bounce: 0.45,
      },
    },
  };

  const iVariant = {
    hidden: { opacity: 0, y: -160, scale: 0.85 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.2,
        type: 'spring',
        stiffness: 520,
        damping: 17,
        bounce: 0.5,
      },
    },
  };

  const meVariant = {
    hidden: { opacity: 0, x: 150, rotate: 8, scale: 0.9 },
    show: {
      opacity: 1,
      x: 0,
      rotate: 0,
      scale: 1,
      transition: {
        delay: 0.4,
        type: 'spring',
        stiffness: 500,
        damping: 18,
        bounce: 0.45,
      },
    },
  };

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
          backgroundColor: (theme) => theme.palette.background.default,
          minHeight: '80vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
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
          <Box sx={{ marginLeft: 'auto', marginRight: '20px' }} display={'flex'} alignItems={'center'} height={'100%'}>
            <Button onClick={() => navigate('/sign-in')} variant="contained" sx={{ marginRight: '20px' }} color="secondary">
              Entrar
            </Button>
            <Button onClick={() => navigate('/sign-up')} variant="contained" color="primary">
              Criar conta
            </Button>
          </Box>
        </Box>

        <Box sx={{ width: '75%', padding: '20px', zIndex: 1 }} className="relative">
          <motion.div className="flex items-center justify-center" variants={logoContainer} initial="hidden" animate="show">
            <motion.span variants={linkVariant} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="relative z-10">
              <Typography component="span" fontSize={isMobile ? '48px' : '80px'} sx={{ color: 'white' }} fontWeight={700}>
                Link
              </Typography>
            </motion.span>
            <motion.span variants={iVariant} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
              <Typography component="span" fontSize={isMobile ? '48px' : '80px'} color="secondary" fontWeight={700}>
                i
              </Typography>
            </motion.span>
            <motion.span variants={meVariant} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="relative z-10">
              <Typography component="span" fontSize={isMobile ? '48px' : '80px'} sx={{ color: 'white' }} fontWeight={700}>
                me
              </Typography>
            </motion.span>
          </motion.div>
        </Box>
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            opacity: { duration: 1 },
            scale: { duration: 0.8, type: 'spring', stiffness: 500, damping: 30 },
          }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Box sx={{ width: { md: '60%', xs: '90%' }, padding: { md: '20px', xs: '10px' }, zIndex: 1 }} className="relative ">
            <Typography component={'p'} sx={{ color: 'white' }} fontSize={{ md: '40px', xs: '24px' }} fontWeight={500}>
              Transforme qualquer evento em uma máquina de conexões reais — direto pelo WhatsApp.
            </Typography>
            <Typography color="text.secondary" component={'p'} fontSize={'18px'} fontWeight={500} className="mt-8">
              Perfeito para qualquer evento: palestras, conferências, congressos, workshops, lives e muito mais.
            </Typography>
          </Box>
        </motion.div>
      </Box>
      <Box
        className="flex flex-col items-center px-6 py-10 sm:px-16 sm:pb-20 sm:pt-18"
        sx={{
          background: `radial-gradient(50% 40% at 50% 45%, ${alpha(theme.palette.secondary.main, 0.12)} 0%, rgba(0,0,0,0) 100%)`,
        }}
      >
        <div className="container">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <div>
                <Typography id="funcionalides" className="mb-5 text-4xl font-extrabold leading-[1.25] tracking-tight sm:text-7xl">
                  Por que usar o Linkime?
                </Typography>
                <Typography className="mt-0.5 text-xl" color="text.secondary">
                  Porque seu evento merece conexões de verdade — simples, rápidas e pelo WhatsApp.
                </Typography>
              </div>

              <div className="mt-12 flex items-center gap-2">
                <FuseSvgIcon size={30} color={'secondary'}>
                  heroicons-outline:link
                </FuseSvgIcon>{' '}
                <Typography style={{ fontSize: '16px' }}>Tranformar seu evento em uma ferramenta de conexões reais</Typography>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <FuseSvgIcon size={30} color={'secondary'}>
                  heroicons-outline:cog-8-tooth
                </FuseSvgIcon>{' '}
                <Typography style={{ fontSize: '16px' }}>Controle total sobre as conexões e interações durante o evento</Typography>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <FuseSvgIcon size={30} color={'secondary'}>
                  heroicons-outline:presentation-chart-line
                </FuseSvgIcon>{' '}
                <Typography style={{ fontSize: '16px' }}>Lista de participantes categorizado por setor e ramo de atividade</Typography>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <FuseSvgIcon size={30} color={'secondary'}>
                  heroicons-outline:calendar-date-range
                </FuseSvgIcon>{' '}
                <Typography style={{ fontSize: '16px' }}>Acesso a leads categorizados para seus próximos eventos</Typography>
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                sx={{
                  minHeight: 400,
                  backgroundImage: `url(assets/images/evento.png)`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center top',
                  backgroundSize: 'cover',
                }}
              ></Paper>
            </Grid>
          </Grid>
        </div>
      </Box>
      <Box className="flex flex-col items-center px-6 py-10 sm:px-16 sm:pb-20 sm:pt-18">
        <div className="container">
          <div>
            <Typography id="funcionalides" className="mb-5 text-center text-4xl font-extrabold leading-[1.25] tracking-tight sm:text-7xl">
              Como funciona?
            </Typography>
            <Typography className="mt-0.5 text-xl text-center" color="text.secondary">
              Conecte seus participantes de forma simples, rápida e gamificada — em apenas 6 passos.
            </Typography>
          </div>
          <Grid container spacing={4} className="mt-10">
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <Step
                icon={<FuseSvgIcon size={25}>heroicons-outline:calendar-days</FuseSvgIcon>}
                title="Crie o evento"
                description="Na aplicação você cria seu evento com todas as informações e detalhes necessários"
                stepNumber={1}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <Step
                icon={<FuseSvgIcon size={25}>heroicons-outline:qr-code</FuseSvgIcon>}
                title="Gere o QR Code"
                description="Sistema gera automaticamente um QR Code único para seu evento"
                stepNumber={2}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <Step
                icon={<FuseSvgIcon size={25}>heroicons-outline:device-phone-mobile</FuseSvgIcon>}
                title="Escaneie com o celular"
                description="Os participantes escaneiam o código gerado com a câmera do celular"
                stepNumber={3}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <Step
                icon={<FuseSvgIcon size={25}>heroicons-outline:paper-airplane</FuseSvgIcon>}
                title="Receba seu Linkime"
                description="Cada participante recebe seu QR Code pessoal do evento via WhatsApp"
                stepNumber={4}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <Step
                icon={<FuseSvgIcon size={25}>heroicons-outline:share</FuseSvgIcon>}
                title="Compartilhe e conecte"
                description="Mostre seu QR Code para os outros participantes para validar que fez o networking"
                stepNumber={5}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <Step
                icon={<FuseSvgIcon size={25}>heroicons-outline:trophy</FuseSvgIcon>}
                title="Ganhe pontos"
                description="Cada conexão validada rende pontos que podem ser trocados por prêmios"
                stepNumber={6}
              />
            </Grid>
          </Grid>
        </div>
      </Box>
      <Box sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }} className="px-6 py-10 sm:px-16 sm:py-12">
        <div className="mx-auto flex container flex-col items-center text-center">
          <Typography className="text-3xl font-extrabold leading-6 sm:text-5xl sm:leading-10">Crie sua conta gratuita,</Typography>
          <Typography className="mt-2 text-3xl font-extrabold leading-6 sm:text-5xl sm:leading-10 opacity-75" color="primary.ligth">
            para conhecer a ferramenta.
          </Typography>
          <Button onClick={() => navigate('/sign-up')} className="mt-8 px-12 text-lg" size="large" color="secondary" variant="contained">
            Quero conhecer
          </Button>
        </div>
      </Box>
      <div className="relative overflow-hidden px-6 pb-12 pt-8 sm:px-16 sm:pb-24 sm:pt-20">
        <svg
          className="pointer-events-none absolute inset-0 -z-1"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Box component="g" sx={{ color: 'divider' }} className="opacity-20" fill="none" stroke="currentColor" strokeWidth="100">
            <circle r="234" cx="196" cy="23" />
            <circle r="234" cx="790" cy="491" />
          </Box>
        </svg>
        <div id="planos" className="flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}>
            <div className="mt-1 text-center text-4xl font-extrabold leading-[1.25] tracking-tight sm:text-7xl">Seu evento no próximo nível</div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.15 } }}>
            <Typography className="mt-3 text-center tracking-tight sm:text-2xl" color="text.secondary">
              Torne seu evento mais profissional e entregue uma experiência inesquecível.
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
            <Box
              className="mt-8 flex items-center overflow-hidden rounded-full p-0.5 sm:mt-16"
              sx={{ backgroundColor: (theme) => darken(theme.palette.background.default, 0.05) }}
            >
              <Box
                component="button"
                className={clsx('h-9 cursor-pointer items-center rounded-full px-4 font-medium', period === 'ano' && 'shadow-sm')}
                onClick={() => setPeriod('ano')}
                sx={[
                  period === 'ano'
                    ? {
                        backgroundColor: 'background.paper',
                      }
                    : {
                        backgroundColor: '',
                      },
                ]}
                type="button"
              >
                Por ano
              </Box>
              <Box
                component="button"
                className={clsx('h-9 cursor-pointer items-center rounded-full px-4 font-medium', period === 'mês' && 'shadow-sm')}
                onClick={() => setPeriod('mês')}
                sx={[
                  period === 'mês'
                    ? {
                        backgroundColor: 'background.paper',
                      }
                    : {
                        backgroundColor: '',
                      },
                ]}
                type="button"
              >
                Por mês
              </Box>
            </Box>
          </motion.div>
        </div>
        <div className="mt-10 flex justify-center sm:mt-20">
          <div className="container">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 items-center gap-y-6 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3 lg:gap-0"
            >
              <motion.div variants={item}>
                <PricingCard
                  className="lg:rounded-r-none"
                  period={period}
                  url="/sign-up"
                  title="Starter"
                  yearlyPrice={period === 'mês' ? 'R$ 1.164' : 'R$ 77'}
                  monthlyPrice={period === 'mês' ? 'R$ 97' : 'R$ 924'}
                  buttonTitle="Comece agora"
                  details={
                    <div className="mt-8 space-y-2">
                      <Typography className="ml-0.5 leading-5">
                        <b>até 1000</b> Participantes por evento
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>10</b> eventos por mês
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>Compartilhado</b> com outros eventos
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>0</b> de créditos por mês
                      </Typography>

                      <Typography className="ml-0.5 leading-5">
                        Suporte via <b>e-mail e whatsapp</b>
                      </Typography>
                    </div>
                  }
                />
              </motion.div>
              <motion.div variants={item} className="lg:z-99 lg:overflow-visible">
                <PricingCard
                  className="lg:pb-28 lg:shadow-2xl"
                  url="/sign-up"
                  period={period}
                  title="Profissional"
                  subtitle="Fluxo padrão com infinitos leads e contatos"
                  yearlyPrice={period === 'mês' ? 'R$ 14.364' : 'R$ 957'}
                  monthlyPrice={period === 'mês' ? 'R$ 1.197' : 'R$ 11.484'}
                  buttonTitle="Comece agora"
                  details={
                    <div className="mt-8 space-y-2">
                      <Typography className="ml-0.5 leading-5">
                        <b>até 3000</b> Participantes por evento
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>20</b> eventos por mês
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>Compartilhado</b> com outros eventos
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>1.000</b> de créditos por mês
                      </Typography>

                      <Typography className="ml-0.5 leading-5">
                        Suporte via <b>telefone e whatsapp</b>
                      </Typography>
                    </div>
                  }
                  isPopular
                />
              </motion.div>
              <motion.div variants={item}>
                <PricingCard
                  className="lg:rounded-l-none"
                  period={period}
                  title="Premium Private"
                  target
                  url={`https://wa.me/${contact1Formatted}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre o Linkime PREMIUM.')}`}
                  subtitle="Fluxo customizada com infinitos leads e contatos"
                  yearlyPrice={period === 'mês' ? 'R$ 47.964' : 'R$ 3.197'}
                  monthlyPrice={period === 'mês' ? 'R$ 3.997' : 'R$ 38.364'}
                  buttonTitle="Falar com um especialista"
                  details={
                    <div className="mt-8 space-y-2">
                      <Typography className="ml-0.5 leading-5">
                        <b>até 5000</b> Participantes por evento
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>30</b> eventos por mês
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>Sem compartilhamento</b> com outros eventos
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>3.000</b> de créditos por mês
                      </Typography>

                      <Typography className="ml-0.5 leading-5">
                        Suporte via <b>telefone e whatsapp</b>
                      </Typography>
                    </div>
                  }
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      <div
        id="duvidas"
        className="flex flex-col items-center px-6 pb-8 pt-3 sm:px-16 sm:pb-20 sm:pt-18"
        style={{
          backgroundColor: theme.palette.background.paper,
          /* Substitua o caminho abaixo pela imagem desejada dentro de public/assets/images */
          backgroundImage: `url(/assets/images/woman.png)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '40% auto',
          backgroundPosition: 'left top',
        }}
      >
        <div className="container">
          <div>
            <Typography textAlign={'right'} className="text-4xl font-extrabold leading-[1.25] tracking-tight">
              Dúvidas frequentes
            </Typography>
            <Typography textAlign={'right'} className="mt-2  text-xl" color="text.secondary">
              Confira as respostas para as perguntas mais comuns e aproveite o Linkime com confiança.
            </Typography>
          </div>
          <Grid container spacing={1} className="mt-12 sm:mt-16">
            <Grid size={{ xs: 0, md: 4 }} />
            <Grid size={{ xs: 12, md: 8 }}>
              <Accordion
                defaultExpanded
                sx={{ background: (theme) => theme.palette.background.default, borderRadius: '15px !important', padding: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
                  <Typography variant="h5">Preciso instalar algum aplicativo?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography className="leading-6" color="text.secondary">
                    Não. O Linkime funciona totalmente online, sem necessidade de downloads. Basta acessar o site e criar o seu evento.
                  </Typography>
                  <Typography className="mt-2 leading-6" color="text.secondary">
                    Para <b>os participantes</b>, toda a interação é feita via WhatsApp, sem necessidade de instalar nada adicional.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>

            <Grid size={{ xs: 0, md: 4 }} />
            <Grid size={{ xs: 12, md: 8 }}>
              <Accordion sx={{ background: (theme) => theme.palette.background.default, borderRadius: '15px !important', padding: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
                  <Typography variant="h5">Para que servem os créditos?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography className="leading-6" color="text.secondary">
                    Os créditos permitem que você adquira leads qualificados de outros eventos, filtrando por categoria, público-alvo e ticket médio.
                    Assim, você expande sua base de contatos de forma estratégica e segmentada.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid size={{ xs: 0, md: 4 }} />
            <Grid size={{ xs: 12, md: 8 }}>
              <Accordion sx={{ background: (theme) => theme.palette.background.default, borderRadius: '15px !important', padding: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
                  <Typography variant="h5">O Linkime funciona para eventos de qualquer tamanho?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography className="leading-6" color="text.secondary">
                    Sim! O Linkime foi desenvolvido para atender eventos pequenos, médios e grandes, ajudando organizadores a melhorar a experiência
                    dos participantes e facilitar o networking.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid size={{ xs: 0, md: 4 }} />
            <Grid size={{ xs: 12, md: 8 }}>
              <Accordion sx={{ background: (theme) => theme.palette.background.default, borderRadius: '15px !important', padding: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
                  <Typography variant="h5">Posso cancelar meu plano quando quiser?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography className="leading-6" color="text.secondary">
                    Sim. Você pode solicitar o cancelamento a qualquer momento. Porém, o acesso permanece ativo até o fim do ciclo atual de cobrança,
                    já que o mês vigente não é reembolsável.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className="pt-20">
        <div className="container">
          <Grid container spacing={4} sx={{ padding: '20px' }} className="flex items-center justify-center text-white">
            {/* Logo e Slogan */}
            <Grid size={{ xs: 12, md: 4 }} className="flex items-center flex-col justify-center">
              <Logo size="large" />
              <Typography variant="h6" className="mt-2">
                Transforme qualquer evento em uma máquina de conexões reais — direto pelo WhatsApp.
              </Typography>
            </Grid>

            {/* Links Rápidos */}
            <Grid size={{ xs: 12, md: 4 }} className="flex items-center flex-col justify-center">
              <h3 className="font-semibold mb-2">Links Rápidos</h3>
              <ul className="text-sm flex flex-col items-center">
                <li>
                  <Button color={'secondary'} className="min-w-0" onClick={() => handlePosition(0)}>
                    Início
                  </Button>
                </li>
                <li>
                  <Button color={'secondary'} onClick={() => handlePosition('funcionalides')}>
                    Funcionalidades
                  </Button>
                </li>
                <li>
                  <Button color={'secondary'} onClick={() => handlePosition('planos')}>
                    Planos e Preços
                  </Button>
                </li>
                <li>
                  <Button color={'secondary'} onClick={() => handlePosition('duvidas')}>
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
                <li>
                  <Paper sx={{ background: 'white', mt: 2, p: 1 }}>
                    <img src="/assets/images/meta.png" alt="meta" className="inline-block mr-2" width={150} />
                  </Paper>
                </li>
              </ul>
            </Grid>
            <Grid size={12}>
              <div className=" border-t w-full border-gray-700 pt-4 text-center text-sm text-gray-400">
                © 2025 Alldo Tecnologia Ltda. Todos os direitos reservados. |{' '}
                <Button onClick={() => navigate('/terms-privacy')} color="secondary">
                  Termos de uso
                </Button>{' '}
                |{' '}
                <Button onClick={() => navigate('/terms-privacy')} color="secondary">
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

export default Preview;
