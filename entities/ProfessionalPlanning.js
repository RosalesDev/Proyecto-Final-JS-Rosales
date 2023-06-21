export class ProfessionalPlanning {
  constructor(
    id,
    professional,
    date_from,
    date_to,
    max_appointmaint_duration_in_min
  ) {
    this.id = id;
    this.professional = professional;
    this.date_from = date_from;
    this.date_to = date_to;
    this.max_appointmaint_duration_in_min = max_appointmaint_duration_in_min;
    this.available_times_list = this.getPlanningDates();
  }
  getMaxAppointmentAmount() {
    let totalMin = (this.date_to - this.date_from) / 60000;
    return Math.floor(totalMin / this.max_appointmaint_duration_in_min);
  }

  /*GENERA UNA LISTA CON LOS HORARIOS DISPONIBLES SEGUN LAS HORAS
  QUE SE ASIGNA AL CREAR LA PLANIFICACIÓN*/
  getPlanningDates() {
    const maxAppointmentAmount = this.getMaxAppointmentAmount();
    let datesArr = [];
    let auxAppointmentDate = new Date(this.date_from);
    let currentMinutes = this.date_from.getMinutes();
    let minutesCounter = 0;

    datesArr.push(auxAppointmentDate.toLocaleTimeString());

    while (datesArr.length < maxAppointmentAmount) {
      minutesCounter = currentMinutes + this.max_appointmaint_duration_in_min;
      if (minutesCounter == 60) {
        auxAppointmentDate.setHours(auxAppointmentDate.getHours() + 1);
        currentMinutes = 0;
      } else {
        if (minutesCounter > 60) {
          auxAppointmentDate.setHours(
            auxAppointmentDate.getHours() + 1,
            minutesCounter - 60
          );
          currentMinutes = minutesCounter - 60;
        } else {
          currentMinutes += this.max_appointmaint_duration_in_min;
        }
      }
      auxAppointmentDate.setMinutes(currentMinutes);
      datesArr.push(auxAppointmentDate.toLocaleTimeString());
    }
    return datesArr;
  }

  deleteUsedTime(selectedTime) {
    this.available_times_list = this.available_times_list.filter(
      (time) => time != selectedTime
    );
  }
}