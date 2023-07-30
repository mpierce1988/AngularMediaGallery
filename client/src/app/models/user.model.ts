export class User {
    id: string;
    name: string;
    email: string;
    errors: string[];

    constructor(id: string, name: string, email: string, errors: string[]) { 
        this.id = id ?? '';
        this.name = name ?? '';
        this.email = email ?? '';
        this.errors = errors ?? [];
    }
}
