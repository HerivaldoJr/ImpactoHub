# ImpactoHub - Arquitetura Profissional Enterprise

**Desenvolvedor:** Herivaldo Junior  
**Versão:** 2.0 - Arquitetura Multi-Tenant com Área Administrativa Completa

---

## 🏗️ ARQUITETURA GERAL

### Duas Áreas Completamente Separadas:
1. **ÁREA ADMINISTRATIVA** - Gestão do negócio (Herivaldo Junior)
2. **ÁREA CLIENTE** - Plataforma de uso (OSCs e Investidores)

---

## 🗄️ BANCO DE DADOS (REFATORADO)

### Tabelas de Negócio (Admin)
- [ ] tenants (Clientes/OSCs com dados de contrato)
- [ ] subscription_plans (Planos de preço)
- [ ] subscriptions (Assinaturas ativas)
- [ ] invoices (Faturas e boletos)
- [ ] proposals (Propostas comerciais)
- [ ] licenses (Licenças e renovações)
- [ ] theme_customization (Cores, logos, branding por cliente)
- [ ] page_customization (Configuração da página inicial por cliente)

### Tabelas de Operação (Cliente)
- [ ] projects (Projetos com marcos e ações)
- [ ] project_milestones (Marcos cronológicos)
- [ ] project_actions (Ações do projeto)
- [ ] project_evidences (Fotos e evidências)
- [ ] beneficiaries (Atendidos com perfil detalhado)
- [ ] attendances (Atendimentos individual/grupo/familiar)
- [ ] referrals (Encaminhamentos)
- [ ] classes (Turmas e oficinas)
- [ ] class_schedule (Agenda de aulas)
- [ ] attendance_records (Frequência)
- [ ] indicators (Indicadores de impacto)
- [ ] reports (Relatórios e prestação de contas)

---

## 👨‍💼 ÁREA ADMINISTRATIVA (COMPLETA)

### Dashboard Executivo
- [ ] KPIs do negócio (clientes ativos, MRR, churn)
- [ ] Gráficos de receita e crescimento
- [ ] Alertas de renovação de licenças
- [ ] Últimas atividades dos clientes

### Gestão de Clientes
- [ ] Listagem de todos os clientes (OSCs/Investidores)
- [ ] Criar novo cliente com dados completos
- [ ] Editar dados do cliente
- [ ] Visualizar histórico de uso
- [ ] Ativar/desativar cliente
- [ ] Atribuir plano de preço

### Gestão de Cobrança
- [ ] Criar faturas automaticamente
- [ ] Gerar boletos (integração)
- [ ] Histórico de pagamentos
- [ ] Relatório de inadimplência
- [ ] Enviar lembretes de pagamento
- [ ] Registrar pagamentos manuais

### Propostas Comerciais
- [ ] Criar proposta com valores e condições
- [ ] Enviar proposta para cliente
- [ ] Rastrear status da proposta
- [ ] Converter proposta em contrato
- [ ] Histórico de propostas

### Gestão de Licenças
- [ ] Criar licenças com datas de validade
- [ ] Renovar licenças (automático/manual)
- [ ] Alertas de vencimento (30, 15, 7 dias)
- [ ] Histórico de renovações
- [ ] Relatório de licenças ativas

### Controle de Acessos
- [ ] Criar usuários administrativos
- [ ] Atribuir permissões granulares
- [ ] Gerenciar roles (admin, gerente, operacional)
- [ ] Logs de acesso
- [ ] Auditoria de ações

### Editor Visual da Página Inicial
- [ ] Editar hero section (título, descrição, imagem)
- [ ] Editar seções de funcionalidades
- [ ] Editar seção de depoimentos
- [ ] Editar call-to-action
- [ ] Editar footer
- [ ] Preview em tempo real
- [ ] Publicar/despublicar alterações

### Customização de Temas
- [ ] Editar cor primária
- [ ] Editar cor secundária
- [ ] Editar cores de texto
- [ ] Upload de logo
- [ ] Upload de favicon
- [ ] Editar nome da plataforma
- [ ] Editar fontes
- [ ] Preview para cliente

### Gestão de Planos
- [ ] Criar novo plano de preço
- [ ] Editar plano existente
- [ ] Definir funcionalidades por plano
- [ ] Definir limites (usuários, projetos, etc)
- [ ] Histórico de preços

### Relatórios Financeiros
- [ ] Receita total e por período
- [ ] Clientes por plano
- [ ] Taxa de churn
- [ ] Lifetime value
- [ ] Análise de crescimento
- [ ] Exportar relatórios

---

## 🏢 ÁREA CLIENTE (PLATAFORMA)

### Dashboard Principal
- [ ] Visão geral da organização
- [ ] KPIs principais (beneficiários, atendimentos, projetos)
- [ ] Últimas atividades
- [ ] Alertas e notificações
- [ ] Acesso rápido aos módulos

### 📊 Gestão de Projetos
- [ ] Criar projeto com informações completas
- [ ] Definir marcos cronológicos
- [ ] Criar ações por marco
- [ ] Upload de evidências (fotos)
- [ ] Acompanhamento de progresso
- [ ] Timeline do projeto
- [ ] Editar e deletar projetos
- [ ] Exportar documentação do projeto

### 👥 Gestão de Atendidos
- [ ] Cadastro completo de beneficiário
  - [ ] Dados pessoais
  - [ ] Dados socioeconômicos
  - [ ] Endereço
  - [ ] Contatos
  - [ ] Foto
  - [ ] Histórico de atendimentos
- [ ] Filtros avançados
  - [ ] Por idade
  - [ ] Por gênero
  - [ ] Por território
  - [ ] Por perfil socioeconômico
  - [ ] Por status
- [ ] Relatórios personalizados
- [ ] Exportação automática
- [ ] Evolução do beneficiário ao longo dos projetos

### 🤝 Gestão de Atendimentos
- [ ] Registrar atendimento individual
- [ ] Registrar atendimento em grupo
- [ ] Registrar atendimento familiar
- [ ] Personalizar formulários de atendimento
- [ ] Registrar encaminhamentos
- [ ] Gerar fichas completas
- [ ] Timeline com histórico de atendimentos
- [ ] Anexar documentos
- [ ] Vincular a beneficiários e projetos

### 🎓 Gestão de Oficinas
- [ ] Criar turmas/grupos
- [ ] Definir educador responsável
- [ ] Agendar aulas
- [ ] Criar lista de chamada automática
- [ ] Registrar frequência
- [ ] Relatório de frequência e evasão
- [ ] Acompanhamento de participação
- [ ] Gerar certificados

### 📈 Gráficos e Relatórios
- [ ] Dashboard em tempo real com indicadores
- [ ] Gráficos de impacto social
- [ ] Evolução dos beneficiários
- [ ] Análise de frequência
- [ ] Relatórios automáticos para prestação de contas
- [ ] Exportação em PDF
- [ ] Exportação em Excel
- [ ] Relatórios customizados
- [ ] Comparação período a período

### 🔔 Notificações
- [ ] Notificações em tempo real
- [ ] Alertas de vencimento de licença
- [ ] Alertas de relatórios pendentes
- [ ] Notificações por email
- [ ] Centro de notificações com histórico

---

## 🔐 Autenticação e Segurança

- [ ] Integração Manus OAuth
- [ ] Controle de acesso por tenant
- [ ] Isolamento de dados por cliente
- [ ] Logs de auditoria
- [ ] Recuperação de senha

---

## 🎨 Interface e UX

- [ ] Design responsivo
- [ ] Tema verde (impacto social)
- [ ] Componentes shadcn/ui
- [ ] Feedback visual
- [ ] Estados de loading
- [ ] Tratamento de erros

---

## 🧪 Testes

- [ ] Testes unitários (vitest)
- [ ] Testes de procedures tRPC
- [ ] Testes de isolamento de dados

---

## 🚀 Deploy

- [ ] Checkpoint final
- [ ] Documentação de uso

---

**Status:** Em Desenvolvimento  
**Última Atualização:** 09/02/2026
