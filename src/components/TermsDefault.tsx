import { Container, Typography, Divider, Box } from '@mui/material';

export function TermsDefault() {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box sx={{ py: 8, px: { xs: 2, md: 4 } }}>
        {/* TÍTULO GERAL */}
        <Typography variant="h4" gutterBottom>
          Termos de Uso e Política de Privacidade – Linkime
        </Typography>

        {/* TERMOS DE USO */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Termos de Uso
        </Typography>

        <Typography variant="body1" paragraph>
          Última atualização: 25/11/2025
        </Typography>

        <Typography variant="body1" paragraph>
          Bem-vindo ao Linkime. Ao utilizar nossos serviços, você concorda integralmente com estes Termos de Uso. Caso não concorde com algum ponto,
          recomendamos não utilizar a plataforma.
        </Typography>

        <Typography variant="h6" gutterBottom>
          1. Objeto
        </Typography>
        <Typography variant="body1" paragraph>
          O Linkime é uma plataforma que facilita interação, networking e compartilhamento de contatos entre participantes e organizadores de eventos,
          além de permitir a aquisição de leads de outros eventos por meio de créditos.
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. Acesso à Plataforma
        </Typography>
        <Typography variant="body1" paragraph>
          Para utilizar o Linkime, o usuário deve fornecer informações verdadeiras e atualizadas. A plataforma pode ser acessada via navegador, sem
          necessidade de instalação.
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. Cancelamento
        </Typography>
        <Typography variant="body1" paragraph>
          O usuário pode solicitar o cancelamento do plano a qualquer momento. Contudo, o cancelamento será efetivado apenas ao final do ciclo vigente
          de cobrança. Não há reembolso proporcional.
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. Créditos para Aquisição de Leads
        </Typography>
        <Typography variant="body1" paragraph>
          Dependendo do plano contratado, o usuário pode adquirir créditos para acessar e comprar leads de outros eventos, de acordo com categoria,
          perfil de público e ticket médio.
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. Compartilhamento de Dados para Geração de Leads
        </Typography>
        <Typography variant="body1" paragraph>
          Ao utilizar o Linkime, você concorda expressamente que as seguintes informações da sua empresa podem ser compartilhadas com outros
          organizadores de eventos dentro da plataforma:
        </Typography>

        <Typography variant="body2" paragraph sx={{ ml: 2 }}>
          • Nome da empresa <br />
          • Nome do representante <br />
          • Telefone de contato <br />• Faixa de faturamento da empresa
        </Typography>

        <Typography variant="body1" paragraph>
          Esse compartilhamento ocorre exclusivamente dentro do ecossistema Linkime, com o objetivo de facilitar networking e permitir transações de
          aquisição de leads.
        </Typography>

        <Typography variant="h6" gutterBottom>
          6. Responsabilidades do Usuário
        </Typography>
        <Typography variant="body1" paragraph>
          O usuário se compromete a utilizar a plataforma de forma legal, não violar seu funcionamento e respeitar a privacidade de outros
          participantes e organizadores.
        </Typography>

        <Typography variant="h6" gutterBottom>
          7. Responsabilidades da Plataforma
        </Typography>
        <Typography variant="body1" paragraph>
          O Linkime se compromete a disponibilizar o serviço conforme proposto, proteger dados conforme práticas adequadas e garantir estabilidade e
          funcionamento contínuo, salvo casos de manutenção ou força maior.
        </Typography>

        <Typography variant="h6" gutterBottom>
          8. Modificações nos Termos
        </Typography>
        <Typography variant="body1" paragraph>
          O Linkime pode alterar estes Termos a qualquer momento. As atualizações serão publicadas no site, e a continuidade do uso indica aceitação
          das novas condições.
        </Typography>

        <Typography variant="h6" gutterBottom>
          9. Foro
        </Typography>
        <Typography variant="body1" paragraph>
          Para resolver conflitos decorrentes do uso da plataforma, fica eleito o foro da comarca de [cidade/estado].
        </Typography>

        {/* POLÍTICA DE PRIVACIDADE */}
        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom sx={{ mt: 6 }}>
          Política de Privacidade
        </Typography>

        <Typography variant="body1" paragraph>
          Última atualização: 25/11/2025
        </Typography>

        <Typography variant="body1" paragraph>
          Esta Política de Privacidade explica como coletamos, usamos, armazenamos e compartilhamos seus dados.
        </Typography>

        <Typography variant="h6" gutterBottom>
          1. Dados Coletados
        </Typography>
        <Typography variant="body1" paragraph>
          Podemos coletar nome, telefone, e-mail, nome da empresa, faixa de faturamento, informações do evento e dados técnicos de navegação.
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. Finalidade da Coleta
        </Typography>
        <Typography variant="body1" paragraph>
          Os dados são utilizados para gerenciar eventos, facilitar networking, gerar leads qualificados e melhorar a experiência do usuário.
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. Compartilhamento de Dados
        </Typography>
        <Typography variant="body1" paragraph>
          Ao aceitar esta Política, você declara estar ciente e concorda que nome, telefone e faturamento da empresa podem ser compartilhados com
          outros organizadores e usuários cadastrados no Linkime, exclusivamente para fins de networking e operações de leads.
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. Armazenamento e Segurança
        </Typography>
        <Typography variant="body1" paragraph>
          Seus dados são armazenados em servidores seguros e protegidos por medidas adequadas de segurança da informação.
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. Direitos do Usuário
        </Typography>
        <Typography variant="body1" paragraph>
          Você pode solicitar acesso, correção, exclusão de dados ou revogação de consentimento, conforme previsto pela legislação.
        </Typography>

        <Typography variant="h6" gutterBottom>
          6. Retenção de Dados
        </Typography>
        <Typography variant="body1" paragraph>
          Os dados serão mantidos enquanto sua conta estiver ativa ou pelo tempo necessário para obrigações legais.
        </Typography>

        <Typography variant="h6" gutterBottom>
          7. Cookies
        </Typography>
        <Typography variant="body1" paragraph>
          Podemos utilizar cookies para melhorar navegação e personalizar sua experiência.
        </Typography>

        <Typography variant="h6" gutterBottom>
          8. Alterações na Política
        </Typography>
        <Typography variant="body1" paragraph>
          Podemos atualizar esta Política periodicamente. A continuidade do uso da plataforma significa concordância com as alterações.
        </Typography>
      </Box>
    </Container>
  );
}
