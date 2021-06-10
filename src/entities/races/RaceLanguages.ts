import { prop } from "@typegoose/typegoose";
import { ObjectType, Field } from "type-graphql";



@ObjectType()
export class RaceLanguage {
  @Field({description: 'Base languages automatically spoken by all characters from this race'})
  @prop({required: true})
  baseLanguages!: [String]

  @Field({description: 'Extra languages the characters of the race can choose from.'})
  @prop({required: true})
  extraLanguages!: [String]
}
