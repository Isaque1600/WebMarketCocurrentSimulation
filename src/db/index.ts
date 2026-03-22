import { MockDatabase } from "./mockDatabase.js";

export const mockDB = new MockDatabase();

export default mockDB;

export { MockDatabase, PaymentStatus } from "./mockDatabase.js";
export type { Order, OrderItem, Product, User } from "./mockDatabase.js";
