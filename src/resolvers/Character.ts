import { mongoose } from "@typegoose/typegoose";
import { Mutation, Resolver, Ctx, Arg } from "type-graphql";
import { Character, CharacterModel} from '../entities/Character'
import { CharacterInput } from "../entities/character-inputs";
import { ApolloContext } from "../typings/context";


@Resolver()
export class CharacterResolver {
  @Mutation(() => Character)
  async createCharacter(@Arg('characterData') {name}: CharacterInput, @Ctx() {req}: ApolloContext) {
    const character = new CharacterModel({
      _id: mongoose.Types.ObjectId(),
      name, 
      ownerId: req.user.id,
      isCompleted: false  
    })
    await character.save()
    return character
  }
}