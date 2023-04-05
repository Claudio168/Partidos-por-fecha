function consulta(){
      // Si ya existe una tabla creada, destruirla
      if ($.fn.DataTable.isDataTable('#tablaResul')) {
        $('#tablaResul').DataTable().clear().destroy();
      }
    const loader = document.querySelector(".loader");
    loader.style.display = "block";
    
    let fecha = document.getElementById("datepicker").value
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    fetch(
      `https://v3.football.api-sports.io/fixtures?date=${fecha}&timezone=${timeZone}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": "22240ee711b7e2faa6b80fa55809e7db",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.response);
       
        //Id partido: ${element.fixture.id}
        data.response.forEach((element) => {
          //Acortar la fecha
          const fecha = new Date(element.fixture.date);
          const fechaCorta = fecha.toLocaleDateString("es-CL"); // Cambia 'es-AR' por el código de idioma y país que necesites
          // Salida: "26/3/2023"
          //convertir el codigo en una hora legible
          const unixTime = element.fixture.timestamp; // fecha en formato Unix Time
          const fechaHora = new Date(unixTime * 1000); // se multiplica por 1000 para convertir de segundos a milisegundos
          const hora = fechaHora.toLocaleTimeString(); // se obtiene la hora en formato de cadena
          // Salida: "6:00:00 AM" (o la hora correspondiente según tu zona horaria)
          const partidos = document.getElementById("Partidos");
          const tr = document.createElement("tr");
          tr.innerHTML = `
                   <td>${element.league.country}</td>
                   <td>${element.league.name}</td>
                   <td>${element.league.round}</td>
                   <td>${element.league.season}</td>
                   <td class="alider">
                      ${element.teams.home.name}
                      <img src="${
                        element.teams.home.logo
                      }" alt="Imagen del equipo local" class="centrada" />
                  </td>
                  <td class="alizq">
                      <img src="${
                        element.teams.away.logo
                      }" alt="Imagen del equipo visitante" class="centrada" />
                      ${element.teams.away.name} 
                  </td>
                   <td>${
                     element.score.halftime.home !== null
                       ? element.score.halftime.home
                       : "-"
                   } : ${
            element.score.halftime.away !== null
              ? element.score.halftime.away
              : "-"
          }</td>
                   <td>${
                     element.score.fulltime.home !== null
                       ? element.score.fulltime.home
                       : "-"
                   } : ${
            element.score.fulltime.away !== null
              ? element.score.fulltime.away
              : "-"
          }</td>
                   <td>${fechaCorta}</td>
                   <td>${hora}</td>
                   <td><a href="pronosticos.html?fixture=${element.fixture.id}">Ver</a></td>
                 
                `;
          partidos.appendChild(tr);
        });
        
          // La tabla no ha sido inicializada, se puede inicializar con la función DataTable()
          
      
          $(document).ready(function () {
           
            $("#tablaResul").DataTable({
              stateSave: true,
              responsive: true,
              language: {
                url: "//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json",
              },
              "bInfo": false
            });
          });
          
        loader.style.display = "none";
      })
      .catch((err) => {
        console.log(err);
      });

    
  }