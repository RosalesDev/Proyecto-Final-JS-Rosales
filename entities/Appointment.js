export class Appointment {
  constructor(person, time, professional_planning) {
    this.id = Date.now();
    this.person = person;
    this.time = time;
    this.professional_planning = professional_planning;
  }
}