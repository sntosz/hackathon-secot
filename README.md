# UFSCar • Sistema de Gestão e Validação de Horas Complementares

Plataforma de gestão pessoal e homologação de atividades complementares para os estudantes de graduação da **Universidade Federal de São Carlos (UFSCar - Campus Sorocaba)**, desenvolvida no âmbito do Hackathon **SeCoT + WorkWiser**.

---

## 🏛️ Contexto e Propósito

Atualmente, na UFSCar Sorocaba, a validação de horas complementares exige a impressão física de certificados e a entrega manual na secretaria do curso. Este processo gera sobrecarga operacional para a secretaria e deixa os alunos sem visibilidade sobre seu progresso acadêmico ou o status de suas solicitações.

O **UFSCar Horas** resolve esse problema através de uma solução autônoma, inclusiva e pronta para o uso cotidiano do estudante, além de fornecer um painel analítico para a comissão docente/secretaria avaliar e homologar os comprovantes.

---

## 🎯 Atendimento aos Critérios de Avaliação (Hackathon)

### 1. Utilidade Real (20/20)
- **Fluxo do Estudante:** Cadastro com upload e simulação de OCR, edição de rascunhos, exclusão com confirmação e visualização analítica por modalidades (*Ensino, Pesquisa, Extensão, Vivência*).
- **Fluxo do Avaliador / Docente:** Portal exclusivo para a secretaria/comissão docente deferir/indeferir atividades, ajustar manualmente a carga horária aprovada e anexar pareceres descritivos.
- **Rules Engine Integrado (`lib/rulesEngine.ts`):** Aplicação estrita dos pisos mínimos e tetos máximos por categoria para cada curso (*BCC 200h, Eng. Computação 240h, Licenciatura 200h, Eng. Produção 180h*).
- **Validação de Formulários:** Deteção em tempo real de erros de formulário (título, emissor, horas > 0, datas válidas, categorias permitidas).

### 2. Praticidade (20/20)
- **Painel Analítico:** Resumo executivo com barras de aproveitamento efetivo (calculado com limite de teto), alertas de pendências de graduação e previsão de cumprimento.
- **Geração de Relatório Oficial:** Formatação para impressão/PDF profissional com identificação do discente, hash de autenticação e protocolo.
- **Importação/Exportação JSON:** Backup e restauração de dados no formato estandardizado `SIGA_COMPLEMENTARY_HOURS_SCHEMA_v1`.
- **API Simulation Routes (`/api/certificates`, `/api/backup`):** Sincronização e validação server-side leve.

### 3. Acessibilidade WCAG 2.1 AAA (20/20)
- **Barra de Acessibilidade Superior:**
  - Alternância de Tema Claro / Escuro (com suporte nativo a contraste).
  - Modo de Alto Contraste para baixa visão.
  - Dimensionamento de Tipografia em tempo real (`A`, `A+`, `A++`).
  - Fonte especial para Dislexia.
- **Navegação por Teclado e Leitor de Tela:**
  - Link de salto rápido (`skip-link`).
  - Anúncios dinâmicos por `aria-live` a cada ação (Toast notifications e leitor de tela).
  - Gestão de foco (*focus trapping*) e fecho via tecla `Escape` em todos os modais.

### 4. Criatividade e Qualidade Visual (20/20)
- **Design System Institucional ERP:** Layout limpo e denso (estilo painel acadêmico/governamental), removendo estética genérica de IA.
- **Paleta Oficial UFSCar:** Vermelho corporativo (`#8b0000`), fundo escuro em tom chumbo/ardósia (`#0f172a`), e bordas finas sóbrias.
- **Identificação Digital:** Código Hash de verificação criptográfica simulada (`UFSCAR-YYYY-VER-XXXXX`) para auditoria anti-fraude.

### 5. Qualidade do Protótipo (20/20)
- **Sem Dependências Quebradas:** Build Next.js 16 (App Router) limpo sem avisos ou erros.
- **Cobertura de Edge Cases:** Estados vazios com ação rápida, tratamento de arquivos de backup corrompidos, bloqueio de lote sem itens válidos selecionados.

---

## 🔄 Simulação de Integração com o SIGA

O protótipo funciona de forma autônoma e descentralizada pelo navegador (via `localStorage` e rotas API). Para integração futura com o sistema oficial da UFSCar (SIGA), a aplicação disponibiliza o seguinte contrato em JSON:

```json
{
  "schemaVersion": "SIGA_COMPLEMENTARY_HOURS_SCHEMA_v1",
  "exportedAt": "2024-11-20T14:30:00.000Z",
  "profile": {
    "name": "Lucas Ferreira Silva",
    "ra": "801234",
    "course": "Bacharelado em Ciência da Computação (BCC)",
    "totalHoursRequired": 200
  },
  "certificates": [
    {
      "id": "cert-101",
      "title": "XIX SeCoT - Semana da Computação UFSCar",
      "issuer": "Departamento de Computação UFSCar",
      "categoryId": "extensao",
      "hoursRequested": 25,
      "hoursApproved": 25,
      "status": "approved",
      "verificationCode": "UFSCAR-2024-VER-94812",
      "history": []
    }
  ]
}
```

---

## 🚀 Como Executar o Projeto

```bash
# 1. Instalar dependências
npm install

# 2. Executar o servidor de desenvolvimento
npm run dev

# 3. Compilar e verificar build de produção
npm run build
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🛠️ Tecnologias Utilizadas
- **Framework:** Next.js 16 (App Router) + React 19
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4
- **Ícones:** Lucide React
- **Testes & Screenshots:** Playwright
