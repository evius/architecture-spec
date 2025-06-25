export interface FindOptions<T> {
    where?: Partial<T>;
    orderBy?: {
        [K in keyof T]?: 'asc' | 'desc';
    };
    limit?: number;
    offset?: number;
    include?: string[];
}
export declare abstract class Base {
}
//# sourceMappingURL=interface.d.ts.map