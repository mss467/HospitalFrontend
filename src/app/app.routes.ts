import { Routes } from '@angular/router';

import { LoginComponent } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Home } from './home/home';
import { Doctors } from './doctors/doctors';
import { Patients } from './patients/patients';
import { Appointments } from './appointments/appointments';
import { Pharmacy } from './pharmacy/pharmacy';
import { DoctorDashboard } from './doctor-dashboard/doctor-dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        component: Home,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'dashboard',
        component: Dashboard,
    },
    {
        path: 'doctor-dashboard',
        component: DoctorDashboard,
        canActivate: [authGuard],
    },
    {
        path: 'doctors',
        component: Doctors,
    },
    {
        path: 'patients',
        component: Patients,
    },
    {
        path: 'appointments',
        component: Appointments,
    },
    {
        path: 'pharmacy',
        component: Pharmacy,
    },
    {
        path: '**',
        redirectTo: '',
    },
];
