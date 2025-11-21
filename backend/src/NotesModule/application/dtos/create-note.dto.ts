import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({
    description: 'The title of the note',
    example: 'My First Note',
  })
  title: string;

  @ApiProperty({
    description: 'The content of the note',
    example: 'This is the content of my note',
  })
  content: string;
}
