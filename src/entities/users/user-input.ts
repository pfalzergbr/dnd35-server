import { InputType, Field } from 'type-graphql';
import { IsEmail, Length, Matches } from 'class-validator';
import { User } from './User';

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  @IsEmail()
  email!: String;

  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[£"'`_+-=@$!%*#?&|,.<>(){}\\[\]])[A-Za-z\d£@"'`_+-=$!%*#?&|,.<>()\\{}[\]]{8,}$/, {
    message: 'Password needs to include a symbol',
  })
  @Length(8)
  @Field()
  password!: String;
}
