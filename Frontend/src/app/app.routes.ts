import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { QuienesComponent } from './pages/quienes/quienes.component';

import { NuestraseleccionComponent } from './pages/nuestraseleccion/nuestraseleccion.component';
import { DescripcionComponent } from './pages/nuestraseleccion/descripcion/descripcion.component';

import { ContactoComponent } from './pages/contacto/contacto.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { Pagina404Component } from './pages/pagina404/pagina404.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/dashboard/profile/profile.component';
import { CheckoutComponent } from './pages/dashboard/checkout/checkout.component';
import { HistoryComponent } from './pages/dashboard/history/history.component';
import { DeliveryStatus } from './pages/dashboard/delivery-status/delivery-status.component';
import { ReviewsComponent } from './pages/dashboard/reviews/reviews.component';
import { AuthGuard } from './guard/auth.guard';


export const routes: Routes = [
    { path: 'landing', title: 'Home', component: LandingComponent },
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    { path: 'quienes', title: 'Quienes Somos', component: QuienesComponent },
    { path: 'nuestraseleccion', title: 'Nuestra Selección', component: NuestraseleccionComponent },
    { path: 'descripcion/:id', title: 'Tu próximo libro', component: DescripcionComponent },
    { path: 'contacto', title: 'Contacto', component: ContactoComponent },
    { path: 'inicio', title: 'Login', component: InicioComponent },
    {
        path: 'dashboard', title: 'Mi perfil', component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'profile-dashboard', pathMatch: 'full' },
            { path: 'profile-dashboard', component: ProfileComponent, title: 'Mi perfil' },
            { path: 'checkout', component: CheckoutComponent, title: 'Finalizar compra' },
            { path: 'delivery-status', component: DeliveryStatus, title: 'Estado de mi compra' },
            { path: 'history', component: HistoryComponent, title: 'Mis Compras' },
            { path: 'reviews', component: ReviewsComponent, title: 'Mis reseñas' }
        ]
    },
    { path: '**', component: Pagina404Component }
];
