/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { INote } from '../../domain/entities/note.interface';
import type { INoteRepository } from '../../domain/repositories/note.repository';
import { NOTE_REPOSITORY_TOKEN } from '../../domain/repositories/note.repository';
import { UpdateNoteUseCase } from './update-note.use-case';

describe('UpdateNoteUseCase', () => {
  let useCase: UpdateNoteUseCase;
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
        UpdateNoteUseCase,
        {
          provide: NOTE_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateNoteUseCase>(UpdateNoteUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update a note successfully', async () => {
      const noteId = 'test-id';
      const updateDto = {
        title: 'Updated Title',
      };

      const updatedNote: INote = {
        id: noteId,
        title: 'Updated Title',
        content: 'Original Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.update.mockResolvedValue(updatedNote);

      const result = await useCase.execute(noteId, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(noteId, updateDto);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedNote);
    });

    it('should throw NotFoundException when note does not exist', async () => {
      const noteId = 'non-existent-id';
      const updateDto = {
        title: 'Updated Title',
      };

      mockRepository.update.mockResolvedValue(null);

      await expect(useCase.execute(noteId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(useCase.execute(noteId, updateDto)).rejects.toThrow(
        `Note with ID ${noteId} not found`,
      );
    });

    it('should update only the title when provided', async () => {
      const noteId = 'test-id';
      const updateDto = {
        title: 'New Title',
      };

      const updatedNote: INote = {
        id: noteId,
        title: 'New Title',
        content: 'Original Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.update.mockResolvedValue(updatedNote);

      const result = await useCase.execute(noteId, updateDto);

      expect(result.title).toBe('New Title');
      expect(mockRepository.update).toHaveBeenCalledWith(noteId, updateDto);
    });

    it('should update only the content when provided', async () => {
      const noteId = 'test-id';
      const updateDto = {
        content: 'New Content',
      };

      const updatedNote: INote = {
        id: noteId,
        title: 'Original Title',
        content: 'New Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.update.mockResolvedValue(updatedNote);

      const result = await useCase.execute(noteId, updateDto);

      expect(result.content).toBe('New Content');
      expect(mockRepository.update).toHaveBeenCalledWith(noteId, updateDto);
    });

    it('should update both title and content when both provided', async () => {
      const noteId = 'test-id';
      const updateDto = {
        title: 'New Title',
        content: 'New Content',
      };

      const updatedNote: INote = {
        id: noteId,
        title: 'New Title',
        content: 'New Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.update.mockResolvedValue(updatedNote);

      const result = await useCase.execute(noteId, updateDto);

      expect(result.title).toBe('New Title');
      expect(result.content).toBe('New Content');
      expect(mockRepository.update).toHaveBeenCalledWith(noteId, updateDto);
    });

    it('should call the repository with correct parameters', async () => {
      const noteId = 'specific-id';
      const updateDto = {
        title: 'Updated',
        content: 'Updated Content',
      };

      const updatedNote: INote = {
        id: noteId,
        ...updateDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.update.mockResolvedValue(updatedNote);

      await useCase.execute(noteId, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(noteId, updateDto);
      expect(mockRepository.update).toHaveBeenCalledWith(
        'specific-id',
        expect.objectContaining({
          title: 'Updated',
          content: 'Updated Content',
        }),
      );
    });

    it('should return the exact note from the repository', async () => {
      const noteId = 'test-id';
      const updateDto = { title: 'Updated' };
      const repositoryNote: INote = {
        id: noteId,
        title: 'Updated',
        content: 'Content',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      mockRepository.update.mockResolvedValue(repositoryNote);

      const result = await useCase.execute(noteId, updateDto);

      expect(result).toBe(repositoryNote);
    });
  });
});
