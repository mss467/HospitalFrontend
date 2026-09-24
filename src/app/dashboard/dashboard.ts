import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  doctors: any[] = [];
  totalDoctors = 0;

  // Sidebar collapsed/expanded state
  sidebarCollapsed = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    console.log('Loading doctors for dashboard...');

    this.http.get<any[]>('http://localhost:8080/api/doctors').subscribe({
      next: (response) => {
        console.log('Dashboard doctors loaded:', response);

        this.doctors = response || [];

        this.totalDoctors = this.doctors.length;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error loading doctors on dashboard:', error);

        this.doctors = [];

        this.totalDoctors = 0;

        this.cdr.detectChanges();
      },
    });
  }

  // Get initials for doctor avatar
  getDoctorInitials(name: string): string {
    if (!name) {
      return 'DR';
    }

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  // Toggle sidebar
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
