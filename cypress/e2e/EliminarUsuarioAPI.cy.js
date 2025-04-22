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


    it("Desactiva lógicamente un usuario activo", () => {
        cy.get("@authToken").then((token) => {
          // 1️⃣ Obtener lista de usuarios activos
          cy.request({
            method: "GET",
            url: "https://apibackendsistemaventas6-production.up.railway.app/api/Usuario/Lista",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => {
            const usuarioActivo = res.body.value.find(u => u.esActivo);

            expect(usuarioActivo).to.not.be.undefined;
      
            // 2️⃣ Usar su ID para desactivarlo
            cy.request({
              method: "PUT",
              url: `https://apibackendsistemaventas6-production.up.railway.app/api/Usuario/EliminarLogico/${usuarioActivo.idUsuario}`,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              }
            }).then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body.status).to.be.true;
              expect(response.body.msg).to.eq("Se desactivó el usuario");
            });
          });
        });
    });


    it("Activa un usuario desactivado", () => {
      cy.get("@authToken").then((token) => {
        // 1️⃣ Obtener lista de usuarios NO activos
        cy.request({
          method: "GET",
          url: "https://apibackendsistemaventas6-production.up.railway.app/api/Usuario/ListaNoActivos",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => {
          // 🔍 Buscar un usuario inactivo (¡no activo!)
          const usuarioInactivo = res.body.value.find(u => !u.esActivo);
    
          expect(usuarioInactivo).to.not.be.undefined;
    
          // 2️⃣ Activar ese usuario
          cy.request({
            method: "PUT",
            url: `https://apibackendsistemaventas6-production.up.railway.app/api/Usuario/ActivarUsuario/${usuarioInactivo.idUsuario}`,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.status).to.be.true;
            expect(response.body.msg).to.eq("Se activó el usuario");
          });
        });
      });
    });


      
      
      




   

});