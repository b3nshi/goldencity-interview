import { Inject, Injectable } from '@nestjs/common';
import type { INote } from '../../domain/entities/note.interface';
import type { INoteRepository } from '../../domain/repositories/note.repository';
import { NOTE_REPOSITORY_TOKEN } from '../../domain/repositories/note.repository';
import type { CreateNoteDto } from '../dtos/create-note.dto';

@Injectable()
export class CreateNoteUseCase {
  constructor(
    @Inject(NOTE_REPOSITORY_TOKEN)
    private readonly noteRepository: INoteRepository,
  ) {}

  async execute(createNoteDto: CreateNoteDto): Promise<INote> {
    return this.noteRepository.create(createNoteDto);
  }
}
