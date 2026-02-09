import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  tenants,
  subscriptions,
  invoices,
  proposals,
  licenses,
  themeCustomizations,
  pageCustomizations,
  projects,
  beneficiaries,
  attendances,
  classes,
  indicators,
  reports,
  notifications
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/**
 * ============================================
 * USUÁRIOS
 * ============================================
 */

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * ============================================
 * TENANTS (CLIENTES)
 * ============================================
 */

export async function createTenant(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(tenants).values(data);
  return result;
}

export async function getTenantById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(tenants).where(eq(tenants.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllTenants() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(tenants);
}

export async function updateTenant(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(tenants).set(data).where(eq(tenants.id, id));
}

/**
 * ============================================
 * FATURAS E COBRANÇA
 * ============================================
 */

export async function createInvoice(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(invoices).values(data);
  return result;
}

export async function getInvoicesByTenant(tenantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(invoices).where(eq(invoices.tenantId, tenantId));
}

export async function updateInvoice(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(invoices).set(data).where(eq(invoices.id, id));
}

/**
 * ============================================
 * PROPOSTAS
 * ============================================
 */

export async function createProposal(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(proposals).values(data);
  return result;
}

export async function getProposalsByTenant(tenantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(proposals).where(eq(proposals.tenantId, tenantId));
}

export async function updateProposal(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(proposals).set(data).where(eq(proposals.id, id));
}

/**
 * ============================================
 * CUSTOMIZAÇÃO DE TEMA
 * ============================================
 */

export async function getThemeCustomization(tenantId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(themeCustomizations).where(eq(themeCustomizations.tenantId, tenantId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createOrUpdateThemeCustomization(tenantId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getThemeCustomization(tenantId);
  if (existing) {
    await db.update(themeCustomizations).set(data).where(eq(themeCustomizations.tenantId, tenantId));
  } else {
    await db.insert(themeCustomizations).values({ tenantId, ...data });
  }
}

/**
 * ============================================
 * CUSTOMIZAÇÃO DE PÁGINA
 * ============================================
 */

export async function getPageCustomization(tenantId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(pageCustomizations).where(eq(pageCustomizations.tenantId, tenantId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createOrUpdatePageCustomization(tenantId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getPageCustomization(tenantId);
  if (existing) {
    await db.update(pageCustomizations).set(data).where(eq(pageCustomizations.tenantId, tenantId));
  } else {
    await db.insert(pageCustomizations).values({ tenantId, ...data });
  }
}

/**
 * ============================================
 * PROJETOS
 * ============================================
 */

export async function createProject(tenantId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(projects).values({ tenantId, ...data });
  return result;
}

export async function getProjectsByTenant(tenantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(projects).where(eq(projects.tenantId, tenantId));
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateProject(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(projects).set(data).where(eq(projects.id, id));
}

/**
 * ============================================
 * BENEFICIÁRIOS
 * ============================================
 */

export async function createBeneficiary(tenantId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(beneficiaries).values({ tenantId, ...data });
  return result;
}

export async function getBeneficiariesByTenant(tenantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(beneficiaries).where(eq(beneficiaries.tenantId, tenantId));
}

export async function getBeneficiaryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(beneficiaries).where(eq(beneficiaries.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateBeneficiary(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(beneficiaries).set(data).where(eq(beneficiaries.id, id));
}

/**
 * ============================================
 * ATENDIMENTOS
 * ============================================
 */

export async function createAttendance(tenantId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(attendances).values({ tenantId, ...data });
  return result;
}

export async function getAttendancesByTenant(tenantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(attendances).where(eq(attendances.tenantId, tenantId));
}

export async function updateAttendance(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(attendances).set(data).where(eq(attendances.id, id));
}

/**
 * ============================================
 * OFICINAS/TURMAS
 * ============================================
 */

export async function createClass(tenantId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(classes).values({ tenantId, ...data });
  return result;
}

export async function getClassesByTenant(tenantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(classes).where(eq(classes.tenantId, tenantId));
}

export async function updateClass(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(classes).set(data).where(eq(classes.id, id));
}

/**
 * ============================================
 * INDICADORES
 * ============================================
 */

export async function createIndicator(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(indicators).values(data);
  return result;
}

export async function getIndicatorsByProject(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(indicators).where(eq(indicators.projectId, projectId));
}

export async function updateIndicator(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(indicators).set(data).where(eq(indicators.id, id));
}

/**
 * ============================================
 * RELATÓRIOS
 * ============================================
 */

export async function createReport(tenantId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(reports).values({ tenantId, ...data });
  return result;
}

export async function getReportsByTenant(tenantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(reports).where(eq(reports.tenantId, tenantId));
}

export async function updateReport(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(reports).set(data).where(eq(reports.id, id));
}

/**
 * ============================================
 * NOTIFICAÇÕES
 * ============================================
 */

export async function createNotification(tenantId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(notifications).values({ tenantId, ...data });
  return result;
}

export async function getNotificationsByTenant(tenantId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(notifications).where(eq(notifications.tenantId, tenantId));
}
