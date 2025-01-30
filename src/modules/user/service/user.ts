import {IUserService} from "../interfaces/service";
import UserCreateDTO, {LoginDTO, UserFilterDTO, UserUpdateDTO} from "../dto/user";
import {DatabaseError, Transaction} from "sequelize";
import User from "../entity/user";
import {IUserRepository} from "../interfaces/repository";
import {inject, injectable} from "tsyringe";
import {v4 as uuidv4} from 'uuid';
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {AuthResponse} from "../model/jwt";
import {DbError, NotFoundError, ValidationError} from "../../../error/error";


@injectable()
class UserService implements IUserService {

    private readonly userRepository: IUserRepository;

    constructor(@inject("IUserRepository")userRepository:IUserRepository) {
        this.userRepository = userRepository;
    }

    async CreateUser(data: UserCreateDTO, trx?: Transaction): Promise<User | null> {
        if (data.id === null) {
            data.id = uuidv4()
        }

        if (data.password != null) {
            data.password = await bcrypt.hash(data.password, 12)
        }

       return await this.userRepository.CreateUser(data, trx)
    }

   async GetAll(filter: UserFilterDTO): Promise<User[]> {
        return await this.userRepository.GetAll(filter)
    }

  async Login(request: LoginDTO): Promise<AuthResponse | null> {
        // Validate; retrieve user by email
        const filter = new UserFilterDTO();

        filter.email = request.email;

        const foundUser = await this.userRepository.Get(filter)

        if (!foundUser) {
           throw new NotFoundError("user with selected email not found")
        }

        // If found; validate user password
      const isValid = await bcrypt.compare(request.password!, foundUser.password)

      if (!isValid) {
          throw new ValidationError("invalid password")
      }

      // Update user token at database
      const userToken = this.generateToken(foundUser.id)
      const updateDTO = new UserUpdateDTO(foundUser.id, "", userToken);
      const updatedUser = await  this.userRepository.Update(updateDTO)

      if (!updatedUser) {
          throw new DbError("An error occured. Please try again later")
      }

      return new AuthResponse(userToken, this.generateRefreshToken(foundUser.id))
    }

    generateToken (userID:string):string {
        return jwt.sign(
            {id: userID,},
            process.env.JWT_SECRET || "jwt202345",
            {expiresIn: "3d"}
        )
    }

    generateRefreshToken (userID:string):string {
        return jwt.sign(
            {id: userID,},
            process.env.JWT_SECRET || "jwt999999999",
            {expiresIn: "30d"}
        )
    }

   async Get(filter: UserFilterDTO): Promise<User | null> {
        return await this.userRepository.Get(filter)
    }
}

export default UserService;