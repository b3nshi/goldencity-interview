import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { INote } from '../../domain/entities/note.interface';
import type { INoteRepository } from '../../domain/repositories/note.repository';
import { NOTE_REPOSITORY_TOKEN } from '../../domain/repositories/note.repository';

@Injectable()
export class GetNoteByIdUseCase {
  constructor(
    @Inject(NOTE_REPOSITORY_TOKEN)
    private readonly noteRepository: INoteRepository,
  ) {}

  async execute(id: string): Promise<INote> {
    const note = await this.noteRepository.findById(id);
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }
}
