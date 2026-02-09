import { 
  int, 
  mysqlEnum, 
  mysqlTable, 
  text, 
  timestamp, 
  varchar,
  decimal,
  boolean,
  json,
  date,
  longtext
} from "drizzle-orm/mysql-core";

/**
 * ============================================
 * TABELAS DE NEGÓCIO (ADMINISTRAÇÃO)
 * ============================================
 */

/**
 * Usuários do sistema
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "client_admin", "client_user", "investor"]).default("client_user").notNull(),
  tenantId: int("tenantId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Clientes/Tenants (OSCs, Investidores)
 */
export const tenants = mysqlTable("tenants", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["osc", "investor", "both"]).notNull(),
  cnpj: varchar("cnpj", { length: 20 }).unique(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  website: varchar("website", { length: 255 }),
  description: text("description"),
  logo: varchar("logo", { length: 500 }),
  status: mysqlEnum("status", ["pending", "active", "suspended", "inactive"]).default("pending").notNull(),
  subscriptionPlanId: int("subscriptionPlanId"),
  licenseExpiresAt: timestamp("licenseExpiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = typeof tenants.$inferInsert;

/**
 * Planos de preço
 */
export const subscriptionPlans = mysqlTable("subscription_plans", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  monthlyPrice: decimal("monthlyPrice", { precision: 10, scale: 2 }).notNull(),
  yearlyPrice: decimal("yearlyPrice", { precision: 10, scale: 2 }),
  maxUsers: int("maxUsers"),
  maxProjects: int("maxProjects"),
  maxBeneficiaries: int("maxBeneficiaries"),
  features: json("features"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

/**
 * Assinaturas ativas
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull(),
  planId: int("planId").notNull(),
  status: mysqlEnum("status", ["active", "canceled", "expired"]).default("active").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  autoRenew: boolean("autoRenew").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Faturas e boletos
 */
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull(),
  subscriptionId: int("subscriptionId"),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).unique().notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "paid", "overdue", "canceled"]).default("pending").notNull(),
  dueDate: date("dueDate").notNull(),
  paidDate: date("paidDate"),
  boletoUrl: varchar("boletoUrl", { length: 500 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

/**
 * Propostas comerciais
 */
export const proposals = mysqlTable("proposals", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull(),
  proposalNumber: varchar("proposalNumber", { length: 50 }).unique().notNull(),
  planId: int("planId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["draft", "sent", "accepted", "rejected", "expired"]).default("draft").notNull(),
  validUntil: date("validUntil").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = typeof proposals.$inferInsert;

/**
 * Licenças
 */
export const licenses = mysqlTable("licenses", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull(),
  licenseKey: varchar("licenseKey", { length: 100 }).unique().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  renewalDate: timestamp("renewalDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type License = typeof licenses.$inferSelect;
export type InsertLicense = typeof licenses.$inferInsert;

/**
 * Customização de tema por cliente
 */
export const themeCustomizations = mysqlTable("theme_customizations", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull().unique(),
  primaryColor: varchar("primaryColor", { length: 7 }).default("#10b981").notNull(),
  secondaryColor: varchar("secondaryColor", { length: 7 }).default("#059669").notNull(),
  textColor: varchar("textColor", { length: 7 }).default("#000000").notNull(),
  backgroundColor: varchar("backgroundColor", { length: 7 }).default("#ffffff").notNull(),
  logoUrl: varchar("logoUrl", { length: 500 }),
  faviconUrl: varchar("faviconUrl", { length: 500 }),
  platformName: varchar("platformName", { length: 255 }).default("ImpactoHub").notNull(),
  fontFamily: varchar("fontFamily", { length: 100 }).default("Inter").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ThemeCustomization = typeof themeCustomizations.$inferSelect;
export type InsertThemeCustomization = typeof themeCustomizations.$inferInsert;

/**
 * Customização de página inicial
 */
export const pageCustomizations = mysqlTable("page_customizations", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull().unique(),
  heroTitle: text("heroTitle"),
  heroDescription: text("heroDescription"),
  heroImage: varchar("heroImage", { length: 500 }),
  featuresSection: json("featuresSection"),
  testimonialSection: json("testimonialSection"),
  ctaText: varchar("ctaText", { length: 255 }),
  footerText: text("footerText"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PageCustomization = typeof pageCustomizations.$inferSelect;
export type InsertPageCustomization = typeof pageCustomizations.$inferInsert;

/**
 * ============================================
 * TABELAS DE OPERAÇÃO (CLIENTE)
 * ============================================
 */

/**
 * Projetos
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  objectives: text("objectives"),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  budget: decimal("budget", { precision: 15, scale: 2 }),
  status: mysqlEnum("status", ["planning", "active", "completed", "suspended"]).default("planning").notNull(),
  targetAudience: varchar("targetAudience", { length: 255 }),
  location: varchar("location", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Marcos cronológicos do projeto
 */
export const projectMilestones = mysqlTable("project_milestones", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "completed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectMilestone = typeof projectMilestones.$inferSelect;
export type InsertProjectMilestone = typeof projectMilestones.$inferInsert;

/**
 * Ações do projeto
 */
export const projectActions = mysqlTable("project_actions", {
  id: int("id").autoincrement().primaryKey(),
  milestoneId: int("milestoneId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "in_progress", "completed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectAction = typeof projectActions.$inferSelect;
export type InsertProjectAction = typeof projectActions.$inferInsert;

/**
 * Evidências (fotos e documentos)
 */
export const projectEvidences = mysqlTable("project_evidences", {
  id: int("id").autoincrement().primaryKey(),
  actionId: int("actionId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  fileUrl: varchar("fileUrl", { length: 500 }).notNull(),
  fileType: varchar("fileType", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectEvidence = typeof projectEvidences.$inferSelect;
export type InsertProjectEvidence = typeof projectEvidences.$inferInsert;

/**
 * Beneficiários/Atendidos
 */
export const beneficiaries = mysqlTable("beneficiaries", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  birthDate: date("birthDate"),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  ethnicity: varchar("ethnicity", { length: 100 }),
  maritalStatus: varchar("maritalStatus", { length: 50 }),
  education: varchar("education", { length: 100 }),
  income: mysqlEnum("income", ["very_low", "low", "medium", "high"]),
  occupation: varchar("occupation", { length: 255 }),
  addressStreet: varchar("addressStreet", { length: 255 }),
  addressNumber: varchar("addressNumber", { length: 20 }),
  addressComplement: varchar("addressComplement", { length: 255 }),
  addressCity: varchar("addressCity", { length: 100 }),
  addressState: varchar("addressState", { length: 2 }),
  addressZipCode: varchar("addressZipCode", { length: 10 }),
  contactPhone: varchar("contactPhone", { length: 20 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  registrationDate: date("registrationDate").notNull(),
  status: mysqlEnum("status", ["active", "inactive", "graduated"]).default("active").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Beneficiary = typeof beneficiaries.$inferSelect;
export type InsertBeneficiary = typeof beneficiaries.$inferInsert;

/**
 * Atendimentos
 */
export const attendances = mysqlTable("attendances", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull(),
  beneficiaryId: int("beneficiaryId"),
  projectId: int("projectId"),
  type: mysqlEnum("type", ["individual", "group", "family"]).notNull(),
  date: date("date").notNull(),
  duration: int("duration"),
  notes: text("notes"),
  status: mysqlEnum("status", ["completed", "pending", "canceled"]).default("completed").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Attendance = typeof attendances.$inferSelect;
export type InsertAttendance = typeof attendances.$inferInsert;

/**
 * Encaminhamentos
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  attendanceId: int("attendanceId").notNull(),
  referredTo: varchar("referredTo", { length: 255 }).notNull(),
  reason: text("reason").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "rejected"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

/**
 * Turmas/Oficinas
 */
export const classes = mysqlTable("classes", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull(),
  projectId: int("projectId"),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  educatorId: int("educatorId"),
  startDate: date("startDate").notNull(),
  endDate: date("endDate"),
  maxParticipants: int("maxParticipants"),
  status: mysqlEnum("status", ["planning", "active", "completed"]).default("planning").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Class = typeof classes.$inferSelect;
export type InsertClass = typeof classes.$inferInsert;

/**
 * Agenda de aulas
 */
export const classSchedules = mysqlTable("class_schedules", {
  id: int("id").autoincrement().primaryKey(),
  classId: int("classId").notNull(),
  dayOfWeek: int("dayOfWeek"),
  startTime: varchar("startTime", { length: 5 }),
  endTime: varchar("endTime", { length: 5 }),
  location: varchar("location", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ClassSchedule = typeof classSchedules.$inferSelect;
export type InsertClassSchedule = typeof classSchedules.$inferInsert;

/**
 * Registros de frequência
 */
export const attendanceRecords = mysqlTable("attendance_records", {
  id: int("id").autoincrement().primaryKey(),
  classId: int("classId").notNull(),
  beneficiaryId: int("beneficiaryId").notNull(),
  date: date("date").notNull(),
  present: boolean("present").default(false).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type InsertAttendanceRecord = typeof attendanceRecords.$inferInsert;

/**
 * Indicadores de impacto
 */
export const indicators = mysqlTable("indicators", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  targetValue: decimal("targetValue", { precision: 15, scale: 2 }),
  currentValue: decimal("currentValue", { precision: 15, scale: 2 }).default("0"),
  unit: varchar("unit", { length: 100 }),
  status: mysqlEnum("status", ["on_track", "at_risk", "exceeded"]).default("on_track").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Indicator = typeof indicators.$inferSelect;
export type InsertIndicator = typeof indicators.$inferInsert;

/**
 * Relatórios
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull(),
  projectId: int("projectId"),
  type: mysqlEnum("type", ["financial", "impact", "activities", "general"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: longtext("content"),
  status: mysqlEnum("status", ["draft", "submitted", "approved", "rejected"]).default("draft").notNull(),
  submittedAt: timestamp("submittedAt"),
  approvedAt: timestamp("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

/**
 * Notificações
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  tenantId: int("tenantId").notNull(),
  userId: int("userId"),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
