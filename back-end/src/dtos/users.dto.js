class UserDTO {
  constructor({ id, username, email, phone, region, name, avtImg }) {
    this.id = id;
    this.email = email;
    this.phone = phone || null;
    this.region = region || null;
    this.name = name;
    this.avtImg = avtImg || null;
  }
}

module.exports = UserDTO;
