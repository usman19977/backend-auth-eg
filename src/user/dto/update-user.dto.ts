import { IsOptional } from "class-validator";


/**
 * USER UPDATE DTO
 */
export class UpdateUserDto {

  @IsOptional()
  name?: string;

  @IsOptional()
  password?: string;


}