import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface InventoryItem {
    itemId: string;
    acquisitionCost: bigint;
    itemType: ItemType;
    quantity: bigint;
    location: string;
    condition: ConditionStatus;
}
export interface RentalOrder {
    status: RentalOrderStatus;
    endDate: string;
    orderId: string;
    customerId: string;
    itemIds: Array<string>;
    startDate: string;
}
export interface Vendor {
    bankAccount: string;
    npwp: string;
    contactPerson: string;
    email: string;
    address: string;
    companyName: string;
    paymentTerms: bigint;
    phone: string;
}
export interface Customer {
    name: string;
    npwp: string;
    contactPerson: string;
    email: string;
    creditLimit: bigint;
    address: string;
    phone: string;
}
export interface UserProfile {
    name: string;
    role: UserRole;
    email: string;
}
export enum ConditionStatus {
    New = "New",
    Fair = "Fair",
    Good = "Good",
    Damaged = "Damaged"
}
export enum ItemType {
    Pipe = "Pipe",
    Board = "Board",
    Frame = "Frame",
    Accessory = "Accessory",
    Clamp = "Clamp"
}
export enum RentalOrderStatus {
    Active = "Active",
    Delivered = "Delivered",
    Booked = "Booked",
    Returned = "Returned",
    QuotationApproved = "QuotationApproved"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCustomer(customer: Customer): Promise<void>;
    addInventoryItem(item: InventoryItem): Promise<void>;
    addVendor(vendor: Vendor): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrder(order: RentalOrder): Promise<void>;
    deleteCustomer(npwp: string): Promise<void>;
    deleteInventoryItem(itemId: string): Promise<void>;
    deleteOrder(orderId: string): Promise<void>;
    deleteVendor(npwp: string): Promise<void>;
    getAllOrders(): Promise<Array<RentalOrder>>;
    getCallerUserProfile(): Promise<UserProfile>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomer(npwp: string): Promise<Customer>;
    getCustomers(): Promise<Array<Customer>>;
    getInventoryItem(itemId: string): Promise<InventoryItem>;
    getInventoryItems(): Promise<Array<InventoryItem>>;
    getOrder(orderId: string): Promise<RentalOrder>;
    getUserProfile(user: Principal): Promise<UserProfile>;
    getVendor(npwp: string): Promise<Vendor>;
    getVendors(): Promise<Array<Vendor>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCustomer(npwp: string, customer: Customer): Promise<void>;
    updateInventoryItem(itemId: string, item: InventoryItem): Promise<void>;
    updateOrder(orderId: string, order: RentalOrder): Promise<void>;
    updateVendor(npwp: string, vendor: Vendor): Promise<void>;
}
