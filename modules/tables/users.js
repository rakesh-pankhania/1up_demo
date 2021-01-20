/*
  UserTable is an in-memory, schemaless table class that contains information
  about users
*/

class UserTable {
  constructor() {
    this.table = {};
  }

  addUser(user) {
    let id = user.app_user_id;

    this.table[id] = {
      oneup_user_id: user.oneup_user_id,
      app_user_id: user.app_user_id,
      active: user.active
    };

    return this.table[id];
  }

  getUser(id) {
    return this.table[id];
  }

  getUsers() {
    return Object.values(this.table);
  }

  updateUser(id, newData) {
    user = this.table[id];

    for(let key in newData) {
      user[key] = newData[key];
    }

    return this.table[id];
  }

  logTable() {
    console.log(this.table);
  }
}

const usersTable = new UserTable();

const seedUsersFromOneUp = (oneUpClient) => {
  // Seed users from 1upHealth API
  oneUpClient.getUsers().then((users) => {
    for (user of users) {
      usersTable.addUser(user);
    }
    console.log('Users table seeded!');
    usersTable.logTable();
  }).catch((response) => {
    console.error("Error seeding users");
    console.error(response);
    throw 'Could not seed users.';
  })
}


module.exports.usersTable = usersTable;
module.exports.seedUsersFromOneUp = seedUsersFromOneUp;
