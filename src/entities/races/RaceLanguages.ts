import { prop, modelOptions } from "@typegoose/typegoose";
import { ObjectType, Field } from "type-graphql";


@modelOptions({ options: {allowMixed: 0}})
@ObjectType()
export class RaceLanguage {
  @Field(() => [String], {description: 'Base languages automatically spoken by all characters from this race'})
  @prop({required: true})
  baseLanguages!: String[]

  @Field(() => [String], {description: 'Extra languages the characters of the race can choose from.'})
  @prop({required: true})
  extraLanguages!: String[]
}
