// Si ya existe una tabla creada, destruirla
if ($.fn.DataTable.isDataTable("#tablaResul")) {
  $("#tablaResul").DataTable().clear().destroy();
}
const loader = document.querySelector(".loader");
loader.style.display = "block";

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0"); // El mes empieza desde 0, por lo que se le suma 1
const day = String(today.getDate()).padStart(2, "0");

let fecha = `${year}-${month}-${day}`;

datepicker.addEventListener("change", function () {
  fecha = document.getElementById("datepicker").value;
});

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function fetchData() {
  return fetch(`https://v3.football.api-sports.io/fixtures?date=${fecha}&timezone=${timeZone}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": "22240ee711b7e2faa6b80fa55809e7db",
      }
    }
  )
  .then((response) => response.json())
  .then((data) => {
    console.log("Datos de la API:", data);
    return data.response;
  });
}

function getData() {
  return new Promise((resolve, reject) => {
    const data = localStorage.getItem('todosPartidos'+fecha);
    if (data) {
      console.log("Datos del localStorage:", data);
      resolve(JSON.parse(data));
    } else {
      fetchData()
        .then((data) => {
          localStorage.setItem('todosPartidos'+fecha, JSON.stringify(data));
          resolve(data);
        })
        .catch((err) => reject(err));
    }
  });
}

function mostrarDatos() {
  // Si ya existe una tabla creada, destruirla
  if ($.fn.DataTable.isDataTable("#tablaResul")) {
    $("#tablaResul").DataTable().clear().destroy();
  }
  
  getData()
    .then((data) => {
      const partidos = document.getElementById('Partidos');
      partidos.innerHTML = '';
      data.forEach((element) => {
        const fecha = new Date(element.fixture.date);
        const fechaCorta = fecha.toLocaleDateString('es-CL');
        const unixTime = element.fixture.timestamp;
        const fechaHora = new Date(unixTime * 1000);
        const hora = fechaHora.toLocaleTimeString();
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${fechaCorta}</td>
          <td>${hora}</td>
          <td>${element.league.country}</td>
          <td>${element.league.name}</td>
          <td>${element.league.round}</td>
          <td>${element.league.season}</td>
          <td>
            <img src="${element.teams.home.logo}" alt="Imagen del equipo local" class="centrada" />
            ${element.teams.home.name}
          </td>
          <td>
            <img src="${element.teams.away.logo}" alt="Imagen del equipo visitante" class="centrada" />
            ${element.teams.away.name} 
          </td>
          <td>${element.score.halftime.home !== null ? element.score.halftime.home : '-'} : ${element.score.halftime.away !== null ? element.score.halftime.away : '-'}</td>
          <td>${element.score.fulltime.home !== null ? element.score.fulltime.home : '-'} : ${element.score.fulltime.away !== null ? element.score.fulltime.away : '-'}</td>
          <td><a href="pronosticos.html?fixture=${element.fixture.id}">Ver</a></td>
          <td><a href="odds.html?fixture=${element.fixture.id}&home=${element.teams.home.name}&away=${element.teams.away.name}">Cuota</a></td>
        `;
        partidos.appendChild(tr);
      });

      $(document).ready(function () {
        $('#tablaResul').DataTable({
          responsive: true,
          language: {
            url: '//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json',
          },
          bInfo: false,
        });
      });

      loader.style.display = "none";
    })
    .catch((err) => {
      console.log(err);
     
    });
}

mostrarDatos();
