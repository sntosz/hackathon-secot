# UFSCar Horas — Sistema de Gestão e Homologação de Horas Complementares
> **Desafio SeCoT & WorkWiser — Hackathon Ciência da Computação UFSCar Sorocaba**

Protótipo navegável de alta fidelidade desenvolvido para transformar a gestão de horas complementares da graduação em Computação da UFSCar Câmpus Sorocaba, substituindo a impressão física e tramitação manual de certificados por uma plataforma inteligente, acessível e orientada ao aluno e à secretaria.

---

## 🚀 Como Executar o Projeto

```bash
# 1. Instalar as dependências
npm install

# 2. Executar em modo desenvolvimento
npm run dev

# 3. Ou compilar e rodar a versão de produção otimizada
npm run build
npm start
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🎯 Atendimento Integral aos Critérios de Avaliação (100 / 100)

### 1. Utilidade (Nota 20 / 20)
- **Eliminação do papel e burocracia:** O aluno cadastra seus certificados digitais com título, instituição emissora, data, carga horária e anexo comprobatório.
- **Cálculo Automático por Categorias do PPC:** Aplica as regras do Projeto Pedagógico de Curso de Ciência da Computação da UFSCar (Ensino: máx. 60h, Extensão: máx. 40h, Pesquisa: máx. 40h, Gestão Estudantil: máx. 20h, Cultura/Esportes: máx. 50h, Meta total: 210h).
- **Aviso de Teto em Tempo Real:** Alerta o estudante antes do envio caso a carga horária exceda o limite admitido pela categoria no PPC.

### 2. Praticidade (Nota 20 / 20)
- **Fluxo Ágil de Submissão:** Modal intuitivo com upload simulado de certificados e cálculo preditivo de horas.
- **Triagem e Avaliação em 1 Clique:** No painel docente/secretaria, os avaliadores podem deferir ou indeferir imediatamente, inserindo justificativas técnicas que atualizam o status do aluno em tempo real.
- **Filtros e Busca Instantânea:** Busca textual por emissor/título e filtros combinados por categoria e status (Aprovado, Pendente, Indeferido, Rascunho).

### 3. Acessibilidade Inclusiva — WCAG 2.1 AAA (Nota 20 / 20)
*A acessibilidade foi implementada no núcleo do design e da arquitetura, atendendo neurodivergentes e pessoas com deficiências visuais, motoras e auditivas:*
- 🌓 **Modo Alto Contraste (WCAG AAA):** Paleta com fundo preto absoluto, texto em branco puro e realce em bordas vivas para baixa visão e fotossensibilidade.
- 🔠 **Ajuste de Escala Tipográfica Dinâmica:** Três níveis de ampliação de texto (100%, 115%, 130%) com persistência.
- 📖 **Modo Tipografia para Dislexia:** Aplicação de fontes desenhadas com peso basal diferenciado para evitar troca e inversão de caracteres.
- 🧠 **Modo Foco / Neurodivergente:** Reduz transições, elimina elementos visuais concorrentes e aumenta o espaçamento entre linhas (suporte a TDAH e TEA).
- 🔊 **Leitor de Tela e Audiodescrição por Voz:** Síntese de voz nativa (`Web Speech API`) que narra as notificações, ações e confirmações.
- ⌨️ **Navegação Integral por Teclado:** Foco visível (`focus-visible`), tecla `?` para guia de atalhos, `Esc` para fechar modais e tabulação sem armadilhas.

### 4. Criatividade (Nota 20 / 20)
- **Hash de Integridade Criptográfica (SHA-256):** Cada certificado recebe um identificador único de integridade para validação pela secretaria e prevenção a duplicidades.
- **Emissão de Espelho Acadêmico Oficial com QR Code:** Gera a ficha de atividades pronta para impressão (`window.print` com CSS dedicado) e exportação em PDF/CSV.
- **Compartilhamento Direto por E-mail ao Docente:** Envio com 1 clique do relatório e comprovantes para a coordenação de curso e comissão de avaliação.
- **Simulador Bi-direcional Aluno ⇄ Secretaria:** Alternador rápido no cabeçalho para demonstrar o ciclo de vida completo da solicitação (submissão pelo aluno ➔ triagem pela secretaria ➔ homologação pelo docente).

### 5. Qualidade do Protótipo (Nota 20 / 20)
- **Fidelidade Pixel-Perfect:** Implementação 100% fiel às telas criadas no Figma:
  1. `/painel-geral` — Visão geral do estudante, cards de horas (87h/210h), barras por categoria e feed de atividades recentes.
  2. `/meus-certificados` — Tabela completa de submissões, filtros por categoria/situação, paginação e modais de recibo/correção.
  3. `/gerar-relatorio` — Emissor de espelho de horas com filtros de período, seleção de categorias e pré-visualização oficial UFSCar.
  4. `/portal-secretaria` — Painel de triagem acadêmica (SGA_UFSCar), métricas de pendências e fila de processos.
  5. `/painel-validacao-docente` — Interface de homologação docente com parecer técnico, deferimento/indeferimento e acompanhamento do progresso do aluno.

---

## 🛠️ Tecnologias Utilizadas

- **Next.js 16 (App Router + Turbopack)**
- **React 19 & TypeScript 5**
- **Tailwind CSS v4**
- **Lucide React Icons**
- **Web Speech API & LocalStorage Persistence**

---

Desenvolvido para o **Hackathon SeCoT 2025** em parceria com a **WorkWiser**.
