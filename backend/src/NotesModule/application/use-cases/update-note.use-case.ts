import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { INote } from '../../domain/entities/note.interface';
import type { INoteRepository } from '../../domain/repositories/note.repository';
import { NOTE_REPOSITORY_TOKEN } from '../../domain/repositories/note.repository';
import type { UpdateNoteDto } from '../dtos/update-note.dto';

@Injectable()
export class UpdateNoteUseCase {
  constructor(
    @Inject(NOTE_REPOSITORY_TOKEN)
    private readonly noteRepository: INoteRepository,
  ) {}

  async execute(id: string, updateNoteDto: UpdateNoteDto): Promise<INote> {
    const note = await this.noteRepository.update(id, updateNoteDto);
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }
}
