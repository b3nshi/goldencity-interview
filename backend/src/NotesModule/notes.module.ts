import { Module } from '@nestjs/common';
import { CreateNoteUseCase } from './application/use-cases/create-note.use-case';
import { DeleteNoteUseCase } from './application/use-cases/delete-note.use-case';
import { GetAllNotesUseCase } from './application/use-cases/get-all-notes.use-case';
import { GetNoteByIdUseCase } from './application/use-cases/get-note-by-id.use-case';
import { UpdateNoteUseCase } from './application/use-cases/update-note.use-case';
import { NOTE_REPOSITORY_TOKEN } from './domain/repositories/note.repository';
import { NotesController } from './infrastructure/controllers/notes.controller';
import { NoteRepository } from './infrastructure/repositories/note.repository';

@Module({
  controllers: [NotesController],
  providers: [
    {
      provide: NOTE_REPOSITORY_TOKEN,
      useClass: NoteRepository,
    },
    NoteRepository,
    CreateNoteUseCase,
    GetAllNotesUseCase,
    GetNoteByIdUseCase,
    UpdateNoteUseCase,
    DeleteNoteUseCase,
  ],
})
export class NotesModule {}
