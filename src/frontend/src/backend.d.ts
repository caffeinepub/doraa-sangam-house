import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
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
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface OrderRecord {
    status: string;
    orderId: string;
    paymentId: string;
    timestamp: bigint;
    shippingAddress: ShippingAddress;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
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
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminAddProduct(name: string, price: bigint, description: string, images: Array<string>, fabric: string, variants: Array<Variant>, blousePair: string, category: string): Promise<string>;
    adminBulkImportProducts(productForms: Array<Product>): Promise<bigint>;
    adminDeleteProduct(productId: string): Promise<void>;
    adminListProducts(): Promise<Array<Product>>;
    adminOnlyAction(): Promise<string>;
    adminUpdateProduct(productId: string, name: string, price: bigint, description: string, images: Array<string>, fabric: string, variants: Array<Variant>, blousePair: string, category: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    confirmDeploymentChecks(): Promise<string>;
    createOrder(orderId: string, paymentId: string, shippingAddress: ShippingAddress): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserOrders(): Promise<Array<OrderRecord>>;
    getUserOrdersByYearMonth(year: bigint, month: bigint): Promise<Array<OrderRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    healthCheck(): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    publicListProducts(): Promise<Array<Product>>;
    requestAdminOtp(phone: string): Promise<string>;
    requestOtp(identifier: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    validateAdminSession(clientIp: string, userAgent: string): Promise<boolean>;
    verifyAdminOtp(phone: string, otp: string, clientIp: string, userAgent: string): Promise<string>;
    verifyOtp(identifier: string, enteredOtp: string): Promise<string>;
}
