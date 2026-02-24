import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { cookieUtils } from "../utilis/cookie";
import { prisma } from "../../lib/prisma";
import AppError from "../errorHelpers/AppError";
import status from "http-status";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookieUtils.getCookie(req, "better_auth_session_token");

      if (!sessionToken) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized");
      }

      // find session
      const sessionExists = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true },
      });

      if (!sessionExists) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized");
      }

      // check expiration
      const now = new Date();
      if (sessionExists.expiresAt <= now) {
        throw new AppError(status.UNAUTHORIZED, "Session expired");
      }

      const user = sessionExists.user;

      if (!user) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized");
      }

      // refresh logic
      const createdAt = sessionExists.createdAt;
      const expiresAt = sessionExists.expiresAt;

      const sessionLifetime = expiresAt.getTime() - createdAt.getTime();
      const timeRemaining = expiresAt.getTime() - now.getTime();
      const percentRemaining = (timeRemaining / sessionLifetime) * 100;

      if (percentRemaining < 20) {
        res.setHeader("x-refresh-token", "true");
        res.setHeader("x-session-token", expiresAt.toISOString());
        res.setHeader("x-time-remaining", timeRemaining.toString());
      }

      // user status check
      if (
        user.status === UserStatus.BLOCKED ||
        user.status === UserStatus.DELETED ||
        user.isDeleted
      ) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized");
      }

      // role check
      if (authRoles.length > 0 && !authRoles.includes(user.role as Role)) {
        throw new AppError(status.FORBIDDEN, "Forbidden");
      }


       req.user = {
        userId: user.id,
        role:user.role,
        email:user.email,

      }

      // attach user to request
    //   req.user = {
    //     id: user.id,
    //     email: user.email,
    //     name: user.name,
    //     role: user.role,
    //     emailVerified: user.emailVerified,
    //   };

      next();
    } catch (err) {
      next(err);
    }
  };