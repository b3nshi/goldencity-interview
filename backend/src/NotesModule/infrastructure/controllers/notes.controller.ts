import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import type { CreateNoteDto } from '../../application/dtos/create-note.dto';
import type { UpdateNoteDto } from '../../application/dtos/update-note.dto';
import { CreateNoteUseCase } from '../../application/use-cases/create-note.use-case';
import { DeleteNoteUseCase } from '../../application/use-cases/delete-note.use-case';
import { GetAllNotesUseCase } from '../../application/use-cases/get-all-notes.use-case';
import { GetNoteByIdUseCase } from '../../application/use-cases/get-note-by-id.use-case';
import { UpdateNoteUseCase } from '../../application/use-cases/update-note.use-case';

@Controller('api/notes')
export class NotesController {
  constructor(
    private readonly createNoteUseCase: CreateNoteUseCase,
    private readonly getAllNotesUseCase: GetAllNotesUseCase,
    private readonly getNoteByIdUseCase: GetNoteByIdUseCase,
    private readonly updateNoteUseCase: UpdateNoteUseCase,
    private readonly deleteNoteUseCase: DeleteNoteUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createNoteDto: CreateNoteDto) {
    return this.createNoteUseCase.execute(createNoteDto);
  }

  @Get()
  async findAll() {
    return this.getAllNotesUseCase.execute();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getNoteByIdUseCase.execute(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.updateNoteUseCase.execute(id, updateNoteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.deleteNoteUseCase.execute(id);
  }
}
