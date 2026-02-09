import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createOSCContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-osc-user",
    email: "osc@example.com",
    name: "Test OSC User",
    loginMethod: "manus",
    role: "osc",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "test-admin-user",
    email: "admin@example.com",
    name: "Test Admin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("organization procedures", () => {
  it("should allow OSC user to create organization", async () => {
    const { ctx } = createOSCContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.organization.create({
      name: "Test Organization",
      cnpj: "12345678000190",
      description: "Test description",
      mission: "Test mission",
      addressStreet: "Test street",
      addressCity: "Test city",
      addressState: "TS",
      addressZipCode: "12345-678",
      phone: "(11) 1234-5678",
      website: "https://test.org",
    });

    expect(result).toEqual({ success: true });
  });

  it("should allow admin to approve organization", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.approveOrganization({
      id: 1,
    });

    expect(result).toEqual({ success: true });
  });

  it("should allow admin to get all organizations", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.getAllOrganizations();

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("project procedures", () => {
  it("should allow OSC to create project", async () => {
    const { ctx } = createOSCContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.project.create({
      name: "Test Project",
      description: "Test project description",
      objectives: "Test objectives",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      budget: "100000",
      status: "planning",
      targetAudience: "Youth",
      location: "Test City",
    });

    expect(result).toEqual({ success: true });
  });
});

describe("beneficiary procedures", () => {
  it("should allow OSC to create beneficiary", async () => {
    const { ctx } = createOSCContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.beneficiary.create({
      name: "Test Beneficiary",
      birthDate: "2000-01-01",
      gender: "male",
      ethnicity: "Test",
      income: "low",
      education: "High School",
      addressStreet: "Test street",
      addressCity: "Test city",
      addressState: "TS",
      addressZipCode: "12345-678",
      contactPhone: "(11) 1234-5678",
      contactEmail: "beneficiary@test.com",
      registrationDate: "2026-02-09",
    });

    expect(result).toEqual({ success: true });
  });
});
