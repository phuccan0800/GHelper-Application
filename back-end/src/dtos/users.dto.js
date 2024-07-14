class UserDTO {
  constructor({ id, username, email, phone, region, city, name }) {
    this.id = id;
    this.email = email;
    this.phone = phone || null;
    this.region = region || null;
    this.city = city || null;
    this.name = name;
  }
}

module.exports = UserDTO;
