import { IsSafeString } from '@kishornaik/utils';
import { Type } from 'class-transformer';
import { IsEmail, IsMobilePhone, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
export class RequestReplyRequestDto {
	@IsString()
	@IsNotEmpty()
	@IsSafeString({ message: 'Name must not contain HTML or JavaScript code' })
	@Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
	@Type(() => String)
	public fullName?: string;

	@IsString()
	@IsNotEmpty()
	@IsEmail({}, { message: 'Email must be a valid email address' })
	@IsSafeString({ message: 'Name must not contain HTML or JavaScript code' })
	@Type(() => String)
	public email?: string;
}

export class RequestReplyResponseDto {
	public message?: string;
}
