class ConnectionTable {
  constructor() {
    this.table = {};
  }

  addConnection(connection) {
    let id = connection.id;
    this.table[id] = connection;
    return this.table[id];
  }

  getConnection(id) {
    return this.table[id];
  }

  getConnections() {
    return Object.values(this.table);
  }

  logTable() {
    console.log(this.table);
  }
}

const connectionsTable = new ConnectionTable();

const seedConnectionsFromOneUp = (_oneUpClient) => {
  // Ideally we would pull all EHRs from 1upHealth, but for demo purposes, we'll keep it simple
  connectionsTable.addConnection({
    id: 4707,
    name: 'Cerner Health Systems (demo)',
    logo: 'https://1uphealth-assets.s3-us-west-2.amazonaws.com/systems/cerner.png'
  });

  console.log('Connections table seeded!');
  connectionsTable.logTable();
}


module.exports.connectionsTable = connectionsTable;
module.exports.seedConnectionsFromOneUp = seedConnectionsFromOneUp;
