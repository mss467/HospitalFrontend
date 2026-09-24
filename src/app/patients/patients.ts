import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
})
export class Patients implements OnInit {
  patients: any[] = [];

  searchTerm = '';

  showAddPatient = false;
  showViewPatient = false;
  showEditPatient = false;

  selectedPatient: any = null;

  patient = {
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    age: '',
    bloodGroup: '',
    address: '',
  };

  editPatient: any = {
    patientId: null,
    fullName: '',
    age: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    address: '',
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  /* ===================================================== */
  /* LOAD PATIENTS */
  /* ===================================================== */

  loadPatients(): void {
    console.log('Loading patients...');

    this.http.get<any[]>('http://localhost:8080/api/patients').subscribe({
      next: (response) => {
        console.log('Patients loaded:', response);

        this.patients = response || [];

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error loading patients:', error);

        this.patients = [];

        this.cdr.detectChanges();
      },
    });
  }

  /* ===================================================== */
  /* SEARCH PATIENTS */
  /* ===================================================== */

  get filteredPatients(): any[] {
    const search = this.searchTerm.trim().toLowerCase();

    if (!search) {
      return this.patients;
    }

    return this.patients.filter((patient) => {
      const fullName = String(patient.fullName || '').toLowerCase();
      const patientId = String(patient.patientId || '').toLowerCase();
      const phone = String(patient.phone || '').toLowerCase();
      const gender = String(patient.gender || '').toLowerCase();
      const bloodGroup = String(patient.bloodGroup || '').toLowerCase();
      const address = String(patient.address || '').toLowerCase();
      const age = String(patient.age || '').toLowerCase();

      return (
        fullName.includes(search) ||
        patientId.includes(search) ||
        phone.includes(search) ||
        gender.includes(search) ||
        bloodGroup.includes(search) ||
        address.includes(search) ||
        age.includes(search)
      );
    });
  }

  /* ===================================================== */
  /* ADD PATIENT */
  /* ===================================================== */

  openAddPatient(): void {
    console.log('Opening Add Patient modal');

    this.showAddPatient = true;

    this.cdr.detectChanges();
  }

  closeAddPatient(): void {
    console.log('Closing Add Patient modal');

    this.showAddPatient = false;

    this.cdr.detectChanges();
  }

  addPatient(): void {
    console.log('Add Patient clicked');

    if (!this.patient.fullName || !this.patient.fullName.trim()) {
      alert('Patient name is required!');
      return;
    }

    const patientData = {
      fullName: this.patient.fullName.trim(),
      age: this.patient.age === '' ? 0 : Number(this.patient.age),
      gender: this.patient.gender || '',
      bloodGroup: this.patient.bloodGroup || '',
      phone: this.patient.phone || '',
      address: this.patient.address || '',
    };

    console.log('Sending patient data:', patientData);

    this.http.post<any>('http://localhost:8080/api/patients', patientData).subscribe({
      next: (response) => {
        console.log('Patient added:', response);

        this.showAddPatient = false;

        this.patient = {
          fullName: '',
          email: '',
          phone: '',
          gender: '',
          age: '',
          bloodGroup: '',
          address: '',
        };

        this.cdr.detectChanges();

        this.loadPatients();

        alert('Patient added successfully!');
      },

      error: (error) => {
        console.error('Error adding patient:', error);

        alert('Failed to add patient. Please check the backend.');
      },
    });
  }

  /* ===================================================== */
  /* VIEW PATIENT */
  /* ===================================================== */

  viewPatient(patientItem: any): void {
    console.log('Viewing patient:', patientItem);

    this.selectedPatient = {
      ...patientItem,
    };

    this.showViewPatient = true;

    this.cdr.detectChanges();
  }

  closeViewPatient(): void {
    console.log('Closing View Patient modal');

    this.showViewPatient = false;
    this.selectedPatient = null;

    this.cdr.detectChanges();
  }

  /* ===================================================== */
  /* EDIT PATIENT */
  /* ===================================================== */

  openEditPatient(patientItem: any): void {
    console.log('Opening Edit Patient:', patientItem);

    this.editPatient = {
      patientId: patientItem.patientId,
      fullName: patientItem.fullName || '',
      age: patientItem.age ?? '',
      gender: patientItem.gender || '',
      bloodGroup: patientItem.bloodGroup || '',
      phone: patientItem.phone || '',
      address: patientItem.address || '',
    };

    this.showEditPatient = true;

    this.cdr.detectChanges();
  }

  closeEditPatient(): void {
    console.log('Closing Edit Patient modal');

    this.showEditPatient = false;

    this.cdr.detectChanges();
  }

  /* ===================================================== */
  /* UPDATE PATIENT */
  /* ===================================================== */

  updatePatient(): void {
    console.log('Update Patient clicked');

    if (!this.editPatient.patientId) {
      alert('Patient ID is missing. Cannot update patient.');
      return;
    }

    if (!this.editPatient.fullName || !this.editPatient.fullName.trim()) {
      alert('Patient name is required!');
      return;
    }

    const patientData = {
      fullName: this.editPatient.fullName.trim(),
      age: this.editPatient.age === '' ? 0 : Number(this.editPatient.age),
      gender: this.editPatient.gender || '',
      bloodGroup: this.editPatient.bloodGroup || '',
      phone: this.editPatient.phone || '',
      address: this.editPatient.address || '',
    };

    console.log('Updating patient ID:', this.editPatient.patientId);

    console.log('Patient data:', patientData);

    this.http
      .put<any>(`http://localhost:8080/api/patients/${this.editPatient.patientId}`, patientData)
      .subscribe({
        next: (response) => {
          console.log('Patient updated successfully:', response);

          this.showEditPatient = false;

          this.cdr.detectChanges();

          this.loadPatients();

          alert('Patient updated successfully!');
        },

        error: (error) => {
          console.error('Error updating patient:', error);

          if (error.status === 404) {
            alert('Patient not found. The selected patient may have already been deleted.');
          } else if (error.status === 400) {
            alert('Invalid patient information. Please check the entered details.');
          } else {
            alert('Failed to update patient. Please check the backend.');
          }
        },
      });
  }

  /* ===================================================== */
  /* DELETE PATIENT */
  /* ===================================================== */

  deletePatient(patientItem: any): void {
    console.log('Delete clicked:', patientItem);

    const patientName = patientItem.fullName || 'this patient';

    const patientId = patientItem.patientId;

    if (!patientId) {
      alert('Patient ID is missing. Cannot delete patient.');
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete ${patientName}?\n\n` +
        `This patient will be permanently removed.`,
    );

    if (!confirmed) {
      return;
    }

    console.log('Deleting patient ID:', patientId);

    this.http
      .delete(`http://localhost:8080/api/patients/${patientId}`, {
        responseType: 'text',
      })
      .subscribe({
        next: (response) => {
          console.log('Patient deleted:', response);

          this.loadPatients();

          alert(`${patientName} has been deleted successfully!`);
        },

        error: (error) => {
          console.error('Error deleting patient:', error);

          if (error.status === 404) {
            alert('Patient not found. The patient may have already been deleted.');
          } else {
            alert('Failed to delete patient. Please check the backend.');
          }
        },
      });
  }
}
