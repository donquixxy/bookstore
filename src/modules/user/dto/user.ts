import { IsNotEmpty, IsString, IsEmail, IsNumber, Min, Max } from 'class-validator';


class UserCreateDTO {

  id?: string;

    @IsString()
    @IsNotEmpty()
  name?: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
  email?: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(150)
  age?:number;

    @IsString()

    @IsString()
    @IsNotEmpty()
  password?:string;

    constructor(
        id?: string,
        name?: string,
        email?: string,
        age?: number,
        password?: string
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
        this.password = password;
    }
}

export class UserFilterDTO {
    id?: string;
    name?: string;
    email?: string;
    password?: string;
    token?:string;
    WithPreload?:boolean;
}

export class LoginDTO{
    @IsNotEmpty()
    @IsEmail()
    email?: string;

    @IsNotEmpty()
    password?: string;

    constructor(email?: string, password?: string) {
        this.email = email;
        this.password = password;
    }
}

export class UserUpdateDTO {
    id:string;
    name?: string;
    token?:string;
    password?:string;
    email?:string;

    constructor(id:string, name?:string, token?:string, password?:string) {
        this.id = id;
        this.name = name
        this.token = token
        this.password = password
    }
}

export default UserCreateDTO;