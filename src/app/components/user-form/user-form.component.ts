import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ isEditMode ? 'Edit User' : 'Create User' }}</h2>
        
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              formControlName="name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              [ngClass]="{'border-red-500': userForm.get('name')?.invalid && userForm.get('name')?.touched}"
            >
            <div *ngIf="userForm.get('name')?.invalid && userForm.get('name')?.touched" class="text-red-500 text-sm mt-1">
              Name is required
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              formControlName="email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              [ngClass]="{'border-red-500': userForm.get('email')?.invalid && userForm.get('email')?.touched}"
            >
            <div *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched" class="text-red-500 text-sm mt-1">
              Valid email is required
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              formControlName="phone"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              [ngClass]="{'border-red-500': userForm.get('phone')?.invalid && userForm.get('phone')?.touched}"
            >
            <div *ngIf="userForm.get('phone')?.invalid && userForm.get('phone')?.touched" class="text-red-500 text-sm mt-1">
              Phone is required
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="text"
              formControlName="website"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              (click)="onCancel()"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="userForm.invalid"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {{ isEditMode ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      website: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      this.loadUser(this.userId);
    }
  }

  loadUser(id: number): void {
    this.userService.getUser(id).subscribe(user => {
      this.userForm.patchValue(user);
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const user: User = this.userForm.value;
    
    if (this.isEditMode && this.userId) {
      user.id = this.userId;
      this.userService.updateUser(user).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.userService.createUser(user).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
} 