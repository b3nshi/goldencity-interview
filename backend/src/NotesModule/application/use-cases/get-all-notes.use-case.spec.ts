/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import type { INote } from '../../domain/entities/note.interface';
import type { INoteRepository } from '../../domain/repositories/note.repository';
import { NOTE_REPOSITORY_TOKEN } from '../../domain/repositories/note.repository';
import { GetAllNotesUseCase } from './get-all-notes.use-case';

describe('GetAllNotesUseCase', () => {
  let useCase: GetAllNotesUseCase;
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
        GetAllNotesUseCase,
        {
          provide: NOTE_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetAllNotesUseCase>(GetAllNotesUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return an empty array when no notes exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return all notes from the repository', async () => {
      const notes: INote[] = [
        {
          id: 'id-1',
          title: 'Note 1',
          content: 'Content 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'id-2',
          title: 'Note 2',
          content: 'Content 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAll.mockResolvedValue(notes);

      const result = await useCase.execute();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(notes);
      expect(result).toHaveLength(2);
    });

    it('should call the repository findAll method', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      await useCase.execute();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockRepository.findById).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should return the exact array from the repository', async () => {
      const notes: INote[] = [
        {
          id: 'id-1',
          title: 'Single Note',
          content: 'Single Content',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];

      mockRepository.findAll.mockResolvedValue(notes);

      const result = await useCase.execute();

      expect(result).toBe(notes);
    });
  });
});
