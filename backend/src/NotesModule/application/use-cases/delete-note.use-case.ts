import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { INoteRepository } from '../../domain/repositories/note.repository';
import { NOTE_REPOSITORY_TOKEN } from '../../domain/repositories/note.repository';

@Injectable()
export class DeleteNoteUseCase {
  constructor(
    @Inject(NOTE_REPOSITORY_TOKEN)
    private readonly noteRepository: INoteRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.noteRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
  }
}
