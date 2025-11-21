/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { INoteRepository } from '../../domain/repositories/note.repository';
import { NOTE_REPOSITORY_TOKEN } from '../../domain/repositories/note.repository';
import { DeleteNoteUseCase } from './delete-note.use-case';

describe('DeleteNoteUseCase', () => {
  let useCase: DeleteNoteUseCase;
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
        DeleteNoteUseCase,
        {
          provide: NOTE_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteNoteUseCase>(DeleteNoteUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete a note successfully', async () => {
      const noteId = 'test-id';

      mockRepository.delete.mockResolvedValue(true);

      await useCase.execute(noteId);

      expect(mockRepository.delete).toHaveBeenCalledWith(noteId);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when note does not exist', async () => {
      const noteId = 'non-existent-id';

      mockRepository.delete.mockResolvedValue(false);

      await expect(useCase.execute(noteId)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(noteId)).rejects.toThrow(
        `Note with ID ${noteId} not found`,
      );
    });

    it('should call the repository with the correct id', async () => {
      const noteId = 'specific-id';

      mockRepository.delete.mockResolvedValue(true);

      await useCase.execute(noteId);

      expect(mockRepository.delete).toHaveBeenCalledWith(noteId);
      expect(mockRepository.delete).toHaveBeenCalledWith(
        expect.stringContaining('specific-id'),
      );
    });

    it('should not throw when deletion is successful', async () => {
      const noteId = 'test-id';

      mockRepository.delete.mockResolvedValue(true);

      await expect(useCase.execute(noteId)).resolves.not.toThrow();
    });

    it('should throw NotFoundException with correct message format', async () => {
      const noteId = 'missing-id';

      mockRepository.delete.mockResolvedValue(false);

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

    it('should only call delete method, not other repository methods', async () => {
      const noteId = 'test-id';

      mockRepository.delete.mockResolvedValue(true);

      await useCase.execute(noteId);

      expect(mockRepository.delete).toHaveBeenCalled();
      expect(mockRepository.findById).not.toHaveBeenCalled();
      expect(mockRepository.findAll).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });
});
