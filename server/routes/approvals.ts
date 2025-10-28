import { RequestHandler } from "express";
import { ApprovalInfo, ApproveRequest, RejectRequest, ApiResponse } from "@shared/api";

// Mock approval history
const approvalHistory: ApprovalInfo[] = [];

export const approveSolicitud: RequestHandler = (req, res) => {
  try {
    const { solicitudId } = req.params;
    const { comments }: ApproveRequest = req.body;

    // Validation
    if (!solicitudId) {
      return res.status(400).json({
        success: false,
        error: 'Solicitud ID is required',
      });
    }

    // Mock approval - in production, update database
    const approval: ApprovalInfo = {
      id: Math.random() * 1000,
      solicitudId: parseInt(solicitudId),
      approverUserId: 2, // Mock: current user
      approvalOrder: 1,
      status: 'aprobado',
      requiredApproval: true,
      approvalDate: new Date().toISOString(),
      comments,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    approvalHistory.push(approval);

    res.json({
      success: true,
      data: approval,
      message: 'Solicitud approved successfully',
    } as ApiResponse<ApprovalInfo>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to approve solicitud',
    });
  }
};

export const rejectSolicitud: RequestHandler = (req, res) => {
  try {
    const { solicitudId } = req.params;
    const { rejectionReason, comments }: RejectRequest = req.body;

    if (!solicitudId || !rejectionReason) {
      return res.status(400).json({
        success: false,
        error: 'Solicitud ID and rejection reason are required',
      });
    }

    const rejection: ApprovalInfo = {
      id: Math.random() * 1000,
      solicitudId: parseInt(solicitudId),
      approverUserId: 2,
      approvalOrder: 1,
      status: 'rechazado',
      requiredApproval: true,
      approvalDate: new Date().toISOString(),
      rejectionReason,
      comments,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    approvalHistory.push(rejection);

    res.json({
      success: true,
      data: rejection,
      message: 'Solicitud rejected successfully',
    } as ApiResponse<ApprovalInfo>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to reject solicitud',
    });
  }
};

export const getApprovals: RequestHandler = (req, res) => {
  try {
    const { solicitudId } = req.params;

    if (!solicitudId) {
      return res.status(400).json({
        success: false,
        error: 'Solicitud ID is required',
      });
    }

    const approvals = approvalHistory.filter(a => a.solicitudId === parseInt(solicitudId));

    res.json({
      success: true,
      data: approvals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch approvals',
    });
  }
};
