import { IsNotEmpty, IsString, IsEmail, IsNumber, Min, Max } from 'class-validator';


class UserCreateDTO {

    @IsString()
    @IsNotEmpty()
  id: string;

    @IsString()
    @IsNotEmpty()
  name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
  email: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(150)
  age:number;

    @IsString()

    @IsString()
    @IsNotEmpty()
  password:string;

    constructor(
        id: string,
        name: string,
        email: string,
        age: number,
        password: string
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
        this.password = password;
    }
}

export default UserCreateDTO;