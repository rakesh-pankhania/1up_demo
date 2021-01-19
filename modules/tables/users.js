const usersTable = [];

const seedUsersFromOneUp = (oneUpClient) => {
  oneUpClient.getUsers().then((users) => {
    for (user of users) {
      usersTable.push(user);
    }
    console.log('Users table seeded!');
    console.log(usersTable);
  }).catch((response) => {
    console.error("Error seeding users");
    console.error(response);
    throw 'Could not seed users. See server logs.';
  })
}


module.exports.usersTable = usersTable;
module.exports.seedUsersFromOneUp = seedUsersFromOneUp;
