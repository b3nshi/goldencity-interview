import { INote } from '../entities/note.interface';

export const NOTE_REPOSITORY_TOKEN = Symbol('NOTE_REPOSITORY');

export interface INoteRepository {
  create(note: Omit<INote, 'id' | 'createdAt' | 'updatedAt'>): Promise<INote>;
  findAll(): Promise<INote[]>;
  findById(id: string): Promise<INote | null>;
  update(
    id: string,
    note: Partial<Omit<INote, 'id' | 'createdAt'>>,
  ): Promise<INote | null>;
  delete(id: string): Promise<boolean>;
}
