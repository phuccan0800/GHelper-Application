class UserDTO {
  constructor({ email, phone, region, name, avtImg, gender, IDCard, birthDate }) {
    this.email = email;
    this.phone = phone || null;
    this.region = region || null;
    this.name = name;
    this.avtImg = avtImg || null;
    this.IDCard = IDCard || null;
    this.birthDate = birthDate || null
    this.gender = gender || null;
  }
}

module.exports = UserDTO;
