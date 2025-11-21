/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { INote } from '../../domain/entities/note.interface';
import type { INoteRepository } from '../../domain/repositories/note.repository';
import { NOTE_REPOSITORY_TOKEN } from '../../domain/repositories/note.repository';
import { GetNoteByIdUseCase } from './get-note-by-id.use-case';

describe('GetNoteByIdUseCase', () => {
  let useCase: GetNoteByIdUseCase;
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
        GetNoteByIdUseCase,
        {
          provide: NOTE_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetNoteByIdUseCase>(GetNoteByIdUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return a note when it exists', async () => {
      const noteId = 'test-id';
      const expectedNote: INote = {
        id: noteId,
        title: 'Test Note',
        content: 'Test Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(expectedNote);

      const result = await useCase.execute(noteId);

      expect(mockRepository.findById).toHaveBeenCalledWith(noteId);
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedNote);
    });

    it('should throw NotFoundException when note does not exist', async () => {
      const noteId = 'non-existent-id';

      mockRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(noteId)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(noteId)).rejects.toThrow(
        `Note with ID ${noteId} not found`,
      );
    });

    it('should call the repository with the correct id', async () => {
      const noteId = 'specific-id';
      const expectedNote: INote = {
        id: noteId,
        title: 'Test Note',
        content: 'Test Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(expectedNote);

      await useCase.execute(noteId);

      expect(mockRepository.findById).toHaveBeenCalledWith(noteId);
      expect(mockRepository.findById).toHaveBeenCalledWith(
        expect.stringContaining('specific-id'),
      );
    });

    it('should return the exact note from the repository', async () => {
      const noteId = 'test-id';
      const repositoryNote: INote = {
        id: noteId,
        title: 'Repository Note',
        content: 'Repository Content',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      mockRepository.findById.mockResolvedValue(repositoryNote);

      const result = await useCase.execute(noteId);

      expect(result).toBe(repositoryNote);
    });

    it('should throw NotFoundException with correct message format', async () => {
      const noteId = 'missing-id';

      mockRepository.findById.mockResolvedValue(null);

      try {
        await useCase.execute(noteId);
        fail('Should have thrown NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as NotFoundException).message).toBe(
          `Note with ID ${noteId} not found`,
        );
      }
    });
  });
});
