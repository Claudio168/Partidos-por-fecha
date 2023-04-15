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

function functionAll() {
  url = `https://v3.football.api-sports.io/fixtures?date=${fecha}&timezone=${timeZone}`;

  function getData() {
    return new Promise((resolve, reject) => {
      const storedData = localStorage.getItem("allMatch");

      if (storedData) {
        const parsed_json = JSON.parse(storedData);

        if (fecha === parsed_json.fecha) {
          const parsedData = JSON.parse(storedData);
          console.log("Datos desde localstorage");
          resolve(parsed_json.data);
        } else {
          fetchData()
            .then((data) => {
              const newData = { fecha: fecha, data };
              localStorage.setItem("allMatch", JSON.stringify(newData));
              resolve(data);
            })
            .catch((err) => reject(err));
        }
      } else {
        fetchData()
          .then((data) => {
            const newData = { fecha: fecha, data };
            localStorage.setItem("allMatch", JSON.stringify(newData));
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
    const loader = document.querySelector(".loader");
    loader.style.display = "block";
    getData()
      .then((data) => {
        const partidos = document.getElementById("Partidos");
        partidos.innerHTML = "";
        data.forEach((element) => {
          const fecha = new Date(element.fixture.date);
          const fechaCorta = fecha.toLocaleDateString("es-CL");
          const unixTime = element.fixture.timestamp;
          const fechaHora = new Date(unixTime * 1000);
          const hora = fechaHora.toLocaleTimeString();
          const tr = document.createElement("tr");
          tr.innerHTML = `
          <td>${element.league.country}</td>
          <td>${element.league.name}</td>
          <td>${element.league.round}</td>
          <td>${hora}</td>
          <td>${fechaCorta}</td>
          <td>${element.league.season}</td>
          <td class="text-nowrap">
            <img src="${
              element.teams.home.logo
            }" alt="Imagen del equipo local" class="ml-0 align-middle max-width-1rem"/>
            ${element.teams.home.name}
          </td>
          <td class="text-nowrap">
            <img src="${
              element.teams.away.logo
            }" alt="Imagen del equipo visitante" class="ml-0 align-middle max-width-1rem"/>
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
          <td><a href="pronosticos.html?fixture=${
            element.fixture.id
          }">Ver</a></td>
          <td><a href="odds.html?fixture=${element.fixture.id}&home=${
            element.teams.home.name
          }&away=${element.teams.away.name}">Cuota</a></td>
        `;
          partidos.appendChild(tr);
        });

        $(document).ready(function () {
          $("#tablaResul").DataTable({
            responsive: {
              details: {
                  display: $.fn.dataTable.Responsive.display.modal({
                    header: function(row) {
                      var data = row.data();
                      return data[0] + ' ' + data[1];
                    }
                  }),
                  renderer: $.fn.dataTable.Responsive.renderer.tableAll()
              }
          },
            language: {
              url: "//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json",
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
}

function functionLive() {
  url = `https://v3.football.api-sports.io/fixtures?live=all&timezone=${timeZone}`;
  function getData() {
    return new Promise((resolve, reject) => {
      const storedData = localStorage.getItem("LiveMatch");

      if (storedData) {
        const parsed_json = JSON.parse(storedData);
        const tiempo_actual = Date.now();
        if (tiempo_actual - parsed_json.fecha <= 60000) {
          console.log("Datos desde Localstorage");
          resolve(parsed_json.data);
        } else {
          fetchData()
            .then((data) => {
              const tiempo_inicio = Date.now();
              const newData = { fecha: tiempo_inicio, data };
              localStorage.setItem("LiveMatch", JSON.stringify(newData));
              resolve(data);
            })
            .catch((err) => reject(err));
        }
      } else {
        fetchData()
          .then((data) => {
            const tiempo_inicio = Date.now();
            const newData = { fecha: tiempo_inicio, data };
            localStorage.setItem("LiveMatch", JSON.stringify(newData));
            resolve(data.response);
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
    const loader = document.querySelector(".loader");
    loader.style.display = "block";
    getData()
    .then((data) => {
      const partidos = document.getElementById("Partidos");
      partidos.innerHTML = "";
      data.forEach((element) => {
        const fecha = new Date(element.fixture.date);
        const fechaCorta = fecha.toLocaleDateString("es-CL");
        const unixTime = element.fixture.timestamp;
        const fechaHora = new Date(unixTime * 1000);
        const hora = fechaHora.toLocaleTimeString();
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${element.league.country}</td>
        <td>${element.league.name}</td>
        <td>${element.league.round}</td>
        <td>${hora}</td>
        <td>${fechaCorta}</td>
        <td>${element.league.season}</td>
        <td class="text-nowrap">
          <img src="${
            element.teams.home.logo
          }" alt="Imagen del equipo local" class="ml-0 align-middle max-width-1rem"/>
          ${element.teams.home.name}
        </td>
        <td class="text-nowrap">
          <img src="${
            element.teams.away.logo
          }" alt="Imagen del equipo visitante" class="ml-0 align-middle max-width-1rem"/>
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
        <td><a href="pronosticos.html?fixture=${
          element.fixture.id
        }">Ver</a></td>
        <td><a href="odds.html?fixture=${element.fixture.id}&home=${
          element.teams.home.name
        }&away=${element.teams.away.name}">Cuota</a></td>
      `;
        partidos.appendChild(tr);
      });

      $(document).ready(function () {
        $("#tablaResul").DataTable({
          responsive: {
            details: {
                display: $.fn.dataTable.Responsive.display.modal({
                  header: function(row) {
                    var data = row.data();
                    return data[0] + ' ' + data[1];
                  }
                }),
                renderer: $.fn.dataTable.Responsive.renderer.tableAll()
            }
        },
          language: {
            url: "//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json",
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
}

function functionFinished() {
  url = `https://v3.football.api-sports.io/fixtures?status=FT&date=${fecha}&timezone=${timeZone}`;
  function getData() {
    return new Promise((resolve, reject) => {
      const storedData = localStorage.getItem("FinishedMatch");

      if (storedData) {
        const parsed_json = JSON.parse(storedData);
        const tiempo_actual = Date.now();
        if (tiempo_actual - parsed_json.fecha <= 60000) {
          console.log("Datos desde Localstorage");
          resolve(parsed_json.data);
        } else {
          fetchData()
            .then((data) => {
              const tiempo_inicio = Date.now();
              const newData = { fecha: tiempo_inicio, data };
              localStorage.setItem("FinishedMatch", JSON.stringify(newData));
              resolve(data);
            })
            .catch((err) => reject(err));
        }
      } else {
        fetchData()
          .then((data) => {
            const tiempo_inicio = Date.now();
            const newData = { fecha: tiempo_inicio, data };
            localStorage.setItem("FinishedMatch", JSON.stringify(newData));
            resolve(data.response);
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
    const loader = document.querySelector(".loader");
    loader.style.display = "block";
    getData()
    .then((data) => {
      const partidos = document.getElementById("Partidos");
      partidos.innerHTML = "";
      data.forEach((element) => {
        const fecha = new Date(element.fixture.date);
        const fechaCorta = fecha.toLocaleDateString("es-CL");
        const unixTime = element.fixture.timestamp;
        const fechaHora = new Date(unixTime * 1000);
        const hora = fechaHora.toLocaleTimeString();
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${element.league.country}</td>
        <td>${element.league.name}</td>
        <td>${element.league.round}</td>
        <td>${hora}</td>
        <td>${fechaCorta}</td>
        <td>${element.league.season}</td>
        <td class="text-nowrap">
          <img src="${
            element.teams.home.logo
          }" alt="Imagen del equipo local" class="ml-0 align-middle max-width-1rem"/>
          ${element.teams.home.name}
        </td>
        <td class="text-nowrap">
          <img src="${
            element.teams.away.logo
          }" alt="Imagen del equipo visitante" class="ml-0 align-middle max-width-1rem"/>
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
        <td><a href="pronosticos.html?fixture=${
          element.fixture.id
        }">Ver</a></td>
        <td><a href="odds.html?fixture=${element.fixture.id}&home=${
          element.teams.home.name
        }&away=${element.teams.away.name}">Cuota</a></td>
      `;
        partidos.appendChild(tr);
      });

      $(document).ready(function () {
        $("#tablaResul").DataTable({
          responsive: {
            details: {
                display: $.fn.dataTable.Responsive.display.modal({
                  header: function(row) {
                    var data = row.data();
                    return data[0] + ' ' + data[1];
                  }
                }),
                renderer: $.fn.dataTable.Responsive.renderer.tableAll()
            }
        },
          language: {
            url: "//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json",
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
}

function functionNext() {
  url = `https://v3.football.api-sports.io/fixtures?date=${fecha}&status=NS&timezone=${timeZone}`;
  function getData() {
    return new Promise((resolve, reject) => {
      const storedData = localStorage.getItem("NextMatch");

      if (storedData) {
        const parsed_json = JSON.parse(storedData);
        const tiempo_actual = Date.now();
        if (tiempo_actual - parsed_json.fecha <= 60000) {
          console.log("Datos desde Localstorage");
          resolve(parsed_json.data);
        } else {
          fetchData()
            .then((data) => {
              const tiempo_inicio = Date.now();
              const newData = { fecha: tiempo_inicio, data };
              localStorage.setItem("NextMatch", JSON.stringify(newData));
              resolve(data);
            })
            .catch((err) => reject(err));
        }
      } else {
        fetchData()
          .then((data) => {
            const tiempo_inicio = Date.now();
            const newData = { fecha: tiempo_inicio, data };
            localStorage.setItem("NextMatch", JSON.stringify(newData));
            resolve(data.response);
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
    const loader = document.querySelector(".loader");
    loader.style.display = "block";
    getData()
    .then((data) => {
      const partidos = document.getElementById("Partidos");
      partidos.innerHTML = "";
      data.forEach((element) => {
        const fecha = new Date(element.fixture.date);
        const fechaCorta = fecha.toLocaleDateString("es-CL");
        const unixTime = element.fixture.timestamp;
        const fechaHora = new Date(unixTime * 1000);
        const hora = fechaHora.toLocaleTimeString();
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${element.league.country}</td>
        <td>${element.league.name}</td>
        <td>${element.league.round}</td>
        <td>${hora}</td>
        <td>${fechaCorta}</td>
        <td>${element.league.season}</td>
        <td class="text-nowrap">
          <img src="${
            element.teams.home.logo
          }" alt="Imagen del equipo local" class="ml-0 align-middle max-width-1rem"/>
          ${element.teams.home.name}
        </td>
        <td class="text-nowrap">
          <img src="${
            element.teams.away.logo
          }" alt="Imagen del equipo visitante" class="ml-0 align-middle max-width-1rem"/>
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
        <td><a href="pronosticos.html?fixture=${
          element.fixture.id
        }">Ver</a></td>
        <td><a href="odds.html?fixture=${element.fixture.id}&home=${
          element.teams.home.name
        }&away=${element.teams.away.name}">Cuota</a></td>
      `;
        partidos.appendChild(tr);
      });

      $(document).ready(function () {
        $("#tablaResul").DataTable({
          responsive: {
            details: {
                display: $.fn.dataTable.Responsive.display.modal({
                  header: function(row) {
                    var data = row.data();
                    return data[0] + ' ' + data[1];
                  }
                }),
                renderer: $.fn.dataTable.Responsive.renderer.tableAll()
            }
        },
          language: {
            url: "//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json",
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
}

function fetchData() {
  return fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": "22240ee711b7e2faa6b80fa55809e7db",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Datos desde la API:", data);
      return data.response;
    });
}

functionAll();
