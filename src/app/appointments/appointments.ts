import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments {
  searchTerm = '';

  appointments = [
    {
      id: 1,
      patientName: 'Rahul Sharma',
      doctorName: 'Dr. Amit Verma',
      department: 'Cardiology',
      date: '04 Sep 2026',
      time: '10:00 AM',
      status: 'Confirmed',
    },
    {
      id: 2,
      patientName: 'Priya Singh',
      doctorName: 'Dr. Neha Gupta',
      department: 'General Medicine',
      date: '04 Sep 2026',
      time: '11:30 AM',
      status: 'Pending',
    },
    {
      id: 3,
      patientName: 'Vikas Kumar',
      doctorName: 'Dr. Rajesh Singh',
      department: 'Orthopedics',
      date: '04 Sep 2026',
      time: '01:00 PM',
      status: 'Completed',
    },
  ];

  get filteredAppointments() {
    const search = this.searchTerm.trim().toLowerCase();

    if (!search) {
      return this.appointments;
    }

    return this.appointments.filter(
      (appointment) =>
        appointment.patientName.toLowerCase().includes(search) ||
        appointment.doctorName.toLowerCase().includes(search) ||
        appointment.department.toLowerCase().includes(search) ||
        appointment.date.toLowerCase().includes(search) ||
        appointment.status.toLowerCase().includes(search),
    );
  }

  openAddAppointment(): void {
    alert('Add Appointment module will be added in the next step.');
  }

  viewAppointment(appointment: any): void {
    alert(
      `Appointment Details\n\n` +
        `Patient: ${appointment.patientName}\n` +
        `Doctor: ${appointment.doctorName}\n` +
        `Department: ${appointment.department}\n` +
        `Date: ${appointment.date}\n` +
        `Time: ${appointment.time}\n` +
        `Status: ${appointment.status}`,
    );
  }
}
