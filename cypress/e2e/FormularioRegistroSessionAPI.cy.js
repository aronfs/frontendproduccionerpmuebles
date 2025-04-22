describe("API Testing Usuario", () => {
  beforeEach(() => {
    cy.request({
      method: "POST",
      url: "https://apibackendsistemaventas6-production.up.railway.app/api/Auth/login", // Ruta de autenticación
      body: {
        username: "aron@outlook.com",
        password: "123456",
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.wrap(response.body.token).as("authToken"); // Guarda el token como alias
    });
  });

  it("Validación de correo", function () {
    cy.get("@authToken").then((token) => {
      cy.request({
        method: "POST",
        url: "https://apibackendsistemaventas6-production.up.railway.app/api/Usuario/Guardar",
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token en los headers
          "Content-Type": "application/json",
        },
        body: {
          nombreCompleto: "Juan Pérez",
          correo: "aron@outlook.com",
          idRol: 2,
          clave: "Barry.com34",
          esActivo: 1,
          foto: "https://ibb.co/Hm1Xg7R",
        },
      }).then((response) => {
        expect(response.status).to.eq(200); // Verifica el código 200
        expect(response.body.status).to.be.false; // Verifica que la API devuelva un error lógico
        expect(response.body.msg).to.eq(
          "El correo ya está en uso. Por favor, elige otro."
        ); // Verifica el mensaje de error
      });
    });
  }); 


  it("Validación de nombre con caracteres raros o confusos", function () {
    cy.get("@authToken").then((token) => {
      cy.request({
        method: "POST",
        url: "https://apibackendsistemaventas6-production.up.railway.app/api/Usuario/Guardar",
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token en los headers
          "Content-Type": "application/json",
        },
        body: {
          nombreCompleto: "ASIDIASNDIN",
          correo: "aron@hootmail.com",
          idRol: 2,
          clave: "Barry.com34",
          esActivo: 1,
          foto: "https://ibb.co/Hm1Xg7R",
        },
      }).then((response) => {  
        expect(response.status).to.eq(200); // Verifica el código 200
        expect(response.body.status).to.be.false; // Verifica que la API devuelva un error lógico
        expect(response.body.msg).to.eq(
          "El nombre no parece válido. Usa un nombre real y bien escrito."
        ); // Verifica el mensaje de error
      });
    });
  });

  it("Validación de contraseña  con menos de 8 caracteres", function () {
    cy.get("@authToken").then((token) => {
      cy.request({
        method: "POST",
        url: "https://apibackendsistemaventas6-production.up.railway.app/api/Usuario/Guardar",
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token en los headers
          "Content-Type": "application/json",
        },
        body: {
          nombreCompleto: "Super Aaron",
          correo: "aron@hootmail.com",
          idRol: 2,
          clave: "123456",
          esActivo: 1,
          foto: "https://ibb.co/Hm1Xg7R",
        },
      }).then((response) => {
        expect(response.status).to.eq(200); // Verifica el código 200
        expect(response.body.status).to.be.false; // Verifica que la API devuelva un error lógico
        expect(response.body.msg).to.eq(
          "La contraseña no cumple con los requisitos de seguridad."
        ); // Verifica el mensaje de error
      });
    });
  });


  it("Validación de a foto obligatoria", function () {
    cy.get("@authToken").then((token) => {
      cy.request({
        method: "POST",
        url: "https://apibackendsistemaventas6-production.up.railway.app/api/Usuario/Guardar",
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token en los headers
          "Content-Type": "application/json",
        },
        body: {
          nombreCompleto: "Super Aaron",
          correo: "aron@hoootmail.com",
          idRol: 2,
          clave: "Barry.com34",
          esActivo: 1,
          foto: null,
        },
      }).then((response) => {
        expect(response.status).to.eq(200); // Verifica el código 200
        expect(response.body.status).to.be.false; // Verifica que la API devuelva un error lógico
        expect(response.body.msg).to.eq(
          "La foto es obligatoria."
        ); // Verifica el mensaje de error
      });
    });
  });




});
