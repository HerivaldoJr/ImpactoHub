import * as db from "./db";
import { notifyOwner } from "./_core/notification";

/**
 * Sistema de Notificações ImpactoHub
 * 
 * Envia notificações em tempo real para usuários e emails automáticos
 */

export interface NotificationData {
  userId: number;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  link?: string;
  sendEmail?: boolean;
}

/**
 * Cria uma notificação no banco de dados
 * Se sendEmail for true, também envia notificação por email via sistema Manus
 */
export async function createNotification(data: NotificationData) {
  try {
    // Criar notificação no banco
    await db.createNotification({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link,
      emailSent: false,
    });

    // Se solicitado envio de email, usar sistema Manus
    if (data.sendEmail) {
      try {
        await notifyOwner({
          title: `[ImpactoHub] ${data.title}`,
          content: `Usuário ID ${data.userId}: ${data.message}`,
        });
        
        // Atualizar flag de email enviado
        // (Simplificado - em produção, buscar a notificação recém-criada e atualizar)
      } catch (emailError) {
        console.error('[Notifications] Failed to send email:', emailError);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('[Notifications] Failed to create notification:', error);
    throw error;
  }
}

/**
 * Notifica investidores sobre atualização em projeto
 */
export async function notifyInvestorsAboutProjectUpdate(
  projectId: number,
  title: string,
  message: string
) {
  try {
    // Buscar investidores que investiram neste projeto
    const investments = await db.getProjectInvestmentsByProjectId(projectId);
    
    // Notificar cada investidor
    for (const investment of investments) {
      if (investment.status === 'approved') {
        const investor = await db.getInvestorById(investment.investorId);
        if (investor) {
          await createNotification({
            userId: investor.userId,
            type: 'info',
            title,
            message,
            link: `/investor`,
            sendEmail: true,
          });
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('[Notifications] Failed to notify investors:', error);
    throw error;
  }
}

/**
 * Notifica investidor sobre aprovação de investimento
 */
export async function notifyInvestorAboutInvestmentApproval(investmentId: number) {
  try {
    const investment = await db.getProjectInvestmentById(investmentId);
    if (!investment) return;

    const investor = await db.getInvestorById(investment.investorId);
    if (!investor) return;

    const project = await db.getProjectById(investment.projectId);
    const projectName = project?.name || 'Projeto';

    await createNotification({
      userId: investor.userId,
      type: 'success',
      title: 'Investimento Aprovado',
      message: `Seu investimento de R$ ${parseFloat(investment.amount).toLocaleString('pt-BR')} no projeto "${projectName}" foi aprovado!`,
      link: `/investor`,
      sendEmail: true,
    });

    return { success: true };
  } catch (error) {
    console.error('[Notifications] Failed to notify investor about approval:', error);
    throw error;
  }
}

/**
 * Notifica OSC sobre novo investimento
 */
export async function notifyOSCAboutNewInvestment(investmentId: number) {
  try {
    const investment = await db.getProjectInvestmentById(investmentId);
    if (!investment) return;

    const project = await db.getProjectById(investment.projectId);
    if (!project) return;

    const organization = await db.getOrganizationById(project.organizationId);
    if (!organization) return;

    await createNotification({
      userId: organization.userId,
      type: 'success',
      title: 'Novo Investimento Recebido',
      message: `O projeto "${project.name}" recebeu um novo investimento de R$ ${parseFloat(investment.amount).toLocaleString('pt-BR')}!`,
      link: `/osc`,
      sendEmail: true,
    });

    return { success: true };
  } catch (error) {
    console.error('[Notifications] Failed to notify OSC about investment:', error);
    throw error;
  }
}

/**
 * Notifica investidores sobre relatório submetido
 */
export async function notifyInvestorsAboutReportSubmission(reportId: number) {
  try {
    const report = await db.getReportById(reportId);
    if (!report) return;

    const project = await db.getProjectById(report.projectId);
    if (!project) return;

    await notifyInvestorsAboutProjectUpdate(
      report.projectId,
      'Novo Relatório Disponível',
      `O projeto "${project.name}" submeteu um novo relatório de ${
        report.type === 'financial' ? 'prestação de contas financeira' :
        report.type === 'impact' ? 'impacto social' :
        report.type === 'activity' ? 'atividades' :
        'acompanhamento geral'
      }.`
    );

    return { success: true };
  } catch (error) {
    console.error('[Notifications] Failed to notify investors about report:', error);
    throw error;
  }
}

/**
 * Notifica OSC sobre aprovação de organização
 */
export async function notifyOSCAboutApproval(organizationId: number) {
  try {
    const organization = await db.getOrganizationById(organizationId);
    if (!organization) return;

    await createNotification({
      userId: organization.userId,
      type: 'success',
      title: 'Organização Aprovada',
      message: `Parabéns! Sua organização "${organization.name}" foi aprovada e agora você tem acesso completo ao sistema.`,
      link: `/osc`,
      sendEmail: true,
    });

    return { success: true };
  } catch (error) {
    console.error('[Notifications] Failed to notify OSC about approval:', error);
    throw error;
  }
}

/**
 * Notifica investidor sobre aprovação de perfil
 */
export async function notifyInvestorAboutApproval(investorId: number) {
  try {
    const investor = await db.getInvestorById(investorId);
    if (!investor) return;

    await createNotification({
      userId: investor.userId,
      type: 'success',
      title: 'Perfil Aprovado',
      message: `Parabéns! Seu perfil de investidor "${investor.name}" foi aprovado e agora você pode realizar investimentos.`,
      link: `/investor`,
      sendEmail: true,
    });

    return { success: true };
  } catch (error) {
    console.error('[Notifications] Failed to notify investor about approval:', error);
    throw error;
  }
}
