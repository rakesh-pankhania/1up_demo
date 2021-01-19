const connectionsTable = [];

const seedConnectionsFromOneUp = (_oneUpClient) => {
  // Ideally we would pull all EHRs from 1upHealth, but for demo purposes, we'll keep it simple
  connectionsTable.push({
    4707: {
      id: 4707,
      name: 'Cerner Health Systems (demo)',
      logo: 'https://1uphealth-assets.s3-us-west-2.amazonaws.com/systems/cerner.png'
    }
  });

  console.log('Connections table seeded!');
  console.log(connectionsTable);
}


module.exports.connectionsTable = connectionsTable;
module.exports.seedConnectionsFromOneUp = seedConnectionsFromOneUp;
