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
    private apiUrl = 'https://raleigh-nicholas-moment-secretariat.trycloudflare.com/api/doctors';

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

    loadDoctors(): void {
        this.http.get<any[]>(this.apiUrl).subscribe({
            next: (response) => {
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

    applyFilters(): void {
        const search = this.searchText.trim().toLowerCase();

        this.filteredDoctors = this.doctors.filter((doctorItem) => {
            const fullName = String(doctorItem.fullName || '').toLowerCase();
            const email = String(doctorItem.email || '').toLowerCase();
            const phone = String(doctorItem.phone || '').toLowerCase();
            const specialization = String(doctorItem.specialization || '').toLowerCase();
            const department = String(doctorItem.department || '').toLowerCase();

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

    getDoctorInitials(name: string): string {
        if (!name) {
            return 'DR';
        }

        const parts = name.trim().split(/\s+/);

        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    }

    openAddDoctor(): void {
        this.showAddDoctor = true;
        this.cdr.detectChanges();
    }

    closeAddDoctor(): void {
        this.showAddDoctor = false;
        this.cdr.detectChanges();
    }

    viewDoctor(doctorItem: any): void {
        this.selectedDoctor = { ...doctorItem };
        this.showViewDoctor = true;
        this.cdr.detectChanges();
    }

    closeViewDoctor(): void {
        this.showViewDoctor = false;
        this.selectedDoctor = null;
        this.cdr.detectChanges();
    }

    openEditDoctor(doctorItem: any): void {
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
        this.showEditDoctor = false;
        this.cdr.detectChanges();
    }

    updateDoctor(): void {
        if (!this.editDoctor.doctorId) {
            alert('Doctor ID is missing. Cannot update doctor.');
            return;
        }

        if (!this.editDoctor.fullName || !this.editDoctor.fullName.trim()) {
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
            fee: this.editDoctor.fee === '' ? 0 : Number(this.editDoctor.fee),
        };

        this.http
            .put<any>(`${this.apiUrl}/${this.editDoctor.doctorId}`, doctorData)
            .subscribe({
                next: () => {
                    this.showEditDoctor = false;
                    this.loadDoctors();
                    this.openSuccessPopup(
                        'Doctor Updated',
                        'Doctor information has been updated successfully.',
                    );
                },
                error: (error) => {
                    console.error('Error updating doctor:', error);

                    if (error.status === 404) {
                        alert('Doctor not found. The selected doctor may have already been deleted.');
                    } else if (error.status === 400) {
                        alert('Invalid doctor information. Please check the entered details.');
                    } else {
                        alert('Failed to update doctor. Please check the backend.');
                    }
                },
            });
    }

    addDoctor(): void {
        if (!this.doctor.name || !this.doctor.name.trim()) {
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
            fee: this.doctor.fee === '' ? 0 : Number(this.doctor.fee),
        };

        this.http.post<any>(this.apiUrl, doctorData).subscribe({
            next: (response) => {
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

                this.loadDoctors();

                this.openSuccessPopup(
                    'Doctor Added Successfully',
                    'The doctor has been registered successfully.',
                    response?.username || '',
                    response?.temporaryPassword || '',
                );
            },
            error: (error) => {
                console.error('Error adding doctor:', error);
                alert('Failed to add doctor. Please check the backend.');
            },
        });
    }

    deleteDoctor(doctorItem: any): void {
        const doctorName = doctorItem.fullName || 'this doctor';
        const doctorId = doctorItem.doctorId;

        if (!doctorId) {
            alert('Doctor ID is missing. Cannot delete doctor.');
            return;
        }

        const confirmed = confirm(
            `Are you sure you want to delete ${doctorName}?\n\nThis will permanently remove the doctor and their login account.`,
        );

        if (!confirmed) {
            return;
        }

        this.http
            .delete(`${this.apiUrl}/${doctorId}`, { responseType: 'text' })
            .subscribe({
                next: () => {
                    this.loadDoctors();
                    this.openSuccessPopup(
                        'Doctor Deleted',
                        `${doctorName} has been removed successfully.`,
                    );
                },
                error: (error) => {
                    console.error('Error deleting doctor:', error);

                    if (error.status === 404) {
                        alert('Doctor not found. The doctor may have already been deleted.');
                    } else {
                        alert('Failed to delete doctor. Please check the backend.');
                    }
                },
            });
    }

    openSuccessPopup(
        title: string,
        message: string,
        username: string = '',
        password: string = '',
    ): void {
        this.successTitle = title;
        this.successMessage = message;
        this.successUsername = username;
        this.successPassword = password;
        this.showSuccessPopup = true;
        this.cdr.detectChanges();
    }

    closeSuccessPopup(): void {
        this.showSuccessPopup = false;
        this.successTitle = '';
        this.successMessage = '';
        this.successUsername = '';
        this.successPassword = '';
        this.cdr.detectChanges();
    }
}
