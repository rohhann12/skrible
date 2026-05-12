export declare function register(email: string, password: string): Promise<string>;
export declare function login(email: string, password: string): Promise<string>;
export declare function verifyToken(token: string): {
    id: string;
    email: string;
};
//# sourceMappingURL=authService.d.ts.map