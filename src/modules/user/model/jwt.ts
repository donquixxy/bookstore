export class JwtClaims {
    id?: string;
}

export class AuthResponse {
    token:string;
    refresh_token:string;

    constructor(token:string,refresh_token:string) {
        this.token = token;
        this.refresh_token = refresh_token;
    }
}