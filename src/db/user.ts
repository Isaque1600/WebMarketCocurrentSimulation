import { mockDB } from "./index.js";
import type { User } from "./mockDatabase.js";

// User service functions using the mock database
export class UserService {
  static getAllUsers(): User[] {
    return mockDB.getAllUsers();
  }

  static getUserById(id: number): User | undefined {
    return mockDB.getUserById(id);
  }

  static getUserByEmail(email: string): User | undefined {
    return mockDB.getUserByEmail(email);
  }

  static createUser(userData: Omit<User, "id">): User {
    return mockDB.createUser(userData);
  }

  static updateUser(
    id: number,
    userData: Partial<Omit<User, "id">>,
  ): User | undefined {
    return mockDB.updateUser(id, userData);
  }

  static deleteUser(id: number): boolean {
    return mockDB.deleteUser(id);
  }

  static authenticateUser(email: string, password: string): User | undefined {
    const user = mockDB.getUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return undefined;
  }
}
