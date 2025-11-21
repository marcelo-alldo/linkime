import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { darken, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import clsx from 'clsx';
import { motion } from 'motion/react';
import PricingCard from './components/PricingCard';
import PricingFeatureItem from './components/PricingFeatureItem';
import PricingItemType from './PricingItemType';
import { Grid, useMediaQuery } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useNavigate } from 'react-router';

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
          minHeight: '80vh',
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
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ opacity: { duration: 0.3 }, x: { duration: 1, ease: 'easeOut' } }}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            minWidth: '100%',
            minHeight: '70%',
            backgroundImage: `url(${import.meta.env.VITE_APP_3D_LOGO})`, // ajuste o caminho conforme necessário
            backgroundRepeat: 'no-repeat',
            backgroundPosition: isMobile ? '90% 300px' : '90% 25px',
            backgroundSize: 'contain', // ajuste conforme o tamanho desejado
          }}
        ></motion.div>

        <motion.div
          initial={{ rotate: 90 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 3, ease: 'linear' }}
          style={{ position: 'absolute', bottom: -100, left: -150, width: '600px', height: '600px', transformOrigin: '50% 50%' }}
          className="hidden md:block"
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: 'url(/assets/images/banner/world.png)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundSize: 'contain',
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            opacity: { duration: 1 },
            scale: { duration: 0.8, type: 'spring', stiffness: 500, damping: 30 },
          }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Box sx={{ width: '75%', padding: '20px', zIndex: 1 }} className="relative">
            <div className="absolute inset-0 rounded-xl  bg-black/90 to-transparent"></div>
            <Typography variant="body2" fontSize={'40px'} sx={{ color: 'white' }} className="relative z-10">
              Oi! Sou o{' '}
              <Typography component="span" fontSize={'40px'} color="secondary" fontWeight={700}>
                Alldo
              </Typography>
              , <br />
              converso
              <Typography component="span" fontSize={'40px'} color="secondary" fontWeight={700}>
                {' '}
                como gente
              </Typography>{' '}
              <br></br>e automatizo como{' '}
              <Typography component="span" fontSize={'40px'} color="secondary" fontWeight={700}>
                IA
              </Typography>
              .
            </Typography>
          </Box>
          <Box sx={{ width: '60%', padding: '20px', zIndex: 1 }} className="relative hidden md:block">
            <Typography component={'p'} sx={{ color: 'white' }} fontSize={'20px'} fontWeight={500}>
              Criado com inteligência artificial,
              <br />
              <Typography sx={{ color: 'white' }} component="span" fontSize={'20px'} fontWeight={800}>
                {' '}
                disponível 24/7.
              </Typography>{' '}
              Alldo transforma atendimento em experiência.
            </Typography>
          </Box>
        </motion.div>
      </Box>
      <Paper className="flex flex-col items-center px-6 py-10 sm:px-16 sm:pb-20 sm:pt-18">
        <div className="container">
          <div>
            <Typography id="funcionalides" className="mb-5 text-center text-4xl font-extrabold leading-[1.25] tracking-tight sm:text-7xl">
              Para quais empresas o Alldo foi feito?
            </Typography>
            <Typography className="mt-0.5 text-xl text-justify" color="text.secondary">
              <strong>Alldo é o assistente virtual ideal para empresas que não querem perder nenhum cliente.</strong> Perfeito para clínicas, salões,
              consultórios, estúdios, imobiliárias e qualquer negócio que dependa de agendamentos ou triagem de clientes, o Alldo atende
              automaticamente pelo WhatsApp, 24 horas por dia, 7 dias por semana. Ele responde dúvidas, marca horários, organiza sua agenda e ainda
              atua como um SDR inteligente — filtrando potenciais clientes com perguntas estratégicas, como renda, disponibilidade ou perfil de
              compra, antes de passar o lead para você.
            </Typography>
          </div>
          <div className="mt-12 grid w-full grid-cols-1 gap-x-6 gap-y-12 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
            <PricingFeatureItem
              icon="heroicons-outline:calendar-days"
              title="Agenda cheia? Deixa que o Alldo organiza."
              subtitle="O Alldo marca, remarca e cancela compromissos automaticamente via WhatsApp. Ele sincroniza com sua agenda em tempo real e evita conflitos de horários, mantendo sua rotina organizada sem esforço — mesmo enquanto você dorme."
            />
            <PricingFeatureItem
              icon="heroicons-outline:funnel"
              title="Filtre leads e ganhe."
              subtitle="O Alldo conversa com seus clientes pelo WhatsApp e identifica quem realmente está pronto para comprar. Ele faz perguntas estratégicas, como renda, localização ou necessidade, e só repassa os leads qualificados para você ou seu time de vendas."
            />
            <PricingFeatureItem
              icon="heroicons-outline:clock"
              title="Seu atendimento não tira férias."
              subtitle="O Alldo está disponível 24 horas por dia, 7 dias por semana, atendendo seus clientes pelo WhatsApp mesmo fora do expediente. Ele responde dúvidas, agenda compromissos, qualifica leads e mantém seu negócio ativo o tempo todo."
            />
          </div>
        </div>
      </Paper>
      <Box sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }} className="px-6 py-10 sm:px-16 sm:py-12">
        <div className="mx-auto flex container flex-col items-center text-center">
          <Typography className="text-3xl font-extrabold leading-6 sm:text-5xl sm:leading-10">Crie sua conta gratuita,</Typography>
          <Typography className="mt-2 text-3xl font-extrabold leading-6 sm:text-5xl sm:leading-10 opacity-75" color="primary.ligth">
            para conhecer a ferramenta. <br></br>Não precisa cadastrar cartão.
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
            <div className="mt-1 text-center text-4xl font-extrabold leading-[1.25] tracking-tight sm:text-7xl">Seu negócio não para.</div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.15 } }}>
            <Typography className="mt-3 text-center tracking-tight sm:text-2xl" color="text.secondary">
              Com o Alldo, seu atendimento também não.
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
                  title="Atendimento"
                  yearlyPrice={period === 'mês' ? 'R$ 2.268' : 'R$ 149'}
                  monthlyPrice={period === 'mês' ? 'R$ 189' : 'R$ 1.788'}
                  buttonTitle="Comece agora"
                  details={
                    <div className="mt-8 space-y-2">
                      <Typography className="ml-0.5 leading-5">
                        <b>até 500</b> Leads / Contatos ativos
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>0</b> Fluxo de atendimento
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>Sem</b> Inteligência Artificial
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>até 5</b> Atendentes
                      </Typography>

                      <Typography className="ml-0.5 leading-5">
                        Atendimento via <b>WhatsApp API Oficial</b>
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        Funções <b>Padrões</b>
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
                  title="Padrão"
                  subtitle="Fluxo padrão com infinitos leads e contatos"
                  yearlyPrice={period === 'mês' ? 'R$ 5.988' : 'R$ 399'}
                  monthlyPrice={period === 'mês' ? 'R$ 499' : 'R$ 4.788'}
                  buttonTitle="Comece agora"
                  details={
                    <div className="mt-8 space-y-2">
                      <Typography className="ml-0.5 leading-5">
                        <b>até 2.000</b> Leads / Contatos
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>1</b> Fluxo de atendimento
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>Com</b> Inteligência Artificial
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>até 10</b> Atendentes
                      </Typography>
                      <Typography className="ml-0.5 leading-5">Fluxo padrão</Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>Google</b> Calendar
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        Atendimento via <b>WhatsApp API Oficial</b>
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        Funções <b>Padrões</b>
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
                  title="Customizada"
                  target
                  url={`https://wa.me/${contact1Formatted}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre o Alldo CUSTOMIZADO.')}`}
                  subtitle="Fluxo customizada com infinitos leads e contatos"
                  yearlyPrice={period === 'mês' ? 'R$ 8.388' : 'R$ 559'}
                  monthlyPrice={period === 'mês' ? 'R$ 699' : 'R$ 6.708'}
                  buttonTitle="Falar com um especialista"
                  details={
                    <div className="mt-8 space-y-2">
                      <Typography className="ml-0.5 leading-5">
                        <b>até 5.000</b> Leads / Contatos ativos
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>até 3</b> Fluxos de atendimento
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>Com</b> Inteligência Artificial
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>até 20</b> Atendentes
                      </Typography>
                      <Typography className="ml-0.5 leading-5">Fluxo personalizado</Typography>
                      <Typography className="ml-0.5 leading-5">
                        <b>Google</b> Calendar
                      </Typography>

                      <Typography className="ml-0.5 leading-5">
                        Atendimento via <b>WhatsApp API Oficial</b>
                      </Typography>
                      <Typography className="ml-0.5 leading-5">
                        Funções <b>Avançadas</b>
                      </Typography>
                    </div>
                  }
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      <div id="duvidas" className="flex flex-col items-center px-6 pb-8 pt-3 sm:px-16 sm:pb-20 sm:pt-18" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div>
            <Typography className="text-4xl font-extrabold leading-[1.25] tracking-tight">Dúvidas frequentes</Typography>
            <Typography className="mt-2 max-w-3xl text-xl" color="text.secondary">
              Ficou alguma dúvida? Converse com um especialista e descubra como o Alldo pode te ajudar.
            </Typography>
          </div>
          <div className="mt-12 grid w-full grid-cols-1 gap-x-6 gap-y-12 sm:mt-16 sm:grid-cols-2 lg:gap-x-16">
            <div>
              <Typography className="text-xl font-semibold">Preciso estar online para o Alldo funcionar?</Typography>
              <Typography className="mt-2 leading-6" color="text.secondary">
                Não. O Alldo funciona 24 horas por dia, 7 dias por semana, sem que você precise estar presente. Ele cuida do atendimento enquanto você
                foca em outras tarefas — ou simplesmente descansa.
              </Typography>
            </div>
            <div>
              <Typography className="text-xl font-semibold">O Alldo serve para qualquer tipo de negócio?</Typography>
              <Typography className="mt-0.5 leading-6" color="text.secondary">
                Sim! O Alldo é ideal para empresas que recebem mensagens de clientes e precisam agendar, vender ou qualificar. Ele é usado por
                clínicas, salões, consultórios, imobiliárias, estúdios, prestadores de serviço e muito mais.
              </Typography>
            </div>
            <div>
              <Typography className="text-xl font-semibold">O Alldo substitui um atendente humano?</Typography>
              <Typography className="mt-2 leading-6" color="text.secondary">
                O Alldo automatiza tarefas repetitivas como responder perguntas frequentes, agendar compromissos e filtrar clientes. Ele não substitui
                sua equipe, mas atua como um reforço inteligente que trabalha sem parar — e sem erros.
              </Typography>
            </div>
            <div>
              <Typography className="text-xl font-semibold">Posso cancelar meu plano a qualquer momento?</Typography>
              <Typography className="mt-2 leading-6" color="text.secondary">
                Sim! Você pode solicitar o cancelamento a qualquer momento.
              </Typography>
              <Typography className="mt-2 leading-6" color="text.secondary">
                Para <b>planos mensais</b>, o cancelamento é efetivado até o final do mês vigente, sem cobrança no mês seguinte.
              </Typography>
              <Typography className="mt-2 leading-6" color="text.secondary">
                Para <b>planos anuais</b>, o cancelamento também é feito até o fim do mês atual, mas o valor investido em personalizações e
                configurações iniciais não é reembolsável.
              </Typography>
            </div>
          </div>
        </div>
      </div>
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
