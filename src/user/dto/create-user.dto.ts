import { IsNotEmpty, IsEmail, IsOptional } from "class-validator";
import { IsStrongPassword } from "src/validators/password.validator";


/**
 * USER DTO
 */
export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;



}
