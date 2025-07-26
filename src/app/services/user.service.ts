import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'users';
  private nextId = 1;

  constructor() {
    // Initialize nextId based on existing users
    const users = this.getStoredUsers();
    if (users.length > 0) {
      this.nextId = Math.max(...users.map(u => u.id || 0)) + 1;
    }
  }

  private getStoredUsers(): User[] {
    const users = localStorage.getItem(this.STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }

  getUsers(): Observable<User[]> {
    return of(this.getStoredUsers());
  }

  getUser(id: number): Observable<User> {
    const users = this.getStoredUsers();
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return of(user);
  }

  createUser(user: User): Observable<User> {
    const users = this.getStoredUsers();
    const newUser = { ...user, id: this.nextId++ };
    users.push(newUser);
    this.saveUsers(users);
    return of(newUser);
  }

  updateUser(user: User): Observable<User> {
    const users = this.getStoredUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index === -1) throw new Error('User not found');
    users[index] = user;
    this.saveUsers(users);
    return of(user);
  }

  deleteUser(id: number): Observable<void> {
    const users = this.getStoredUsers();
    const filteredUsers = users.filter(u => u.id !== id);
    this.saveUsers(filteredUsers);
    return of(void 0);
  }
} 