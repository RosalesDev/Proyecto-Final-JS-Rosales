/* -------------------------------------------------------------------------- */
/*                      CREACIÓN DE OBJETOS PARA PRUEBAS                      */
/* -------------------------------------------------------------------------- */
import {Person} from '../entities/Person.js';
import {Professional} from '../entities/Professional.js';
import {ProfessionalPlanning} from '../entities/ProfessionalPlanning.js';

const professional_person_1 = new Person(
  "35887554",
  "M",
  "Fleming",
  "Alexander",
  "21/12/1978",
  "./images/img-dr-men-01.png"
);

const professional_person_2 = new Person(
  "34050138",
  "M",
  "Blackwell",
  "Elizabeth ",
  "13/11/1980",
  "./images/img-dr-woman-01.png"
);

const professional_person_3 = new Person(
  "32558425",
  "M",
  "Sanger",
  "Margaret",
  "13/11/1980",
  "./images/img-dr-woman-02.png"
);
const professional_person_4 = new Person(
  "33448551",
  "M",
  "Curie",
  "Marie ",
  "13/11/1980",
  "./images/img-dr-woman-03.png"
);

const professional_1 = new Professional(
  1,
  "A-123",
  professional_person_1,
  "Medicina General"
);

const professional_2 = new Professional(
  2,
  "B-345",
  professional_person_2,
  "Cardiología"
);

const professional_3 = new Professional(
  3,
  "B-346",
  professional_person_3,
  "Pediatría"
);

const professional_4 = new Professional(
  4,
  "C-347",
  professional_person_4,
  "Nutrición"
);

const planning_1 = new ProfessionalPlanning(
  1,
  professional_1,
  new Date(2023, 7, 22, 8, 0, 0),
  new Date(2023, 7, 22, 12, 0, 0),
  30
);

const planning_2 = new ProfessionalPlanning(
  2,
  professional_2,
  new Date(2023, 7, 22, 15, 0, 0),
  new Date(2023, 7, 22, 16, 0, 0),
  60
);

const planning_3 = new ProfessionalPlanning(
  3,
  professional_3,
  new Date(2023, 7, 22, 8, 0, 0),
  new Date(2023, 7, 22, 14, 0, 0),
  30
);

const planning_4 = new ProfessionalPlanning(
  4,
  professional_4,
  new Date(2023, 7, 22, 19, 0, 0),
  new Date(2023, 7, 22, 22, 0, 0),
  60
);

export const professionalList = [
  professional_1,
  professional_2,
  professional_3,
  professional_4,
];

export const professionaPlanningList = [
  planning_1,
  planning_2,
  planning_3,
  planning_4,
];