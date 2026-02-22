import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    email: string;
    addresses: Array<Address>;
    phone: string;
}
export interface OrderRecord {
    status: string;
    orderId: string;
    paymentId: string;
    timestamp: bigint;
    shippingAddress: ShippingAddress;
}
export interface ShippingAddress {
    street: string;
    country: string;
    city: string;
    postalCode: string;
    name: string;
    state: string;
    phone: string;
}
export interface Variant {
    color: string;
    size: string;
}
export interface Product {
    id: string;
    name: string;
    description: string;
    variants: Array<Variant>;
    category: string;
    blousePair: string;
    price: bigint;
    fabric: string;
    images: Array<string>;
}
export interface Address {
    street: string;
    country: string;
    city: string;
    postalCode: string;
    state: string;
    addressLabel: string;
    isDefault: boolean;
    phone: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAddress(address: Address): Promise<void>;
    adminAddProduct(name: string, price: bigint, description: string, images: Array<string>, fabric: string, variants: Array<Variant>, blousePair: string, category: string): Promise<string>;
    adminBulkImportProducts(productForms: Array<Product>): Promise<bigint>;
    adminDeleteProduct(productId: string): Promise<void>;
    adminListProducts(): Promise<Array<Product>>;
    adminOnlyAction(): Promise<string>;
    adminUpdateProduct(productId: string, name: string, price: bigint, description: string, images: Array<string>, fabric: string, variants: Array<Variant>, blousePair: string, category: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    confirmDeploymentChecks(): Promise<string>;
    createOrder(orderId: string, paymentId: string, shippingAddress: ShippingAddress): Promise<void>;
    getAddresses(): Promise<Array<Address>>;
    getAdminBotLog(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getHomepageBanner(): Promise<string>;
    getUserOrders(): Promise<Array<OrderRecord>>;
    getUserOrdersByYearMonth(year: bigint, month: bigint): Promise<Array<OrderRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    healthCheck(): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    processAdminCommand(cmd: string): Promise<string>;
    publicListProducts(): Promise<Array<Product>>;
    requestAdminOtp(identifier: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitAdminBotInstruction(instruction: string): Promise<string>;
    validateAdminSession(clientIp: string, userAgent: string): Promise<boolean>;
    verifyAdminOtp(identifier: string, otp: string, clientIp: string, userAgent: string): Promise<string>;
}
