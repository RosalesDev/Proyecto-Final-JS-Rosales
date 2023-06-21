export class Person {
  constructor(doc_number, gender, last_name, first_name, birthday, photo) {
    this.id = Date.now();
    this.doc_number = doc_number;
    this.gender = gender;
    this.last_name = last_name;
    this.first_name = first_name;
    this.birthday = birthday;
    this.photo = photo;
  }
  /* --------------- ESTE METODO LO USO PERO ES PARA LA PRÓXIMA --------------- */
  getAge() {
    let birthday_arr = this.birthday.split("/");

    let birthday_date = new Date(
      birthday_arr[2],
      birthday_arr[1] - 1,
      birthday_arr[0]
    );
    let ageDifMs = Date.now() - birthday_date.getTime();
    let ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}