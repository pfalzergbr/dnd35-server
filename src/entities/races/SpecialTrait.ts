import { prop } from "@typegoose/typegoose";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class SpecialTrait {
  @Field()
  @prop()
  traitName!: String

  @Field()
  @prop()
  traitDescription!: String

  // May be able to add a trait modifier in the future, to handle the 
  // actual gameplay mechanics
}