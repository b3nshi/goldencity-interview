import { Test, TestingModule } from '@nestjs/testing';
import { NoteRepository } from './note.repository';

describe('NoteRepository', () => {
  let repository: NoteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoteRepository],
    }).compile();

    repository = module.get<NoteRepository>(NoteRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new note with generated id and timestamps', async () => {
      const noteData = {
        title: 'Test Note',
        content: 'Test Content',
      };

      const result = await repository.create(noteData);

      expect(result).toMatchObject({
        title: 'Test Note',
        content: 'Test Content',
      });
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt.getTime()).toBe(result.updatedAt.getTime());
    });

    it('should add the note to the internal array', async () => {
      const noteData = {
        title: 'Test Note',
        content: 'Test Content',
      };

      const result = await repository.create(noteData);
      const allNotes = await repository.findAll();

      expect(allNotes).toHaveLength(1);
      expect(allNotes[0]).toEqual(result);
    });

    it('should create multiple notes independently', async () => {
      const note1 = await repository.create({
        title: 'Note 1',
        content: 'Content 1',
      });
      const note2 = await repository.create({
        title: 'Note 2',
        content: 'Content 2',
      });

      expect(note1.id).not.toBe(note2.id);
      expect(note1.title).toBe('Note 1');
      expect(note2.title).toBe('Note 2');
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no notes exist', async () => {
      const result = await repository.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return all notes', async () => {
      const note1 = await repository.create({
        title: 'Note 1',
        content: 'Content 1',
      });
      const note2 = await repository.create({
        title: 'Note 2',
        content: 'Content 2',
      });

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(note1);
      expect(result).toContainEqual(note2);
    });

    it('should return a copy of the array, not a reference', async () => {
      await repository.create({
        title: 'Note 1',
        content: 'Content 1',
      });

      const result1 = await repository.findAll();
      const result2 = await repository.findAll();

      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);
    });
  });

  describe('findById', () => {
    it('should return null when note does not exist', async () => {
      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });

    it('should return the note when it exists', async () => {
      const createdNote = await repository.create({
        title: 'Test Note',
        content: 'Test Content',
      });

      const result = await repository.findById(createdNote.id);

      expect(result).toEqual(createdNote);
    });

    it('should return null for empty string id', async () => {
      const result = await repository.findById('');

      expect(result).toBeNull();
    });

    it('should find the correct note among multiple notes', async () => {
      const note1 = await repository.create({
        title: 'Note 1',
        content: 'Content 1',
      });
      const note2 = await repository.create({
        title: 'Note 2',
        content: 'Content 2',
      });

      const result = await repository.findById(note1.id);

      expect(result).toEqual(note1);
      expect(result).not.toEqual(note2);
    });
  });

  describe('update', () => {
    it('should return null when note does not exist', async () => {
      const result = await repository.update('non-existent-id', {
        title: 'Updated Title',
      });

      expect(result).toBeNull();
    });

    it('should update the title of an existing note', async () => {
      const createdNote = await repository.create({
        title: 'Original Title',
        content: 'Original Content',
      });

      const beforeUpdate = new Date();
      await new Promise((resolve) => setTimeout(resolve, 10));
      const result = await repository.update(createdNote.id, {
        title: 'Updated Title',
      });
      const afterUpdate = new Date();

      expect(result).toBeDefined();
      expect(result?.title).toBe('Updated Title');
      expect(result?.content).toBe('Original Content');
      expect(result?.id).toBe(createdNote.id);
      expect(result?.createdAt).toEqual(createdNote.createdAt);
      expect(result?.updatedAt).toBeInstanceOf(Date);
      expect(result?.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
      expect(result?.updatedAt.getTime()).toBeLessThanOrEqual(
        afterUpdate.getTime(),
      );
    });

    it('should update the content of an existing note', async () => {
      const createdNote = await repository.create({
        title: 'Original Title',
        content: 'Original Content',
      });

      const result = await repository.update(createdNote.id, {
        content: 'Updated Content',
      });

      expect(result).toBeDefined();
      expect(result?.title).toBe('Original Title');
      expect(result?.content).toBe('Updated Content');
    });

    it('should update both title and content', async () => {
      const createdNote = await repository.create({
        title: 'Original Title',
        content: 'Original Content',
      });

      const result = await repository.update(createdNote.id, {
        title: 'Updated Title',
        content: 'Updated Content',
      });

      expect(result).toBeDefined();
      expect(result?.title).toBe('Updated Title');
      expect(result?.content).toBe('Updated Content');
    });

    it('should update the updatedAt timestamp', async () => {
      const createdNote = await repository.create({
        title: 'Original Title',
        content: 'Original Content',
      });

      const originalUpdatedAt = createdNote.updatedAt;
      await new Promise((resolve) => setTimeout(resolve, 10));

      const result = await repository.update(createdNote.id, {
        title: 'Updated Title',
      });

      expect(result?.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });

    it('should persist the update in findAll', async () => {
      const createdNote = await repository.create({
        title: 'Original Title',
        content: 'Original Content',
      });

      await repository.update(createdNote.id, {
        title: 'Updated Title',
      });

      const allNotes = await repository.findAll();
      const updatedNote = allNotes.find((note) => note.id === createdNote.id);

      expect(updatedNote?.title).toBe('Updated Title');
    });
  });

  describe('delete', () => {
    it('should return false when note does not exist', async () => {
      const result = await repository.delete('non-existent-id');

      expect(result).toBe(false);
    });

    it('should return true when note is deleted', async () => {
      const createdNote = await repository.create({
        title: 'Test Note',
        content: 'Test Content',
      });

      const result = await repository.delete(createdNote.id);

      expect(result).toBe(true);
    });

    it('should remove the note from the repository', async () => {
      const createdNote = await repository.create({
        title: 'Test Note',
        content: 'Test Content',
      });

      await repository.delete(createdNote.id);
      const allNotes = await repository.findAll();
      const foundNote = await repository.findById(createdNote.id);

      expect(allNotes).toHaveLength(0);
      expect(foundNote).toBeNull();
    });

    it('should only delete the specified note', async () => {
      const note1 = await repository.create({
        title: 'Note 1',
        content: 'Content 1',
      });
      const note2 = await repository.create({
        title: 'Note 2',
        content: 'Content 2',
      });

      await repository.delete(note1.id);
      const allNotes = await repository.findAll();

      expect(allNotes).toHaveLength(1);
      expect(allNotes[0].id).toBe(note2.id);
    });

    it('should return false when trying to delete the same note twice', async () => {
      const createdNote = await repository.create({
        title: 'Test Note',
        content: 'Test Content',
      });

      const firstDelete = await repository.delete(createdNote.id);
      const secondDelete = await repository.delete(createdNote.id);

      expect(firstDelete).toBe(true);
      expect(secondDelete).toBe(false);
    });
  });
});
