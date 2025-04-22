describe("Actualizar Usuario Administrador", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.fixture("usuario").then((data) => {
       // Login
       cy.xpath('//*[@id="mat-input-0"]', { timeout: 10000 }).should('be.visible').type(data.usuario);
       cy.xpath('//*[@id="mat-input-1"]').should('be.visible').type(data.password);
       cy.get(".mdc-button__label").should("be.visible").click();
 
       // Navegar a Usuarios
       cy.get(".mat-toolbar > :nth-child(1) > .mat-icon", { timeout: 15000 }).should("be.visible").click();
       cy.get(':nth-child(2) > .mdc-list-item__content', { timeout: 15000 }).should("be.visible").click();
 
       // Confirmar que tabla ya cargó
       cy.get('.mat-mdc-table', { timeout: 20000 }).should('exist').and('be.visible');
    });
  });



  it("Dejar campo vacío Nombre y Apellido", () => {
    // Abrir el modal del usuario
    cy.get(":nth-child(1) > .cdk-column-acciones > .mat-primary > .mat-icon").click();
  
    // Limpiar los campos de Nombre y Apellido
    cy.get("#mat-input-3").as("nombreInput").clear();
    cy.get("#mat-input-4").as("apellidoInput").clear();
  
    // Verificar que el botón "Guardar Cambios" está habilitado
    cy.contains("button", "Guardar Cambios").should("be.visible").click({ force: true });
  
    // Esperar un poco para que se rendericen los mensajes de error
    cy.wait(500);
  
    // Validar que aparecen los errores correctos
    cy.contains("El nombre es obligatorio", { log: false }).scrollIntoView().should("be.visible");
    cy.contains("El apellido es obligatorio", { log: false }).scrollIntoView().should("be.visible");

  });
  



  it("Dejar campo vacío correo y contraseña", () => {
    // Abrir el modal del usuario
    cy.get(":nth-child(4) > .cdk-column-acciones > .mat-primary > .mat-icon")
      .scrollIntoView()
      .click({ force: true });
  
    // Asegurar que los inputs estén visibles y vaciarlos
    cy.get('input[type="email"]')
      .scrollIntoView()
      .should("be.visible")
      .clear({ force: true })
      .should("have.value", "");
  
    cy.get('input[type="password"]').eq(0)
      .scrollIntoView()
      .should("be.visible")
      .clear({ force: true })
      .should("have.value", "");
  
    cy.get('input[type="password"]').eq(1)
      .scrollIntoView()
      .should("be.visible")
      .clear({ force: true })
      .should("have.value", "");
  
    // Clic en "Guardar Cambios"
    cy.contains("button", "Guardar Cambios")
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
  
    // Esperar y validar errores esperados
    cy.wait(500);
  
    cy.contains("El correo es obligatorio", { log: false })
      .scrollIntoView()
      .should("be.visible");
  
    cy.contains("La contraseña es obligatoria", { log: false })
      .scrollIntoView()
      .should("be.visible");
  
    cy.contains("Debes confirmar la contraseña.", { log: false })
      .scrollIntoView()
      .should("be.visible");
  });
  
  
  
  









})