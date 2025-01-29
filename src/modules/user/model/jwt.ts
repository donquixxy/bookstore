class JwtClaims {
    id: string;

    constructor(id: string) {
        this.id = id;
    }
}

export class AuthResponse {
    token:string;
    refresh_token:string;

    constructor(token:string,refresh_token:string) {
        this.token = token;
        this.refresh_token = refresh_token;
    }
}