import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { OrderEnum } from '../base.interface';
import { IsEnum, IsNotEmpty } from 'class-validator';

registerEnumType(OrderEnum, {
  name: 'OrderEnum',
});

@InputType()
export abstract class SortingInput<SortingFieldsEnum> {
  @IsNotEmpty()
  @IsEnum(OrderEnum)
  @Field(() => OrderEnum)
  order: OrderEnum;

  abstract field: SortingFieldsEnum;
}
