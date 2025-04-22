/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import 'cypress-xpath';

Cypress.Commands.add("generarCorreoAleatorio", () => {
  const nombres = [
    "juan", "manuel", "carlos", "laura", "maria", "ana", "sofia", "pedro", "diego", "camila",
    "lucas", "elena", "martin", "valentina", "fernando", "santiago", "diana", "jose", "andres", "julia",
    "rafael", "alejandra", "isabel", "victor", "marcos", "antonio", "roberto", "carolina", "daniel", "fatima"
  ];

  const apellidos = [
    "perez", "lopez", "gomez", "diaz", "sanchez", "rodriguez", "fernandez", "martinez", "garcia", "romero",
    "torres", "vargas", "mendoza", "navarro", "ortiz", "silva", "castro", "ramos", "molina", "suarez",
    "salazar", "miranda", "espinoza", "flores", "guerrero", "ibarra", "valdez", "montoya", "rivera", "mejia"
  ];

  const separadores = ["", ".", "_", "-"];

  const dominios = [
    "gmail.com", "outlook.com", "yahoo.com", "hotmail.com", "protonmail.com", "icloud.com", "aol.com",
    "mail.com", "zoho.com", "gmx.com", "tutanota.com", "fastmail.com", "yandex.com", "hushmail.com",
    "live.com", "msn.com", "inbox.com", "startmail.com", "me.com", "pm.me"
  ];

  const nombre = nombres[Math.floor(Math.random() * nombres.length)];
  const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
  const separador = separadores[Math.floor(Math.random() * separadores.length)];
  const numero = Math.floor(Math.random() * 10000); // número aleatorio
  const dominio = dominios[Math.floor(Math.random() * dominios.length)];

  const correo = `${nombre}${separador}${apellido}${numero}@${dominio}`;
  return correo.toLowerCase();
});


Cypress.Commands.add("generarNombreAleatorio", () => {
  const nombres = [
    "Aaron", "Bruno", "Carlos", "Diana", "Elena", "Fabian", "Gabriela", "Hector", "Isabel", "Javier",
    "Karla", "Leonardo", "Marina", "Nicolas", "Olga", "Pablo", "Quetzal", "Rocio", "Samuel", "Tamara",
    "Ulises", "Valeria", "Walter", "Ximena", "Yahir", "Zulema", "Lucia", "Mateo", "Camila", "Thiago"
  ];

  const nombre = nombres[Math.floor(Math.random() * nombres.length)];
  return nombre;
});


Cypress.Commands.add("generarApellidoAleatorio", () => {
  const apellidos = [
    "Viracocha", "Quispe", "Condori", "Mamani", "Huaman", "Ccahuana", "Ticona", "Apaza", "Callañaupa", "Choque",
    "Pacco", "Cusi", "Chura", "Zeballos", "Yupanqui", "Acuña", "Barrientos", "Delgado", "Espinoza", "Figueroa",
    "Galindo", "Herrera", "Inga", "Jara", "López", "Montes", "Ñaupa", "Poma", "Ramos", "Sotomayor"
  ];

  const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
  return apellido;
});
