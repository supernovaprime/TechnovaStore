import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog.model';
import { ApiResponse } from '../utils/apiResponse';

const auditController = {
  createLog: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const logData = req.body;
      const log = await AuditLog.create(logData);
      ApiResponse.success(res, log, 'Audit log created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  getAllLogs: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = 1, limit = 20, action, status, role } = req.query;
      const query: any = {};

      if (action) query.action = action;
      if (status) query.status = status;
      if (role) query.role = role;

      const logs = await AuditLog.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit))
        .lean();

      const total = await AuditLog.countDocuments(query);

      ApiResponse.success(res, {
        logs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }, 'Audit logs fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  getRecentLogs: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { limit = 50 } = req.query;
      const logs = await AuditLog.find()
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .lean();

      ApiResponse.success(res, logs, 'Recent audit logs fetched successfully');
    } catch (error) {
      next(error);
    }
  }
};

export default auditController;
