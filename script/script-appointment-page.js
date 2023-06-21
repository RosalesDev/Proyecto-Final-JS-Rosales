const accordion = document.querySelector('.accordion');
const accordionContainer = document.querySelector('.container');
const appointmentList = JSON.parse(localStorage.getItem('appointment_list'));

if(appointmentList.length > 0) {
  
  let appointmentMap = new Map();
  let professionalIdList = [];
  let patientList = [];

/* ------- CREO UN MAP CON LOS ID DE LOS PROFESIONALES Y UNA LISTA
            PARA SUS PACIENTES                                    ------ */
  for(let appointment of appointmentList){

    let professionalId = appointment.professional_planning.professional.id;

    appointmentMap.set(professionalId,[]);
  }

  professionalIdList = [...appointmentMap.keys()];
  
/* --- OBTENGO LOS PACIENTES DE CADA PROFESIONAL Y SE LOS ASIGNO EN EL MAP -- */
  for(let professionalId of professionalIdList){
      patientList = appointmentList.filter(appointment => 
      appointment.professional_planning.professional.id == professionalId
    );
    appointmentMap.set(professionalId,patientList);
  }

/* -------- SE GENERA LA TABLA CON LOS PROFESIONALES Y SUS PACIENTES -------- */
  for(let appointment of appointmentMap) {
    let index = appointment[0];

    function buildTbody(appointmentList){
      let tBody = '';
      let personIndex = 1;
      for(let appointment of appointmentList){
        let person = appointment.person;
          tBody += `
          <tr>
            <th scope="row">${personIndex}</th>
            <td>${appointment.time}</td>
            <td>${person.doc_number}</td>
            <td>${person.last_name}</td>
            <td>${person.first_name}</td>
          </tr>`
          personIndex++;
      }
      return tBody;
    }


    let profesionalLastName = appointment[1][0].professional_planning.professional.person.last_name;
    let profesionalFirstName = appointment[1][0].professional_planning.professional.person.first_name;
    let profesionalSpecialty = appointment[1][0].professional_planning.professional.specialty;

    let accordionItem = document.createElement("div");
    accordionItem.className = 'accordion-item';
    accordionItem.innerHTML = `
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapse${index}"
          aria-expanded="true"
          aria-controls="collapse${index}"
        >
          ${profesionalLastName} ${profesionalFirstName}
          (${profesionalSpecialty})
        </button>
      </h2>
      <div
        id="collapse${index}"
        class="accordion-collapse collapse"
        data-bs-parent="#accordionExample"
      >
        <div class="accordion-body">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Hora</th>
                <th scope="col">DNI</th>
                <th scope="col">Apellido</th>
                <th scope="col">Nombre</th>
              </tr>
            </thead>
            <tbody>
            ${buildTbody(appointment[1])}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

    accordion.append(accordionItem);
  }

}
else{
  accordion.remove();
  accordionContainer.innerHTML = `
  <div class="container text-center pt-5"><h5>No hay turnos registrados</h5></div>
  `;
}
