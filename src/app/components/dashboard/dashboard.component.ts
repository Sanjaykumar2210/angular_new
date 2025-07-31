import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto p-6">
      <!-- Error Alert -->
      <div *ngIf="error" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <span class="block sm:inline">{{ error }}</span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3" (click)="error = null">
          <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
          </svg>
        </span>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- Dashboard Content -->
      <div *ngIf="!loading && !error">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-800">Welcome Back!</h1>
          <p class="text-gray-600 mt-1">Here's what's happening in your hospital today.</p>
        </div>

        <!-- Top Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-lg opacity-90">Total Patients</p>
                <h2 class="text-4xl font-bold mt-2">{{ dashboardData.totalPatients }}</h2>
              </div>
              <div class="p-2 bg-purple-500 bg-opacity-30 rounded-lg">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-sm opacity-75">Monthly Growth</div>
              <div class="flex items-center">
                <span class="text-green-300">↑</span>
                <span class="ml-1">12%</span>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-lg opacity-90">Total Appointments</p>
                <h2 class="text-4xl font-bold mt-2">{{ dashboardData.totalAppointments }}</h2>
              </div>
              <div class="p-2 bg-blue-400 bg-opacity-30 rounded-lg">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-sm opacity-75">vs Last Week</div>
              <div class="flex items-center">
                <span class="text-green-300">↑</span>
                <span class="ml-1">8%</span>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-lg opacity-90">Today's Appointments</p>
                <h2 class="text-4xl font-bold mt-2">{{ dashboardData.todaysTotalAppointments }}</h2>
              </div>
              <div class="p-2 bg-green-400 bg-opacity-30 rounded-lg">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-sm opacity-75">Completion Rate</div>
              <div class="flex items-center">
                <span class="text-yellow-300">→</span>
                <span class="ml-1">On Track</span>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-lg opacity-90">Completed Today</p>
                <h2 class="text-4xl font-bold mt-2">{{ dashboardData.todaysTotalDoneAppointments }}</h2>
              </div>
              <div class="p-2 bg-yellow-400 bg-opacity-30 rounded-lg">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-sm opacity-75">Success Rate</div>
              <div class="flex items-center">
                <span class="text-green-300">↑</span>
                <span class="ml-1">95%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Middle Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Appointments Chart -->
          <div class="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-semibold text-gray-800">Appointments Overview</h3>
              <div class="flex space-x-2">
                <button (click)="updateChartView('weekly')" 
                        [class]="chartView === 'weekly' ? 'px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full font-medium' : 'px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-full'">
                  Weekly
                </button>
                <button (click)="updateChartView('monthly')"
                        [class]="chartView === 'monthly' ? 'px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full font-medium' : 'px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-full'">
                  Monthly
                </button>
              </div>
            </div>
            <div class="relative h-80 w-full">
              <canvas #appointmentsChart></canvas>
            </div>
          </div>

          <!-- Department Stats -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">Department Stats</h3>
            <div class="space-y-6">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-gray-600">Cardiology</span>
                  <span class="text-sm font-medium text-blue-600">32 Patients</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full">
                  <div class="h-full w-3/4 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-gray-600">Neurology</span>
                  <span class="text-sm font-medium text-blue-600">28 Patients</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full">
                  <div class="h-full w-2/3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-gray-600">Pediatrics</span>
                  <span class="text-sm font-medium text-blue-600">24 Patients</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full">
                  <div class="h-full w-1/2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Recent Activity -->
          <div class="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h3>
            <div class="space-y-4">
              <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-green-100 text-green-500 rounded-full">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">New appointment completed</p>
                  <p class="text-sm text-gray-500">Dr. Smith with Patient #12458</p>
                  <p class="text-xs text-gray-400 mt-1">2 minutes ago</p>
                </div>
              </div>
              <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">New patient registered</p>
                  <p class="text-sm text-gray-500">Patient #12459 - Jane Doe</p>
                  <p class="text-xs text-gray-400 mt-1">15 minutes ago</p>
                </div>
              </div>
              <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-yellow-100 text-yellow-500 rounded-full">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">Appointment rescheduled</p>
                  <p class="text-sm text-gray-500">Dr. Johnson - Patient #12445</p>
                  <p class="text-xs text-gray-400 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions & System Status -->
          <div class="space-y-6">
            <!-- Quick Actions -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div class="grid grid-cols-2 gap-4">
                <a routerLink="/appointments/add" 
                   class="flex items-center justify-center p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                  <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  New Appointment
                </a>
                <a routerLink="/patients/add"
                   class="flex items-center justify-center p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                  <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  New Patient
                </a>
              </div>
            </div>

            <!-- System Status -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">System Status</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">System Status</span>
                  <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Operational</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Last Updated</span>
                  <span class="text-gray-800">{{ currentTime | date:'medium' }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Server Load</span>
                  <div class="w-32 h-2 bg-gray-200 rounded-full">
                    <div class="h-full w-1/4 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('appointmentsChart') appointmentsChart!: ElementRef;
  private chart: Chart | null = null;
  chartView: 'weekly' | 'monthly' = 'weekly';
  
  dashboardData = {
    totalPatients: 0,
    totalAppointments: 0,
    todaysTotalAppointments: 0,
    todaysTotalDoneAppointments: 0
  };
  loading = false;
  error: string | null = null;
  currentTime = new Date();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
    // Set default chart view to weekly
    this.chartView = 'weekly';
  }

  ngAfterViewInit() {
    // Initialize the weekly chart immediately when dashboard opens
    this.initializeWeeklyChart();
  }

  updateChartView(view: 'weekly' | 'monthly') {
    this.chartView = view;
    this.initializeAppointmentsChart();
  }

  loadDashboardData() {
    this.loading = true;
    this.error = null;

    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard data. Please try again later.';
        this.loading = false;
        console.error('Error loading dashboard data:', err);
      }
    });
  }

  private getChartData(): { labels: string[], appointments: number[], completed: number[] } {
    if (this.chartView === 'weekly') {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        appointments: [12, 19, 15, 17, 14, 10, 8],
        completed: [10, 15, 12, 15, 10, 8, 6]
      };
    } else {
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        appointments: [65, 59, 80, 81, 56, 55, 40, 45, 50, 55, 60, 65],
        completed: [55, 49, 70, 71, 46, 45, 30, 35, 40, 45, 50, 55]
      };
    }
  }

  private initializeAppointmentsChart() {
    const canvas = this.appointmentsChart?.nativeElement;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context');
      return;
    }

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    const { labels, appointments, completed } = this.getChartData();

    try {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Appointments',
              data: appointments,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              fill: true,
              borderWidth: 2
            },
            {
              label: 'Completed',
              data: completed,
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              tension: 0.4,
              fill: true,
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                font: {
                  size: 11
                }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 11
                }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          },
          elements: {
            point: {
              radius: 4,
              hoverRadius: 6,
              hoverBorderWidth: 2
            }
          }
        }
      });
      
      console.log('Weekly chart initialized successfully');
    } catch (error) {
      console.error('Error initializing chart:', error);
    }
  }

  // New method to specifically initialize weekly chart
  private initializeWeeklyChart() {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      this.initializeAppointmentsChart();
    }, 100);
  }
} 