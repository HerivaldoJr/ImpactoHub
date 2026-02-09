import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import * as db from "./db";

/**
 * ============================================
 * ADMIN PROCEDURES
 * ============================================
 */

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

const adminRouter = router({
  // Gestão de Tenants
  getAllTenants: adminProcedure.query(async () => {
    return await db.getAllTenants();
  }),

  getTenantById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return await db.getTenantById(input.id);
  }),

  createTenant: adminProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.enum(["osc", "investor", "both"]),
        cnpj: z.string().optional(),
        email: z.string().email(),
        phone: z.string().optional(),
        website: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await db.createTenant({
        ...input,
        status: "pending",
      });
      return { success: true };
    }),

  approveTenant: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.updateTenant(input.id, { status: "active" });
      return { success: true };
    }),

  rejectTenant: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.updateTenant(input.id, { status: "inactive" });
      return { success: true };
    }),

  // Gestão de Faturas
  getInvoicesByTenant: adminProcedure
    .input(z.object({ tenantId: z.number() }))
    .query(async ({ input }) => {
      return await db.getInvoicesByTenant(input.tenantId);
    }),

  createInvoice: adminProcedure
    .input(
      z.object({
        tenantId: z.number(),
        invoiceNumber: z.string(),
        amount: z.string(),
        dueDate: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await db.createInvoice({
        ...input,
        status: "pending",
      });
      return { success: true };
    }),

  // Gestão de Propostas
  getProposalsByTenant: adminProcedure
    .input(z.object({ tenantId: z.number() }))
    .query(async ({ input }) => {
      return await db.getProposalsByTenant(input.tenantId);
    }),

  createProposal: adminProcedure
    .input(
      z.object({
        tenantId: z.number(),
        proposalNumber: z.string(),
        planId: z.number(),
        amount: z.string(),
        validUntil: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await db.createProposal({
        ...input,
        status: "draft",
      });
      return { success: true };
    }),

  // Customização de Tema
  getThemeCustomization: adminProcedure
    .input(z.object({ tenantId: z.number() }))
    .query(async ({ input }) => {
      return await db.getThemeCustomization(input.tenantId);
    }),

  updateThemeCustomization: adminProcedure
    .input(
      z.object({
        tenantId: z.number(),
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
        textColor: z.string().optional(),
        backgroundColor: z.string().optional(),
        logoUrl: z.string().optional(),
        faviconUrl: z.string().optional(),
        platformName: z.string().optional(),
        fontFamily: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { tenantId, ...data } = input;
      await db.createOrUpdateThemeCustomization(tenantId, data);
      return { success: true };
    }),

  // Customização de Página
  getPageCustomization: adminProcedure
    .input(z.object({ tenantId: z.number() }))
    .query(async ({ input }) => {
      return await db.getPageCustomization(input.tenantId);
    }),

  updatePageCustomization: adminProcedure
    .input(
      z.object({
        tenantId: z.number(),
        heroTitle: z.string().optional(),
        heroDescription: z.string().optional(),
        heroImage: z.string().optional(),
        ctaText: z.string().optional(),
        footerText: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { tenantId, ...data } = input;
      await db.createOrUpdatePageCustomization(tenantId, data);
      return { success: true };
    }),
});

/**
 * ============================================
 * CLIENT PROCEDURES
 * ============================================
 */

const clientProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.user.tenantId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Tenant access required" });
  }
  return next({ ctx });
});

const projectRouter = router({
  create: clientProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        objectives: z.string().optional(),
        startDate: z.string(),
        endDate: z.string(),
        budget: z.string().optional(),
        status: z.enum(["planning", "active", "completed", "suspended"]).optional(),
        targetAudience: z.string().optional(),
        location: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await db.createProject(ctx.user.tenantId!, {
        ...input,
        status: input.status || "planning",
      });
      return { success: true };
    }),

  list: clientProcedure.query(async ({ ctx }) => {
    return await db.getProjectsByTenant(ctx.user.tenantId!);
  }),

  getById: clientProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const project = await db.getProjectById(input.id);
      if (!project || project.tenantId !== ctx.user.tenantId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return project;
    }),

  update: clientProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["planning", "active", "completed", "suspended"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const project = await db.getProjectById(input.id);
      if (!project || project.tenantId !== ctx.user.tenantId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const { id, ...data } = input;
      await db.updateProject(id, data);
      return { success: true };
    }),
});

const beneficiaryRouter = router({
  create: clientProcedure
    .input(
      z.object({
        name: z.string(),
        birthDate: z.string().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        ethnicity: z.string().optional(),
        income: z.enum(["very_low", "low", "medium", "high"]).optional(),
        education: z.string().optional(),
        addressStreet: z.string().optional(),
        addressCity: z.string().optional(),
        addressState: z.string().optional(),
        addressZipCode: z.string().optional(),
        contactPhone: z.string().optional(),
        contactEmail: z.string().optional(),
        registrationDate: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await db.createBeneficiary(ctx.user.tenantId!, input);
      return { success: true };
    }),

  list: clientProcedure.query(async ({ ctx }) => {
    return await db.getBeneficiariesByTenant(ctx.user.tenantId!);
  }),

  getById: clientProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const beneficiary = await db.getBeneficiaryById(input.id);
      if (!beneficiary || beneficiary.tenantId !== ctx.user.tenantId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return beneficiary;
    }),

  update: clientProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        status: z.enum(["active", "inactive", "graduated"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const beneficiary = await db.getBeneficiaryById(input.id);
      if (!beneficiary || beneficiary.tenantId !== ctx.user.tenantId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const { id, ...data } = input;
      await db.updateBeneficiary(id, data);
      return { success: true };
    }),
});

const attendanceRouter = router({
  create: clientProcedure
    .input(
      z.object({
        beneficiaryId: z.number().optional(),
        projectId: z.number().optional(),
        type: z.enum(["individual", "group", "family"]),
        date: z.string(),
        duration: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await db.createAttendance(ctx.user.tenantId!, {
        ...input,
        status: "completed",
      });
      return { success: true };
    }),

  list: clientProcedure.query(async ({ ctx }) => {
    return await db.getAttendancesByTenant(ctx.user.tenantId!);
  }),
});

const classRouter = router({
  create: clientProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        projectId: z.number().optional(),
        startDate: z.string(),
        endDate: z.string().optional(),
        maxParticipants: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await db.createClass(ctx.user.tenantId!, {
        ...input,
        status: "planning",
      });
      return { success: true };
    }),

  list: clientProcedure.query(async ({ ctx }) => {
    return await db.getClassesByTenant(ctx.user.tenantId!);
  }),
});

const reportRouter = router({
  create: clientProcedure
    .input(
      z.object({
        projectId: z.number().optional(),
        type: z.enum(["financial", "impact", "activities", "general"]),
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await db.createReport(ctx.user.tenantId!, {
        ...input,
        status: "draft",
      });
      return { success: true };
    }),

  list: clientProcedure.query(async ({ ctx }) => {
    return await db.getReportsByTenant(ctx.user.tenantId!);
  }),
});

/**
 * ============================================
 * MAIN ROUTER
 * ============================================
 */

export const appRouter = router({
  system: systemRouter,
  admin: adminRouter,
  project: projectRouter,
  beneficiary: beneficiaryRouter,
  attendance: attendanceRouter,
  class: classRouter,
  report: reportRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
