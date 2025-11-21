/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import type { INote } from '../../domain/entities/note.interface';
import type { INoteRepository } from '../../domain/repositories/note.repository';
import { NOTE_REPOSITORY_TOKEN } from '../../domain/repositories/note.repository';
import { CreateNoteUseCase } from './create-note.use-case';

describe('CreateNoteUseCase', () => {
  let useCase: CreateNoteUseCase;
  let mockRepository: jest.Mocked<INoteRepository>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateNoteUseCase,
        {
          provide: NOTE_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateNoteUseCase>(CreateNoteUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a note successfully', async () => {
      const createNoteDto = {
        title: 'Test Note',
        content: 'Test Content',
      };

      const expectedNote: INote = {
        id: 'test-id',
        title: 'Test Note',
        content: 'Test Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockResolvedValue(expectedNote);

      const result = await useCase.execute(createNoteDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createNoteDto);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedNote);
    });

    it('should pass the DTO correctly to the repository', async () => {
      const createNoteDto = {
        title: 'Another Note',
        content: 'Another Content',
      };

      const expectedNote: INote = {
        id: 'another-id',
        ...createNoteDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockResolvedValue(expectedNote);

      await useCase.execute(createNoteDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createNoteDto);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Another Note',
          content: 'Another Content',
        }),
      );
    });

    it('should return the note created by the repository', async () => {
      const createNoteDto = {
        title: 'My Note',
        content: 'My Content',
      };

      const repositoryNote: INote = {
        id: 'generated-id',
        title: 'My Note',
        content: 'My Content',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockRepository.create.mockResolvedValue(repositoryNote);

      const result = await useCase.execute(createNoteDto);

      expect(result).toBe(repositoryNote);
      expect(result.id).toBe('generated-id');
    });
  });
});
