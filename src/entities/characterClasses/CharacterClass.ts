import { ObjectType, ID, Field } from 'type-graphql';
import { prop, getModelForClass, mongoose, modelOptions } from '@typegoose/typegoose';
import { SkillModifiers } from './SkillModifiers';
import { Level } from './Level';


@modelOptions({ schemaOptions: {collection: 'characterClasses'}, options: {allowMixed: 0}})
@ObjectType({ description: 'Character Class model' })
export class CharacterClass {
  @Field(() => ID, { name: 'id' })
  @prop()
  _id!: mongoose.Types.ObjectId;

  @Field({ description: 'Name of the character class' })
  @prop({ required: true })
  name!: String;

  @Field({description: 'Description of the character class'})
  @prop({required: true})
  classDescription!: String; 

  @Field(() => [String],{ description: 'Available alignments for the members of the class' })
  @prop({ required: true })
  alignments!: String[];

  @Field({description: 'Hitpoint die per level'})
  @prop({required: true})
  hitDie!: Number;

  @Field({ description: 'Type of magic used by the class' })
  @prop({ required: false, nullable: true })
  magicType!: String;
  // Change to ENUM

  @Field({
    description: 'Ability associated with the use of magic for this class',
  })
  @prop({ required: false, nullable: true })
  magicAbility!: String;
  // Change to ENUM

  @Field(() => SkillModifiers, {description: 'Skill information for the class'})
  @prop({required: true})
  skillModifiers!: SkillModifiers;
  
  @Field(() => [Level], { description: 'Level up chart for the class'})
  @prop({required: true})
  levels!: Level[]


  public static async findCharacterClass(id: string){
    const characterClass = await CharacterClassModel.findOne({ _id: id });
    if (!characterClass) {
      throw new Error('Class not found');
    }
    return characterClass;
  }
}

export const CharacterClassModel = getModelForClass(CharacterClass);
