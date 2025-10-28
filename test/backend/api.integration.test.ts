import { describe, it, expect, beforeAll } from "vitest";

/**
 * Integration tests for Iglesia 360 API
 * These tests verify the complete workflow of creating and approving financial requests
 */

describe("Iglesia 360 API - Integration Tests", () => {
  const API_BASE = "http://localhost:8080/api";
  let solicitudId: number;

  describe("Users Management", () => {
    it("should list all users", async () => {
      const response = await fetch(`${API_BASE}/users`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.total).toBeGreaterThan(0);
    });

    it("should get a specific user", async () => {
      const response = await fetch(`${API_BASE}/users/1`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe(1);
      expect(data.data.email).toBeDefined();
      expect(Array.isArray(data.data.roles)).toBe(true);
    });

    it("should return 404 for non-existent user", async () => {
      const response = await fetch(`${API_BASE}/users/99999`);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });

    it("should filter users by role", async () => {
      const response = await fetch(`${API_BASE}/users?role=admin`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      const adminUsers = data.data.filter((u: any) => u.roles.includes("admin"));
      expect(adminUsers.length).toBeGreaterThan(0);
    });
  });

  describe("Solicitudes Management", () => {
    it("should list all solicitudes", async () => {
      const response = await fetch(`${API_BASE}/solicitudes`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.total).toBeGreaterThan(0);
    });

    it("should filter solicitudes by status", async () => {
      const response = await fetch(`${API_BASE}/solicitudes?status=pendiente`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      const pendingSolicitudes = data.data.filter((s: any) => s.status === "pendiente");
      expect(pendingSolicitudes.length).toBe(data.data.length);
    });

    it("should get a specific solicitud", async () => {
      const response = await fetch(`${API_BASE}/solicitudes/1`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe(1);
      expect(data.data.code).toBeDefined();
      expect(data.data.title).toBeDefined();
      expect(typeof data.data.totalAmount).toBe("number");
      expect(Array.isArray(data.data.items)).toBe(true);
    });

    it("should create a new solicitud", async () => {
      const createPayload = {
        ministryId: 1,
        title: "Test Solicitud",
        description: "Test description for integration testing",
        responsibleUserId: 4,
        paymentType: "terceros",
        paymentDetail: "Test payment detail",
        items: [
          {
            itemNumber: 1,
            description: "Test item",
            amount: 500,
            quantity: 1,
            unitPrice: 500,
          },
        ],
        currency: "USD",
      };

      const response = await fetch(`${API_BASE}/solicitudes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createPayload),
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.code).toBeDefined();
      expect(data.data.status).toBe("borrador");
      expect(data.data.totalAmount).toBe(500);

      solicitudId = data.data.id;
    });

    it("should update a draft solicitud", async () => {
      const updatePayload = {
        title: "Updated Test Solicitud",
        description: "Updated description",
      };

      const response = await fetch(`${API_BASE}/solicitudes/${solicitudId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe("Updated Test Solicitud");
    });

    it("should submit a solicitud", async () => {
      const submitPayload = {
        comments: "Solicitud lista para aprobación",
      };

      const response = await fetch(
        `${API_BASE}/solicitudes/${solicitudId}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitPayload),
        }
      );

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.status).toBe("pendiente");
      expect(data.data.submittedAt).toBeDefined();
    });

    it("should prevent updating a non-draft solicitud", async () => {
      const updatePayload = {
        title: "Cannot update pending solicitud",
      };

      const response = await fetch(`${API_BASE}/solicitudes/${solicitudId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });

  describe("Approvals Workflow", () => {
    it("should approve a solicitud", async () => {
      const approvePayload = {
        comments: "Aprobado correctamente",
      };

      const response = await fetch(
        `${API_BASE}/solicitudes/2/approve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(approvePayload),
        }
      );

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.status).toBe("aprobado");
    });

    it("should reject a solicitud with reason", async () => {
      const rejectPayload = {
        rejectionReason: "No cumple con los requisitos de presupuesto",
        comments: "Se requieren más documentos",
      };

      const response = await fetch(
        `${API_BASE}/solicitudes/3/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rejectPayload),
        }
      );

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.status).toBe("rechazado");
    });

    it("should get approvals for a solicitud", async () => {
      const response = await fetch(`${API_BASE}/solicitudes/2/approvals`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  describe("Dashboard", () => {
    it("should fetch dashboard statistics", async () => {
      const response = await fetch(`${API_BASE}/solicitudes/dashboard/stats`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.totalSolicitudes).toBeGreaterThan(0);
      expect(typeof data.data.pendingSolicitudes).toBe("number");
      expect(typeof data.data.approvedSolicitudes).toBe("number");
      expect(typeof data.data.totalAmount).toBe("number");
      expect(typeof data.data.approvedAmount).toBe("number");
      expect(typeof data.data.ministries).toBe("number");
      expect(typeof data.data.users).toBe("number");
    });
  });

  describe("Business Rules Validation", () => {
    it("should require minimum fields for solicitud creation", async () => {
      const incompletePayload = {
        title: "Test",
      };

      const response = await fetch(`${API_BASE}/solicitudes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incompletePayload),
      });

      expect(response.status).toBe(400);
    });

    it("should validate rejection reason is required", async () => {
      const invalidPayload = {
        comments: "Some comment without rejection reason",
      };

      const response = await fetch(
        `${API_BASE}/solicitudes/1/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(invalidPayload),
        }
      );

      expect(response.status).toBe(400);
    });

    it("should paginate results correctly", async () => {
      const page1 = await fetch(`${API_BASE}/solicitudes?page=1&pageSize=2`);
      const data1 = await page1.json();

      const page2 = await fetch(`${API_BASE}/solicitudes?page=2&pageSize=2`);
      const data2 = await page2.json();

      expect(data1.page).toBe(1);
      expect(data2.page).toBe(2);
      expect(data1.data.length).toBeLessThanOrEqual(2);
      expect(data2.data.length).toBeLessThanOrEqual(2);
    });
  });

  describe("Error Handling", () => {
    it("should handle non-existent solicitud", async () => {
      const response = await fetch(`${API_BASE}/solicitudes/99999`);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it("should handle invalid JSON in request body", async () => {
      const response = await fetch(`${API_BASE}/solicitudes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{invalid json}",
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it("should handle missing required headers", async () => {
      const response = await fetch(`${API_BASE}/users`, {
        method: "GET",
      });

      expect(response.status).toBe(200);
    });
  });
});
