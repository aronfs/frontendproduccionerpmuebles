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


    it("Validación de actualizacion de usuario contraseña", function () {
        cy.get("@authToken").then((token) => {
          cy.request({
            method: "PUT",
            url: "https://apibackendsistemaventas6-production.up.railway.app/api/Usuario/Editar",
            headers: {
              Authorization: `Bearer ${token}`, // Agrega el token en los headers
              "Content-Type": "application/json",
            },
            body: {
                idUsuario: 6,
                nombreCompleto: "Super Jhon",
                correo: "jhon@gmail.com",
                idRol: 2,
                clave: "12345678",
                esActivo: 1,
                foto: "https://i.ibb.co/GfTrtS2s/person1.png"
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





      
    it("Validación de actualizacion de usuario el correo ", function () {
        cy.get("@authToken").then((token) => {
          cy.request({
            method: "PUT",
            url: "https://apibackendsistemaventas6-production.up.railway.app/api/Usuario/Editar",
            headers: {
              Authorization: `Bearer ${token}`, // Agrega el token en los headers
              "Content-Type": "application/json",
            },
            body: {
                idUsuario: 6,
                nombreCompleto: "Super Jhon",
                correo: "supercorreoFalso",
                idRol: 2,
                clave: "Barry.com34",
                esActivo: 1,
                foto: "https://i.ibb.co/GfTrtS2s/person1.png"
            },
          }).then((response) => {
            expect(response.status).to.eq(200); // Verifica el código 200
            expect(response.body.status).to.be.false; // Verifica que la API devuelva un error lógico
            expect(response.body.msg).to.eq(
              "El correo no es válido."
            ); // Verifica el mensaje de error
          });
        });
      }); 


        
    it("Validación de actualizacion de usuario el nombre no es valido no es real  ", function () {
        cy.get("@authToken").then((token) => {
          cy.request({
            method: "PUT",
            url: "https://apibackendsistemaventas6-production.up.railway.app/api/Usuario/Editar",
            headers: {
              Authorization: `Bearer ${token}`, // Agrega el token en los headers
              "Content-Type": "application/json",
            },
            body: {
                idUsuario: 6,
                nombreCompleto: "asdasdsada",
                correo: "jhon@gmail.com",
                idRol: 2,
                clave: "Barry.com34",
                esActivo: 1,
                foto: "https://i.ibb.co/GfTrtS2s/person1.png"
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




      it("Validación de actualizacion de usuario el nombre vacio  ", function () {
        cy.get("@authToken").then((token) => {
          cy.request({
            method: "PUT",
            url: "https://apibackendsistemaventas6-production.up.railway.app/api/Usuario/Editar",
            headers: {
              Authorization: `Bearer ${token}`, // Agrega el token en los headers
              "Content-Type": "application/json",
            },
            body: {
                idUsuario: 6,
                nombreCompleto: "",
                correo: "jhon@gmail.com",
                idRol: 2,
                clave: "Barry.com34",
                esActivo: 1,
                foto: "https://i.ibb.co/GfTrtS2s/person1.png"
            },
          }).then((response) => {
            expect(response.status).to.eq(200); // Verifica el código 200
            expect(response.body.status).to.be.false; // Verifica que la API devuelva un error lógico
            expect(response.body.msg).to.eq(
              "El nombre no puede estar vacío."
            ); // Verifica el mensaje de error
          });
        });
      }); 


      it("Validación de actualizacion de correo existente en la base de datos  ", function () {
        cy.get("@authToken").then((token) => {
          cy.request({
            method: "PUT",
            url: "https://apibackendsistemaventas6-production.up.railway.app/api/Usuario/Editar",
            headers: {
              Authorization: `Bearer ${token}`, // Agrega el token en los headers
              "Content-Type": "application/json",
            },
            body: {
                idUsuario: 6,
                nombreCompleto: "Super Aaron",
                correo: "aron@outlok.com",
                idRol: 2,
                clave: "Barry.com34",
                esActivo: 1,
                foto: "https://i.ibb.co/GfTrtS2s/person1.png"
            },
          }).then((response) => {
            expect(response.status).to.eq(200); // Verifica el código 200
            expect(response.body.status).to.be.false; // Verifica que la API devuelva un error lógico
            expect(response.body.msg).to.eq(
              "El correo ya está registrado por otro usuario existente. Por favor, elige otro."
            ); // Verifica el mensaje de error
          });
        });
      }); 


   

});