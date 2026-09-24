import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrl: './doctors.css',
  templateUrl: './doctors.html',
})
export class Doctors implements OnInit {

  showAddDoctor = false;
  showViewDoctor = false;
  showEditDoctor = false;

  showSuccessPopup = false;

  successTitle = '';
  successMessage = '';
  successUsername = '';
  successPassword = '';

  doctors: any[] = [];
  filteredDoctors: any[] = [];

  selectedDoctor: any = null;

  searchText = '';
  selectedDepartment = '';

  doctor = {
    name: '',
    email: '',
    phone: '',
    specialization: '',
    department: '',
    experience: '',
    gender: '',
    fee: '',
  };

  editDoctor: any = {
    doctorId: null,
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    department: '',
    experienceYears: '',
    gender: '',
    fee: '',
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }


  /* ===================================================== */
  /* LOAD DOCTORS */
  /* ===================================================== */

  loadDoctors(): void {
    console.log('Loading doctors...');

    this.http.get<any[]>('http://localhost:8080/api/doctors').subscribe({
      next: (response) => {
        console.log('Doctors loaded:', response);

        this.doctors = response || [];

        this.applyFilters();

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error loading doctors:', error);

        this.doctors = [];
        this.filteredDoctors = [];

        this.cdr.detectChanges();

        alert('Failed to load doctors from server.');
      },
    });
  }


  /* ===================================================== */
  /* FILTERS */
  /* ===================================================== */

  applyFilters(): void {
    const search = this.searchText.trim().toLowerCase();

    this.filteredDoctors = this.doctors.filter((doctorItem) => {

      const fullName = String(
        doctorItem.fullName || ''
      ).toLowerCase();

      const email = String(
        doctorItem.email || ''
      ).toLowerCase();

      const phone = String(
        doctorItem.phone || ''
      ).toLowerCase();

      const specialization = String(
        doctorItem.specialization || ''
      ).toLowerCase();

      const department = String(
        doctorItem.department || ''
      ).toLowerCase();

      const matchesSearch =
        !search ||
        fullName.includes(search) ||
        email.includes(search) ||
        phone.includes(search) ||
        specialization.includes(search) ||
        department.includes(search);

      const matchesDepartment =
        !this.selectedDepartment ||
        doctorItem.department === this.selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }


  /* ===================================================== */
  /* DOCTOR INITIALS */
  /* ===================================================== */

  getDoctorInitials(name: string): string {

    if (!name) {
      return 'DR';
    }

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }


  /* ===================================================== */
  /* ADD DOCTOR MODAL */
  /* ===================================================== */

  openAddDoctor(): void {
    console.log('Opening Add Doctor modal');

    this.showAddDoctor = true;

    this.cdr.detectChanges();
  }


  closeAddDoctor(): void {
    console.log('Closing Add Doctor modal');

    this.showAddDoctor = false;

    this.cdr.detectChanges();
  }


  /* ===================================================== */
  /* VIEW DOCTOR */
  /* ===================================================== */

  viewDoctor(doctorItem: any): void {
    console.log('Opening View Doctor:', doctorItem);

    this.selectedDoctor = {
      ...doctorItem,
    };

    this.showViewDoctor = true;

    this.cdr.detectChanges();
  }


  closeViewDoctor(): void {
    console.log('Closing View Doctor');

    this.showViewDoctor = false;
    this.selectedDoctor = null;

    this.cdr.detectChanges();
  }


  /* ===================================================== */
  /* EDIT DOCTOR */
  /* ===================================================== */

  openEditDoctor(doctorItem: any): void {
    console.log('Opening Edit Doctor:', doctorItem);

    this.editDoctor = {
      doctorId: doctorItem.doctorId,
      fullName: doctorItem.fullName || '',
      email: doctorItem.email || '',
      phone: doctorItem.phone || '',
      specialization: doctorItem.specialization || '',
      department: doctorItem.department || '',
      experienceYears: doctorItem.experienceYears ?? '',
      gender: doctorItem.gender || '',
      fee: doctorItem.fee ?? '',
    };

    this.showEditDoctor = true;

    this.cdr.detectChanges();
  }


  closeEditDoctor(): void {
    console.log('Closing Edit Doctor');

    this.showEditDoctor = false;

    this.cdr.detectChanges();
  }


  /* ===================================================== */
  /* UPDATE DOCTOR */
  /* ===================================================== */

  updateDoctor(): void {

    console.log('Save Changes clicked');

    if (!this.editDoctor.doctorId) {
      alert('Doctor ID is missing. Cannot update doctor.');
      return;
    }

    if (
      !this.editDoctor.fullName ||
      !this.editDoctor.fullName.trim()
    ) {
      alert('Doctor name is required!');
      return;
    }

    const doctorData = {
      fullName: this.editDoctor.fullName.trim(),
      email: this.editDoctor.email || '',
      phone: this.editDoctor.phone || '',
      specialization: this.editDoctor.specialization || '',
      department: this.editDoctor.department || '',
      experienceYears:
        this.editDoctor.experienceYears === ''
          ? 0
          : Number(this.editDoctor.experienceYears),
      gender: this.editDoctor.gender || '',
      fee:
        this.editDoctor.fee === ''
          ? 0
          : Number(this.editDoctor.fee),
    };

    console.log(
      'Updating doctor:',
      this.editDoctor.doctorId
    );

    console.log(
      'Doctor data:',
      doctorData
    );

    this.http
      .put<any>(
        `http://localhost:8080/api/doctors/${this.editDoctor.doctorId}`,
        doctorData,
      )
      .subscribe({

        next: (response) => {
          console.log(
            'Doctor updated successfully:',
            response
          );

          this.showEditDoctor = false;

          this.cdr.detectChanges();

          this.loadDoctors();

          this.openSuccessPopup(
            'Doctor Updated',
            'Doctor information has been updated successfully.',
          );
        },

        error: (error) => {
          console.error(
            'Error updating doctor:',
            error
          );

          if (error.status === 404) {

            alert(
              'Doctor not found. The selected doctor may have already been deleted.'
            );

          } else if (error.status === 400) {

            alert(
              'Invalid doctor information. Please check the entered details.'
            );

          } else {

            alert(
              'Failed to update doctor. Please check the backend.'
            );
          }
        },
      });
  }


  /* ===================================================== */
  /* ADD DOCTOR */
  /* ===================================================== */

  addDoctor(): void {

    console.log('Add Doctor clicked');

    if (
      !this.doctor.name ||
      !this.doctor.name.trim()
    ) {
      alert('Doctor name is required!');
      return;
    }

    const doctorData = {
      fullName: this.doctor.name.trim(),
      email: this.doctor.email || '',
      phone: this.doctor.phone || '',
      specialization: this.doctor.specialization || '',
      department: this.doctor.department || '',
      gender: this.doctor.gender || '',
      experienceYears:
        this.doctor.experience === ''
          ? 0
          : Number(this.doctor.experience),
      fee:
        this.doctor.fee === ''
          ? 0
          : Number(this.doctor.fee),
    };

    console.log(
      'Sending doctor data:',
      doctorData
    );

    this.http
      .post<any>(
        'http://localhost:8080/api/doctors',
        doctorData,
      )
      .subscribe({

        next: (response) => {
          console.log(
            'Doctor added:',
            response
          );

          this.showAddDoctor = false;

          this.doctor = {
            name: '',
            email: '',
            phone: '',
            specialization: '',
            department: '',
            experience: '',
            gender: '',
            fee: '',
          };

          this.cdr.detectChanges();

          this.loadDoctors();

          this.openSuccessPopup(
            'Doctor Added Successfully',
            'The doctor has been registered successfully.',
            response?.username || '',
            response?.temporaryPassword || '',
          );
        },

        error: (error) => {
          console.error(
            'Error adding doctor:',
            error
          );

          alert(
            'Failed to add doctor. Please check the backend.'
          );
        },
      });
  }


  /* ===================================================== */
  /* DELETE DOCTOR */
  /* ===================================================== */

  deleteDoctor(doctorItem: any): void {

    console.log(
      'Delete clicked:',
      doctorItem
    );

    const doctorName =
      doctorItem.fullName || 'this doctor';

    const doctorId =
      doctorItem.doctorId;

    if (!doctorId) {
      alert(
        'Doctor ID is missing. Cannot delete doctor.'
      );
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete ${doctorName}?\n\n` +
      `This will permanently remove the doctor and their login account.`,
    );

    if (!confirmed) {
      return;
    }

    console.log(
      'Deleting doctor ID:',
      doctorId
    );

    this.http
      .delete(
        `http://localhost:8080/api/doctors/${doctorId}`,
        {
          responseType: 'text',
        },
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Doctor deleted:',
            response
          );

          this.loadDoctors();

          this.openSuccessPopup(
            'Doctor Deleted',
            `${doctorName} has been removed successfully.`,
          );
        },

        error: (error) => {

          console.error(
            'Error deleting doctor:',
            error
          );

          if (error.status === 404) {

            alert(
              'Doctor not found. The doctor may have already been deleted.'
            );

          } else {

            alert(
              'Failed to delete doctor. Please check the backend.'
            );
          }
        },
      });
  }


  /* ===================================================== */
  /* SUCCESS POPUP */
  /* ===================================================== */

  openSuccessPopup(
    title: string,
    message: string,
    username: string = '',
    password: string = '',
  ): void {

    console.log(
      'Opening success popup:',
      title
    );

    this.successTitle = title;
    this.successMessage = message;
    this.successUsername = username;
    this.successPassword = password;

    this.showSuccessPopup = true;

    this.cdr.detectChanges();
  }


  closeSuccessPopup(): void {

    console.log(
      'Closing success popup'
    );

    this.showSuccessPopup = false;

    this.successTitle = '';
    this.successMessage = '';
    this.successUsername = '';
    this.successPassword = '';

    this.cdr.detectChanges();
  }
}
