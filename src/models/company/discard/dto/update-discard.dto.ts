import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscardDto } from './create-discard.dto';

export class UpdateDiscardDto extends PartialType(CreateDiscardDto) {}
