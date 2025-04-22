describe('Prueba de inicio de sesión', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.get('#mat-input-0', { timeout: 10000 }).should('be.visible');
    cy.get('#mat-input-1', { timeout: 10000 }).should('be.visible');

    cy.fixture('usuario').then((data) => {
      cy.get('#mat-input-0').type(data.usuario);
      cy.get('#mat-input-1').type(data.password);
      cy.get('.mdc-button__label').should('exist').click();
    });

    // Menú lateral
    cy.get(".mat-toolbar > :nth-child(1) > .mat-icon", { timeout: 10000 }).should("be.visible").click();
    cy.get(':nth-child(2) > .mdc-list-item__content', { timeout: 10000 }).click();

    // Asegurar carga del botón de "Agregar Usuario"
    cy.get('.mdc-button__label').first().should('exist').click();
  });

  it('Ingresar el correo dos veces', () => {
    cy.fixture('FormularioUsuario').then((data) => {
      cy.get('input[type="file"]').selectFile('cypress/fixtures/foto.png', { force: true });
      cy.get('img.perfil-img', { timeout: 10000 }).should('be.visible');

      cy.get('#mat-input-3').type(data.nombre);
      cy.get('#mat-input-4').type(data.apellido);
      cy.get('#mat-input-5').type(data.correo);
      cy.get('.mat-mdc-select-placeholder').click();
      cy.get('#mat-option-3').click();
      cy.get('#mat-input-6').type(data.password);
      cy.get('#mat-input-7').type(data.password, { force: true });

      cy.contains('button', 'Agregar Usuario')
        .should('be.visible')
        .should('not.be.disabled')
        .click({ force: true });

      cy.contains('El correo del usuario ya se encuentra registrado.', { timeout: 10000 }).should('be.visible');
    });
  });

  it('Ingresar solo el nombre, apellido y contraseña', () => {
    cy.fixture('FormularioUsuario').then((data) => {
      cy.get('#mat-input-3').type(data.nombre);
      cy.get('#mat-input-4').type(data.apellido);
      cy.get('#mat-input-6').type(data.password);
      cy.get('#mat-input-7').type(data.password, { force: true });

      cy.contains('button', 'Agregar Usuario')
        .should('be.visible')
        .should('not.be.disabled')
        .click({ force: true });

      cy.contains('Por favor, completa todos los campos correctamente.', { timeout: 10000 }).should('be.visible');
    });
  });

  it('Falta seleccionar el rol', () => {
    cy.fixture('FormularioUsuario').then((data) => {
      cy.get('#mat-input-3').type(data.nombre);
      cy.get('#mat-input-4').type(data.apellido);
      cy.get('#mat-input-5').type(data.correo);
      cy.get('#mat-input-6').type(data.password);
      cy.get('#mat-input-7').type(data.password, { force: true });

      cy.contains('button', 'Agregar Usuario')
        .should('be.visible')
        .should('not.be.disabled')
        .click({ force: true });

      cy.contains('Por favor, completa todos los campos correctamente.', { timeout: 10000 }).should('be.visible');
    });
  });

  it('Faltan nombre y apellido', () => {
    cy.fixture('FormularioUsuario').then((data) => {
      cy.get('#mat-input-5').type(data.correo);
      cy.get('#mat-input-6').type(data.password);
      cy.get('#mat-input-7').type(data.password, { force: true });

      cy.contains('button', 'Agregar Usuario')
        .should('be.visible')
        .should('not.be.disabled')
        .click({ force: true });

      cy.contains('Por favor, completa todos los campos correctamente.', { timeout: 10000 }).should('be.visible');
    });
  });

  it('Formulario completo y correcto', () => {
    const imagenes = ["foto.png", "person1.png", "person2.png", "person3.png"];
    const imagenAleatoria = imagenes[Math.floor(Math.random() * imagenes.length)];
    const password = 'Test1234!';

    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${imagenAleatoria}`, { force: true });
    cy.get('img.perfil-img', { timeout: 10000 }).should('be.visible');

    cy.get('#mat-input-3').as('nombreInput');
    cy.get('#mat-input-4').as('apellidoInput');
    cy.get('#mat-input-5').as('correoInput');
    cy.get('#mat-input-6').as('passwordInput');
    cy.get('#mat-input-7').as('confirmPasswordInput');

    cy.generarNombreAleatorio().then((nombre) => {
      cy.generarApellidoAleatorio().then((apellido) => {
        cy.generarCorreoAleatorio().then((correoAleatorio) => {
          cy.get('@nombreInput').type(nombre);
          cy.get('@apellidoInput').type(apellido);
          cy.get('@correoInput').type(correoAleatorio);
          cy.get('.mat-mdc-select-placeholder').click();
          cy.get('#mat-option-3').click();
          cy.get('@passwordInput').type(password);
          cy.get('@confirmPasswordInput').type(password, { force: true });

          cy.contains('button', 'Agregar Usuario')
            .should('be.visible')
            .should('not.be.disabled')
            .click({ force: true });

          cy.contains('El usuario fue registrado', { timeout: 10000 }).should('be.visible');
        });
      });
    });
  });
});
