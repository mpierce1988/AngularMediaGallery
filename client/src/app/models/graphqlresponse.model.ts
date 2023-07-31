
// Interace for the GraphQL response
export interface GraphQLResponse<T> {
    data?: T;
    errors? : GraphQLError[];
}

export interface GraphQLError {
    message: string;
    extensions: ErrorExtension;
    locations: ErrorLocation[];
    path: string[];
}

export interface ErrorExtension {
    category: string;
}

export interface ErrorLocation {
    line: number;
    column: number;
}

// Mutation specific interfaces
export interface AccountCreateEmailSession {
    $id: string;
    userId: string;
    provider: string;
    expire: string;
}

export interface AccountCreate {
    _id: string;
    email: string;
    name: string;
}

export type LoginResponse = GraphQLResponse<{accountCreateEmailSession: AccountCreateEmailSession | null}>;
export type RegisterResponse = GraphQLResponse<{accountCreate: AccountCreate | null}>;