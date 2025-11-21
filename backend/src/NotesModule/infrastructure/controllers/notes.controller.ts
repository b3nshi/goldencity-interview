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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateNoteDto } from '../../application/dtos/create-note.dto';
import { UpdateNoteDto } from '../../application/dtos/update-note.dto';
import { CreateNoteUseCase } from '../../application/use-cases/create-note.use-case';
import { DeleteNoteUseCase } from '../../application/use-cases/delete-note.use-case';
import { GetAllNotesUseCase } from '../../application/use-cases/get-all-notes.use-case';
import { GetNoteByIdUseCase } from '../../application/use-cases/get-note-by-id.use-case';
import { UpdateNoteUseCase } from '../../application/use-cases/update-note.use-case';

@ApiTags('notes')
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
  @ApiOperation({ summary: 'Create a new note' })
  @ApiBody({ type: CreateNoteDto })
  @ApiResponse({
    status: 201,
    description: 'The note has been successfully created.',
  })
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
  @ApiOperation({ summary: 'Update a note by ID' })
  @ApiBody({ type: UpdateNoteDto })
  @ApiResponse({
    status: 200,
    description: 'The note has been successfully updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'Note not found.',
  })
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.updateNoteUseCase.execute(id, updateNoteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.deleteNoteUseCase.execute(id);
  }
}
