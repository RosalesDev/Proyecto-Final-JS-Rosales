/* -------------------------------------------------------------------------- */
/*                            IMPORTO LAS ENTIDADES                           */
/* -------------------------------------------------------------------------- */
import { Person } from "../entities/Person.js";
import { Appointment } from "../entities/Appointment.js";
import {
  professionalList,
  professionaPlanningList,
} from "../script/initial-data.js";

import { fetchWeatherData as fetchAndRenderWeather } from "../script/utils/weather.js";

/* ----------------------- FUCIÓN PARA CREAR UN TURNO ----------------------- */
function createNewAppointment(person, time, professional_planning) {
  let appointment = new Appointment(person, time, professional_planning);
  professional_planning.deleteUsedTime(time);
  return appointment;
}

/* ------------- DECLARO LISTAS PARA PACIENTES Y TURNOS CREADOS ------------- */
let patientList = [];
let appointmentList = [];

/* -------- CREO LISTAS DE PLANIFICACIONES Y TURNOS EN LOCAL STORAGE -------- */
if (!localStorage.getItem("professional_planning_list")) {
  localStorage.setItem(
    "professional_planning_list",
    JSON.stringify(professionaPlanningList)
  );
}

if (!localStorage.getItem("appointment_list")) {
  localStorage.setItem("appointment_list", JSON.stringify(appointmentList));
}

const mainTitle = document.querySelector("main h3");
const mainGrid = document.querySelector(".container .row");
const nav = document.querySelector(".navbar .container-fluid");

/* -------------------------------------------------------------------------- */
/*                 FUNCIÓN QUE RENDERIZA LA PANTALLA PRINCIPAL                */
/* -------------------------------------------------------------------------- */

function renderMainGrid() {
  mainGrid.innerHTML = "";
  mainTitle.innerHTML = "Selecciona el profesional para solicitar un turno.";

  /* ------------- TRAIGO DATOS DEL LS PARA USARLOS AL RENDERIZAR ------------- */
  const professionalPlanningListFromLS = JSON.parse(
    localStorage.getItem("professional_planning_list")
  );

  fetchAndRenderWeather(nav);

  for (let professional of professionalList) {
    const currentPlanning = professionalPlanningListFromLS.find(
      (pPlanning) =>
        pPlanning.professional.person.doc_number ==
        professional.person.doc_number
    );
    const cardDiv = document.createElement("div");
    cardDiv.className = "col";

    cardDiv.innerHTML = `
        <a href="#" data-dni=${professional.person.doc_number}>
          <div class="col">
            <div class="card" style="width: 18rem;">
              <img class="p-2" src="${professional.person.photo}" class="card-img-top" alt="Professional picture">
              <div class="card-body">
                <h5 class="card-title">${professional.person.last_name} ${professional.person.first_name}</h5>
                <p class="card-text">${professional.specialty}</p>
                <div class="text-center">
                  <span class="badge rounded-pill text-bg-info">Turnos disponibles: ${currentPlanning.available_times_list.length}</span>
                </div>
              </div>
            </div>
          </div>
        </a>`;

    mainGrid.append(cardDiv);
  }
  const cards = document.querySelectorAll(".row a");
  for (let card of cards) {
    card.addEventListener("click", () => {
      const selectedProfessional = professionalList.find(
        (professional) => professional.person.doc_number == card.dataset.dni
      );
      goToForm(selectedProfessional);
    });
  }
}
/* -------------------------------------------------------------------------- */
/*             FIN FUNCIÓN QUE RENDERIZA LA PANTALLA PRINCIPAL                */
/* -------------------------------------------------------------------------- */

renderMainGrid();

/* -------------------------------------------------------------------------- */
/*           FUNCIÓN QUE REEMPLAZA EL CONTENIDO DE LA PAGINA PRINCIPAL        */
/*             POR UN FORMULARIO PARA INGRESAR LOS DATOS DEL PACIENTE.        */
/* -------------------------------------------------------------------------- */
function goToForm(professional) {
  /* ----------- QUITA EL HORARIO QUE SE UTILIZÓ AL GENERAR EL TURNO ---------- */
  function deleteUsedTimeOnLS(professionalPlanning, selectedTime) {
    professionalPlanning.available_times_list =
      professionalPlanning.available_times_list.filter(
        (time) => time != selectedTime
      );
  }

  /* ------------- TRAIGO DATOS DEL LS PARA USARLOS AL RENDERIZAR ------------- */
  const professionalPlanningListFromLS = JSON.parse(
    localStorage.getItem("professional_planning_list")
  );
  const professionalPlanningFromLS = professionalPlanningListFromLS.find(
    (professionalPlanning) =>
      professionalPlanning.professional.id == professional.id
  );

  /* ---------------- PLANIFICACIÓN DEL PROFESIONAL SELECIONADO --------------- */
  const professionalPlanning = professionaPlanningList.find(
    (planning) => planning.professional === professional
  );

  /* ----------------- CONTROLO SI TIENE HORARIOS DISPONIBLES ----------------- */
  if (professionalPlanningFromLS.available_times_list.length == 0) {
    Swal.fire({
      icon: "warning",
      title: "El profesional no tiene horarios disponibles.",
      allowOutsideClick: false,
    });
    return 0;
  }
  if (localStorage.getItem("appointment_list")) {
    appointmentList = JSON.parse(localStorage.getItem("appointment_list"));
  }

  /* ------------- LLENANDO EL SELECT PARA LA FECHA DE ENACIMIENTO ------------- */
  function fillDay() {
    let options = "";

    for (let i = 1; i <= 31; i++) {
      options += `<option value=${i}>${i}</option>`;
    }
    return options;
  }
  function fillMonth() {
    let options = "";

    for (let i = 1; i <= 12; i++) {
      options += `<option value=${i}>${i}</option>`;
    }
    return options;
  }
  function fillYear() {
    let options = "";
    const current_date = new Date();

    for (let i = 1920; i <= current_date.getFullYear(); i++) {
      options += `<option value=${i}>${i}</option>`;
    }
    return options;
  }

  function renderTimes(availableTimes) {
    let options = "";

    for (let time of availableTimes) {
      options += `<option value=${time}>${time}</option>`;
    }

    return options;
  }

  mainTitle.innerHTML = "";

  mainGrid.innerHTML = `
  <div class="container">
  <div class="text-center pb-4">
    <h3>Turno con: ${professional.person.last_name} ${
    professional.person.first_name
  }</h3>
  </div>
  <div class="row justify-content-center">
    <div class="form-container col-5 p-4">
      <form class="needs-validation" novalidate>
        <div class="mb-3">
          <div class="form-floating mb-3">
            <select id="timeSelect" class="form-select" aria-label="Gender select">
              <option selected>Horarios disponibles</option>
              ${renderTimes(professionalPlanningFromLS.available_times_list)}
            </select>
          </div>
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="dniInput" placeholder="Ingrese su DNI" required>
            <label for="dniInput">DNI</label>
            <div class="invalid-feedback">
              Please choose a username.
            </div>
          </div>
          <div class="form-floating d-flex justify-content-between ps-3 pe-5">
            <p class="d-inline">Género</p>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="genderRadio" id="genderRadioM" value="M" checked>
              <label class="form-check-label" for="genderRadioM">M</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="genderRadio" id="genderRadioF" value="F">
              <label class="form-check-label" for="genderRadioF">F</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="genderRadio" id="genderRadioX" value="X">
              <label class="form-check-label" for="genderRadioX">X</label>
            </div>
          </div>
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="lastNameInput" placeholder="Ingrese su apellido">
            <label for="lastNameInput">Apellido</label>
          </div>
          <div class="form-floating">
            <input type="text" class="form-control" id="firstNameInput" placeholder="Ingrese su nombre">
            <label for="firstNameInput">Nombre</label>
          </div>
          <div class="form-floating mt-3 ps-3"><p>Fecha de nacimiento</p></div>
          <div class="row mb-5">
            <div class="col-4">
              <label for="inputDay" class="form-label">Día</label>
              <select id="inputDay" class="form-select" aria-label="Day select">
                ${fillDay()}
              </select>
            </div>
            <div class="col-4">
              <label for="inputMonth" class="form-label">Mes</label>
                <select id="inputMonth" class="form-select" aria-label="Month select">
                  ${fillMonth()}
                </select>
            </div>
            <div class="col-4">
              <label for="inputYear" class="form-label">Año</label>
                <select id="inputYear" class="form-select" aria-label="Year select">
                  ${fillYear()}
                </select>
            </div>
          </div>
        </div>
        <div class="col-12 d-flex  justify-content-between">
          <button class="btn btn-success w-50" type="button">VOLVER</button>
          <div class="container w-25"></div>
          <button class="btn btn-primary w-50" type="submit">SOLICITAR TURNO</button>
        </div>
      </form>
    </div>
  </div>
</div>`;
  const backButton = document.querySelector(".btn-success");
  const submitButton = document.querySelector(".btn-primary");

  backButton.addEventListener("click", () => {
    renderMainGrid();
  });

  /* -------------- COMPPORTAMIENTO DEL BOTON PARA CREAR EL TURNO ------------- */
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    const selectedTime = document.getElementById("timeSelect").value;
    const docNumber = document.getElementById("dniInput").value;
    const gender = document.querySelector(
      'input[name="genderRadio"]:checked'
    ).value;
    const lastName = document.getElementById("lastNameInput").value;
    const firstName = document.getElementById("firstNameInput").value;
    const birthDay = document.getElementById("inputDay").value;
    const birthMonth = document.getElementById("inputMonth").value;
    const birthYear = document.getElementById("inputYear").value;

    if (selectedTime == "Horas disponibles") {
      Swal.fire({
        icon: "error",
        title: "Debe seleccionar una hora para el turno.",
        allowOutsideClick: false,
      });
      return 0;
    }
    if (docNumber != undefined && (isNaN(docNumber) || docNumber.length < 8)) {
      Swal.fire({
        icon: "error",
        title: "El DNI ingresado no es válido.",
        allowOutsideClick: false,
      });
      return 0;
    }
    if (lastName != undefined && lastName.length < 3) {
      Swal.fire({
        icon: "error",
        title: "El apellido ingresado no es válido.",
        allowOutsideClick: false,
      });
      return 0;
    }
    if (firstName != undefined && firstName.length < 3) {
      Swal.fire({
        icon: "error",
        title: "El nombre ingresado no es válido.",
        allowOutsideClick: false,
      });
      return 0;
    }

    const newPerson = new Person(
      docNumber,
      gender,
      lastName,
      firstName,
      birthDay + "/" + birthMonth + "/" + birthYear,
      "./images/person-silhouette.png"
    );

    patientList.push(newPerson);
    localStorage.setItem("patient_list", JSON.stringify(patientList));

    /* ------------------------- SE CREA EL NUEVO TURNO ------------------------- */
    const newAppointment = createNewAppointment(
      newPerson,
      selectedTime,
      professionalPlanning
    );
    if (newAppointment != undefined) {
      appointmentList.push(newAppointment);
      localStorage.setItem("appointment_list", JSON.stringify(appointmentList));

      /* -- BORRO EL HORARIO USTILIZADO Y MANDO DE NUEVO LAS PLANIFICACIONES AL LS - */
      deleteUsedTimeOnLS(professionalPlanningFromLS, selectedTime);
      localStorage.setItem(
        "professional_planning_list",
        JSON.stringify(professionalPlanningListFromLS)
      );

      Swal.fire({
        icon: "success",
        title: "Turno generado con éxito.",
        html: `<p>Hora del turno: ${selectedTime}</p>`,
        allowOutsideClick: false,
      });
      renderMainGrid();
    }
  });
}
