import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
	@ApiProperty()
	username: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	password: string;

	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;
}
