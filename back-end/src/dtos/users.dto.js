class UserDTO {
  constructor({ id, username, email, phone, region, city, firstname, lastname }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.phone = phone || null;
    this.region = region || null;
    this.city = city || null;
    this.firstname = firstname;
    this.lastname = lastname;
  }
}

module.exports = UserDTO;
