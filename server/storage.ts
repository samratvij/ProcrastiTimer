import { users, type User, type InsertUser, type TimerSession, type InsertTimerSession, type UpdateTimerSession } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Timer session methods
  getTimerSession(id: number): Promise<TimerSession | undefined>;
  getActiveTimerSession(userId: number): Promise<TimerSession | undefined>;
  createTimerSession(session: InsertTimerSession): Promise<TimerSession>;
  updateTimerSession(id: number, data: UpdateTimerSession): Promise<TimerSession>;
  clearActiveTimerSessions(userId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private timerSessions: Map<number, TimerSession>;
  private userIdToSessionId: Map<number, number>;
  private currentUserId: number;
  private currentSessionId: number;

  constructor() {
    this.users = new Map();
    this.timerSessions = new Map();
    this.userIdToSessionId = new Map();
    this.currentUserId = 1;
    this.currentSessionId = 1;
    
    // Create a default user
    this.createUser({
      username: "defaultuser",
      password: "password"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTimerSession(id: number): Promise<TimerSession | undefined> {
    return this.timerSessions.get(id);
  }

  async getActiveTimerSession(userId: number): Promise<TimerSession | undefined> {
    const sessionId = this.userIdToSessionId.get(userId);
    if (!sessionId) return undefined;
    return this.timerSessions.get(sessionId);
  }

  async createTimerSession(insertSession: InsertTimerSession): Promise<TimerSession> {
    const id = this.currentSessionId++;
    const now = new Date();
    
    const session: TimerSession = {
      ...insertSession,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.timerSessions.set(id, session);
    
    // Associate this session with the user
    if (session.userId) {
      this.userIdToSessionId.set(session.userId, id);
    }
    
    return session;
  }

  async updateTimerSession(id: number, data: UpdateTimerSession): Promise<TimerSession> {
    const existingSession = this.timerSessions.get(id);
    
    if (!existingSession) {
      throw new Error(`Timer session with ID ${id} not found`);
    }
    
    const updatedSession: TimerSession = {
      ...existingSession,
      ...data,
      updatedAt: new Date()
    };
    
    this.timerSessions.set(id, updatedSession);
    
    return updatedSession;
  }

  async clearActiveTimerSessions(userId: number): Promise<void> {
    const sessionId = this.userIdToSessionId.get(userId);
    
    if (sessionId) {
      this.timerSessions.delete(sessionId);
      this.userIdToSessionId.delete(userId);
    }
  }
}

export const storage = new MemStorage();
