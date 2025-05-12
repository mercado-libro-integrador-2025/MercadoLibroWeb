import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  private promociones: any[] = [
    {
      id: 1,
      title: 'Tarjeta Naranja',
      image: 'https://i.ibb.co/gtJmcWH/322383912-1320194095430905-2178580068362427696-n.jpg',
      description: 'Disfruta de pagar con 3, 5 o 6 cuotas sin interés con Tarjeta Naranja. Promoción válida hasta el 30/06/2024 inclusive.',
      discountCode: 'TNARANJA2024'
    },
    {
      id: 2,
      title: 'Club La Nación',
      image: 'https://i.ibb.co/jHq2n5p/club-nacion.jpg',
      description: '20% descuento exclusivo para miembros de Club La Nación, en compras mayores a 20.000 pesos. Promoción válida hasta el 31/12/2024 inclusive.',
      discountCode: 'CLUBNACION2024'
    },
    {
      id: 3,
      title: 'Club La Voz',
      image: 'https://i.ibb.co/rwttz98/clublavoz.jpg',
      description: '15% descuento exclusivo para miembros de Club La Voz, en compras mayores a 20.000 pesos. Promoción válida hasta el 31/12/2024 inclusive.',
      discountCode: 'CLUBVOZ2024'
    },
    {
      id: 4,
      title: 'Envío gratis',
      image: 'https://i.ibb.co/Qf36wYN/logo.png',
      description: 'Envío gratis a domicilio o puntos de entrega en cualquier ciudad dentro del territorio nacional que se encuentre dentro de la red de entrega de Correo Argentino. Solo aplicable en compras con un valor igual o superior a 40.000 pesos. Promoción válida hasta el 31/12/2024 inclusive.',
      discountCode: 'ENVIOGRATIS2024'
    },
    {
      id: 5,
      title: 'Mes de las novelas',
      image: 'https://i.ibb.co/Qf36wYN/logo.png',
      description: '15% de descuento en todas las novelas. Promoción válida hasta el 30/06/2024 inclusive.',
      discountCode: 'NOVELAS2024'
    },
    {
      id: 6,
      title: 'Libro de la semana',
      image: 'https://i.ibb.co/26LXwqC/Portada-del-libro-Las-mil-y-una-noches.jpg',
      description: 'Aprovecha todas las semanas de comprar un libro de nuestra selección con un increíble descuento. No dejes pasar esta oportunidad de llevarte a tu casa clásicos de la literatura, best sellers y mucho más. Promoción válida hasta el 09/06/2024 inclusive.',
      discountCode: 'LIBROSEMANA2024'
    }
  ];

  constructor() { }

  getPromociones(): any[] {
    return this.promociones;
  }
}
