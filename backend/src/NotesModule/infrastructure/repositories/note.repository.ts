import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { INote } from '../../domain/entities/note.interface';
import { INoteRepository } from '../../domain/repositories/note.repository';

/**
 * This a simple in-memory repo that emulates async operations.
 */
@Injectable()
export class NoteRepository implements INoteRepository {
  private notes: INote[] = [];

  async create(
    note: Omit<INote, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<INote> {
    const now = new Date();
    const newNote: INote = {
      id: randomUUID(),
      ...note,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.push(newNote);
    return Promise.resolve(newNote);
  }

  async findAll(): Promise<INote[]> {
    return Promise.resolve([...this.notes]);
  }

  async findById(id: string): Promise<INote | null> {
    return Promise.resolve(this.notes.find((note) => note.id === id) || null);
  }

  async update(
    id: string,
    updateData: Partial<Omit<INote, 'id' | 'createdAt'>>,
  ): Promise<INote | null> {
    const noteIndex = this.notes.findIndex((note) => note.id === id);
    if (noteIndex === -1) {
      return null;
    }

    const updatedNote: INote = {
      ...this.notes[noteIndex],
      ...updateData,
      updatedAt: new Date(),
    };
    this.notes[noteIndex] = updatedNote;
    return Promise.resolve(updatedNote);
  }

  async delete(id: string): Promise<boolean> {
    const noteIndex = this.notes.findIndex((note) => note.id === id);
    if (noteIndex === -1) {
      return false;
    }
    this.notes.splice(noteIndex, 1);
    return Promise.resolve(true);
  }
}
