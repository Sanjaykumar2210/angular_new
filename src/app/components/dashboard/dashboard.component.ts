import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto p-6">
      <!-- Top Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- Cards remain the same -->
        <div class="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg shadow-lg p-6 text-white">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-lg opacity-90">Total Patients</p>
              <h2 class="text-4xl font-bold mt-2">{{ totalPatients }}</h2>
            </div>
            <button class="p-2 bg-purple-500 bg-opacity-30 rounded-lg">
              <span class="text-xl">👥</span>
            </button>
          </div>
        </div>

        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-lg opacity-90">Monthly Patients</p>
              <div class="flex items-center mt-2">
                <h2 class="text-4xl font-bold">{{ monthlyPatients }}</h2>
                <span class="ml-2 text-sm bg-blue-400 bg-opacity-30 px-2 py-1 rounded">
                  {{ monthlyGrowth }}% vs last month
                </span>
              </div>
            </div>
            <div class="flex-shrink-0">
              <svg class="w-16 h-8" viewBox="0 0 100 50">
                <path d="M0 40 L20 35 L40 45 L60 30 L80 35 L100 25" 
                      stroke="white" fill="none" stroke-width="2"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg shadow-lg p-6 text-white">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-lg opacity-90">Total Revenue</p>
              <h2 class="text-4xl font-bold mt-2">{{ totalRevenue }}k</h2>
            </div>
            <button class="p-2 bg-blue-400 bg-opacity-30 rounded-lg">
              <span class="text-xl">📈</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Middle Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Growth Chart -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-xl font-semibold text-gray-800">Monthly Growth</h3>
              <p class="text-2xl font-bold mt-2">{{ monthlyGrowthAmount }}</p>
            </div>
            <select class="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
              <option>Month</option>
              <option>Year</option>
            </select>
          </div>
          
          <div class="h-64 bg-gray-50 rounded-lg flex items-end justify-between p-4">
            <div *ngFor="let bar of growthData" 
                 class="w-8 bg-purple-500 rounded-t-lg" 
                 [style.height.%]="bar.height">
            </div>
          </div>
        </div>

        <!-- Popular Departments -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-6">Popular Departments</h3>
          <div class="space-y-4">
            <div *ngFor="let department of popularDepartments" 
                 class="bg-gray-50 rounded-lg p-4">
              <div class="flex justify-between items-center">
                <div>
                  <h4 class="font-semibold text-gray-800">{{ department.name }}</h4>
                  <p class="text-sm text-gray-500">{{ department.growth }}% Growth</p>
                </div>
                <span [class]="department.trend === 'up' ? 'text-green-500' : 'text-red-500'">
                  {{ department.revenue }}
                </span>
              </div>
              <div class="mt-2 h-2 bg-gray-200 rounded-full">
                <div class="h-full bg-purple-500 rounded-full"
                     [style.width.%]="department.progress"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Appointments -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-6">Recent Appointments</h3>
          <div class="space-y-4">
            <div *ngFor="let appointment of recentAppointments" 
                 class="flex items-center p-4 bg-gray-50 rounded-lg">
              <div class="flex-shrink-0">
                <div [class]="getStatusClass(appointment.status)">
                  {{ appointment.status }}
                </div>
              </div>
              <div class="ml-4 flex-1">
                <h4 class="text-sm font-medium text-gray-900">{{ appointment.patientName }}</h4>
                <p class="text-sm text-gray-500">{{ appointment.doctorName }} • {{ appointment.department }}</p>
              </div>
              <div class="text-right text-sm text-gray-500">
                {{ appointment.time }}
              </div>
            </div>
          </div>
          <div class="mt-4 text-center">
            <button class="text-blue-600 hover:text-blue-800 font-medium">View All Appointments</button>
          </div>
        </div>

        <!-- Hospital Stats -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-6">Hospital Statistics</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <span class="text-xl mr-3">🏥</span>
                <span class="text-gray-700">Available Beds</span>
              </div>
              <span class="font-semibold text-gray-900">{{ hospitalStats.availableBeds }}/{{ hospitalStats.totalBeds }}</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <span class="text-xl mr-3">👨‍⚕️</span>
                <span class="text-gray-700">Active Doctors</span>
              </div>
              <span class="font-semibold text-gray-900">{{ hospitalStats.activeDoctors }}</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <span class="text-xl mr-3">🚑</span>
                <span class="text-gray-700">Emergency Cases</span>
              </div>
              <span class="font-semibold text-gray-900">{{ hospitalStats.emergencyCases }}</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <span class="text-xl mr-3">💉</span>
                <span class="text-gray-700">Operations Today</span>
              </div>
              <span class="font-semibold text-gray-900">{{ hospitalStats.operationsToday }}</span>
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
export class DashboardComponent implements OnInit {
  // Existing properties remain the same
  totalPatients: string = '450';
  monthlyPatients: string = '80';
  monthlyGrowth: string = '+15';
  totalRevenue: string = '203';
  monthlyGrowthAmount: string = '$2,324.00';

  growthData = [
    { month: 'Jan', height: 80 },
    { month: 'Feb', height: 40 },
    { month: 'Mar', height: 70 },
    { month: 'Apr', height: 60 },
    { month: 'May', height: 50 },
    { month: 'Jun', height: 45 },
    { month: 'Jul', height: 40 },
    { month: 'Aug', height: 35 },
    { month: 'Sep', height: 30 },
    { month: 'Oct', height: 25 },
    { month: 'Nov', height: 20 },
    { month: 'Dec', height: 15 }
  ];

  popularDepartments = [
    {
      name: 'Cardiology',
      growth: 10,
      revenue: '$1,839.00',
      trend: 'up',
      progress: 80
    },
    {
      name: 'Neurology',
      growth: 8,
      revenue: '$1,520.00',
      trend: 'up',
      progress: 65
    },
    {
      name: 'Pediatrics',
      growth: -2,
      revenue: '$100.00',
      trend: 'down',
      progress: 40
    }
  ];

  // New properties for additional sections
  recentAppointments = [
    {
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
      department: 'Cardiology',
      status: 'Completed',
      time: '10:00 AM'
    },
    {
      patientName: 'Jane Smith',
      doctorName: 'Dr. Johnson',
      department: 'Neurology',
      status: 'Pending',
      time: '11:30 AM'
    },
    {
      patientName: 'Robert Brown',
      doctorName: 'Dr. Davis',
      department: 'Pediatrics',
      status: 'In Progress',
      time: '2:00 PM'
    }
  ];

  hospitalStats = {
    availableBeds: 45,
    totalBeds: 100,
    activeDoctors: 28,
    emergencyCases: 15,
    operationsToday: 8
  };

  constructor(
    private doctorService: DoctorService,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    this.loadStatistics();
  }

  loadStatistics() {
    this.doctorService.getDoctors().subscribe(doctors => {
      // Update statistics based on doctors data
    });

    this.patientService.getPatientStatistics().subscribe(stats => {
      this.totalPatients = stats.total.toString();
      this.monthlyPatients = (stats.admitted + stats.underTreatment).toString();
    });
  }

  getStatusClass(status: string): string {
    const baseClass = 'px-3 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'Completed':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'Pending':
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'In Progress':
        return `${baseClass} bg-blue-100 text-blue-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }
} 