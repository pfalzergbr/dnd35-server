import { mongoose } from "@typegoose/typegoose";
import { Mutation, Resolver, Ctx, Arg } from "type-graphql";
import { Character, CharacterModel} from '../entities/Character'
import { CharacterInput } from "../entities/character-inputs";
import { UserModel } from "../entities/User";
import { ApolloContext } from "../typings/context";


@Resolver()
export class CharacterResolver {
  @Mutation(() => Character)
  async createCharacter(@Arg('characterData') {name}: CharacterInput, @Ctx() {req}: ApolloContext) {
    if (!req.user) {
      throw new Error('Unauthorized. Please log in to create a character')
    }
    const session = await mongoose.startSession()
    session.startTransaction()
    const user = await UserModel.findOne({_id: req.user.id}).session(session)
    if (!user){
      throw new Error('User not found')
    }
    const character = new CharacterModel({
      _id: mongoose.Types.ObjectId(),
      name, 
      ownerId: req.user.id,
      isCompleted: false  
    })
    const characterLink = {
      characterId: character._id,
      name,
      race: null,
      class: null,
      level: 1
    }
    user.characters.push(characterLink)
    console.log(character)
    await character.save({session: session})
    console.log(user)
    await user.save({session: session})
    await session.commitTransaction()
    session.endSession()
    return character
  }
}