import express from "express";
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { updateTimerSessionSchema, insertTimerSessionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for timer sessions
  app.get("/api/timer", async (req: Request, res: Response) => {
    try {
      // In a real app, you'd get the current user's ID from the session
      // For now, we'll use a default user ID of 1
      const userId = 1;
      
      const activeSession = await storage.getActiveTimerSession(userId);
      
      if (!activeSession) {
        return res.status(404).json({ message: "No active timer session found" });
      }
      
      return res.json(activeSession);
    } catch (error) {
      console.error("Error fetching timer session:", error);
      return res.status(500).json({ message: "Failed to fetch timer session" });
    }
  });

  app.post("/api/timer", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const timerData = insertTimerSessionSchema.parse(req.body);
      
      // In a real app, you'd get the current user's ID from the session
      const userId = 1;
      
      // Clean up any existing sessions
      await storage.clearActiveTimerSessions(userId);
      
      // Create a new timer session
      const newSession = await storage.createTimerSession({
        ...timerData,
        userId,
      });
      
      return res.status(201).json(newSession);
    } catch (error) {
      console.error("Error creating timer session:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid timer data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create timer session" });
    }
  });

  app.put("/api/timer", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const updateData = updateTimerSessionSchema.parse(req.body);
      
      // In a real app, you'd get the current user's ID from the session
      const userId = 1;
      
      // Get active session
      const activeSession = await storage.getActiveTimerSession(userId);
      
      if (!activeSession) {
        return res.status(404).json({ message: "No active timer session found" });
      }
      
      // Update the session
      const updatedSession = await storage.updateTimerSession(activeSession.id, updateData);
      
      return res.json(updatedSession);
    } catch (error) {
      console.error("Error updating timer session:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid timer data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to update timer session" });
    }
  });

  app.delete("/api/timer", async (req: Request, res: Response) => {
    try {
      // In a real app, you'd get the current user's ID from the session
      const userId = 1;
      
      // Clear active sessions
      await storage.clearActiveTimerSessions(userId);
      
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting timer session:", error);
      return res.status(500).json({ message: "Failed to delete timer session" });
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
