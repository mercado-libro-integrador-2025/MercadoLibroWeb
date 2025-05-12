import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { QuienesComponent } from './pages/quienes/quienes.component';

import { NuestraseleccionComponent } from './pages/nuestraseleccion/nuestraseleccion.component';
import { DescripcionComponent } from './pages/nuestraseleccion/descripcion/descripcion.component';

import { ContactoComponent } from './pages/contacto/contacto.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { Pagina404Component } from './pages/pagina404/pagina404.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DatospersonalesComponent } from './pages/dashboard/datospersonales/datospersonales.component';
import { HistorialComprasComponent } from './pages/dashboard/historial-compras/historial-compras.component';
import { DashboardlandingComponent } from './pages/dashboard/dashboardlanding/dashboardlanding.component';
import { StatusComponent } from './pages/dashboard/status/status.component';
import { PromocionesComponent } from './pages/dashboard/promociones/promociones.component';
import { ReviewsComponent } from './pages/dashboard/reviews/reviews.component';
import { ResumenCompraComponent } from './pages/dashboard/finalizar-compra/finalizar-compra.component';
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
        path: 'dashboard', title: 'Mi perfil', component: DashboardComponent, canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboardlanding', pathMatch: 'full' },
            { path: 'dashboardlanding', component: DashboardlandingComponent },
            { path: 'editarDatosPersonales', component: DatospersonalesComponent, title: 'Editar datos personales' },
            { path: 'historialcompras', component: HistorialComprasComponent, title: 'Mis Compras' },
            { path: 'statusC', component: StatusComponent, title: 'Estado de mi compra' },
            { path: 'calificacion', component: ReviewsComponent, title: 'Mis reseñas' },
            { path: 'promociones', component: PromocionesComponent, title: 'Descuentos y cupones' },
            { path: 'resumenCompra', component: ResumenCompraComponent, title: 'Finalizar compra' },
        ]
    },
    { path: '**', component: Pagina404Component }
];
