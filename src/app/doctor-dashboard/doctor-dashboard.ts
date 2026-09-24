import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})
export class DoctorDashboard implements OnInit {
  sidebarCollapsed = false;
  patients: any[] = [];
  totalPatients = 0;
  loadingPatients = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadMyPatients();
  }

  loadMyPatients(): void {
    this.loadingPatients = true;

    this.http.get<any[]>('http://localhost:8080/api/patients/my-patients').subscribe({
      next: (response) => {
        this.patients = response || [];
        this.totalPatients = this.patients.length;
        this.loadingPatients = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading doctor patients:', error);
        this.patients = [];
        this.totalPatients = 0;
        this.loadingPatients = false;
        this.cdr.detectChanges();
      },
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
