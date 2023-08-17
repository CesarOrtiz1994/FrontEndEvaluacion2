import React, {  } from "react";

import Content from "../components/Content";

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Home = () => {
  return (
    <div>
      <Hero />
      <IntroSection />
      <ServicesSection />
      <Content />
    </div>
  );
};

const Hero = () => {
  return (
    <section className="hero">
      <h1>Bienvenido a Medifast</h1>
        <p>Tu salud es nuestra prioridad</p>
    </section>
  );
};

const IntroSection = () => {
  return (
    <section className="intro">
      <h2>Acerca de Medifast</h2>
        <p>
          Medifast es una empresa líder en atención médica dedicada a brindar los mejores servicios
          médicos y promover un estilo de vida saludable para nuestros pacientes.
        </p>
        <img src="https://files.fm/thumb_show.php?i=jgcyp9694" alt="Medifast Hero" className="imagen-hero"  />
    </section>
  );
};


const ServicesSection = () => {
  return (
    <section>
      <h2>Nuestros Servicios</h2>
      <Carousel>
        <div>
        <img src="https://files.fm/thumb_show.php?i=bn7vw9z3u" alt="Medifast Hero" className="imagen-hero"  />
        </div>
        <div>   
        <img src="https://files.fm/thumb_show.php?i=qcce4yj78" alt="Medifast Hero" className="imagen-hero"  />
        </div>
        <div>
        <img src="https://files.fm/thumb_show.php?i=tk9nadhc5" alt="Medifast Hero" className="imagen-hero"  />
        </div>
        <div>
        <img src="https://files.fm/thumb_show.php?i=qsxzdtpg9" alt="Medifast Hero" className="imagen-hero"  />
        </div>
        <div>
        <img src="https://files.fm/thumb_show.php?i=6veuyft8y" alt="Medifast Hero" className="imagen-hero"  />
        </div>

        {/* Agrega más elementos div para cada slide del carrusel */}
      </Carousel>
    </section>
  );
};





export default Home;