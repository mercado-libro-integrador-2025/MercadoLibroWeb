import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HeroSliderComponent } from './hero-slider/hero-slider.component';
import { NovedadesComponent } from "./novedades/novedades.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeroSliderComponent, NovedadesComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
