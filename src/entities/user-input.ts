import { InputType, Field } from 'type-graphql';
import { IsEmail, Length, Matches } from 'class-validator';
import { User } from './User';
// import { ObjectId } from 'mongodb'

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  @IsEmail()
  email!: String;

  @Matches(/^(?=.[A-Za-z])(?=.\d)(?=.[@$!%#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Password needs to include an uppercase and lowercase letter, number and symbol',
  })
  @Length(8)
  @Field()
  password!: String;
}
