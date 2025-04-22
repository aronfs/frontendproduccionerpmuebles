describe("Eliminar Usuario logicamente", () => {
  beforeEach(() => {
    cy.visit("/");

    // Espera que los inputs existan antes de interactuar
    cy.get('#mat-input-0', { timeout: 10000 }).should("be.visible");
    cy.get('#mat-input-1', { timeout: 10000 }).should("be.visible");

    cy.fixture("usuario").then((data) => {
      cy.xpath('//*[@id="mat-input-0"]').type(data.usuario);
      cy.xpath('//*[@id="mat-input-1"]').type(data.password);  
      cy.get(".mdc-button__label").click();
    });

    // Espera a que se cargue el home
    cy.get(".mat-toolbar > :nth-child(1) > .mat-icon", { timeout: 10000 })
      .should("be.visible")
      .click();

    cy.get(':nth-child(2) > .mdc-list-item__content', { timeout: 10000 }).click();
  });

  it("Eliminar Usuario logicamente", () => {
    // Asegúrate de esperar a que esté visible el ícono de eliminar
    cy.get(':nth-child(2) > .cdk-column-acciones > .mat-warn > .mat-icon', { timeout: 10000 })
      .should("be.visible")
      .click();

    // Espera hasta que el modal swal aparezca
    cy.get('#swal2-title', { timeout: 10000 }).should('contain', '¿Desea desactivar el usuario?');

    cy.get('.swal2-confirm').click();

    // Esperar y luego cambiar de pestaña (por si tarda el cambio)
    cy.get('#mat-button-toggle-1-button > .mat-button-toggle-label-content', { timeout: 10000 }).click();
  });
});
