import { Inject, Injectable } from '@nestjs/common';
import type { INote } from '../../domain/entities/note.interface';
import type { INoteRepository } from '../../domain/repositories/note.repository';
import { NOTE_REPOSITORY_TOKEN } from '../../domain/repositories/note.repository';

@Injectable()
export class GetAllNotesUseCase {
  constructor(
    @Inject(NOTE_REPOSITORY_TOKEN)
    private readonly noteRepository: INoteRepository,
  ) {}

  async execute(): Promise<INote[]> {
    return this.noteRepository.findAll();
  }
}
