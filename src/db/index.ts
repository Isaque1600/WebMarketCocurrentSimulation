import { MockDatabase } from "./mockDatabase.js";

// Create a singleton instance of the mock database
export const mockDB = new MockDatabase();

// Export the database instance as default
export default mockDB;

// Also export the types and enums for convenience
export { MockDatabase, PaymentStatus } from "./mockDatabase.js";
export type { Order, OrderItem, Product, User } from "./mockDatabase.js";
