const dns2 = require('dns2');

const { Packet } = dns2;

const server = dns2.createServer({
  udp: true,
  handle: (request, send, rinfo) => {
    const response = Packet.createResponseFromRequest(request);
    const [ question ] = request.questions;
    const { name } = question;
    response.answers.push({
      name,
      type: Packet.TYPE.A,
      class: Packet.CLASS.IN,
      ttl: 300,
      address: '192.168.4.2'
    }); 
    send(response);
  }
});

server.on('request', (request, response, rinfo) => {
  console.log(request.header.id, request.questions[0]);
});

server.on('requestError', (error) => {
  console.log('Client sent an invalid request', error);
});

server.on('listening', () => {
  console.log(server.addresses());
});

server.on('close', () => {
  console.log('server closed');
});

server.listen({
  // Optionally specify port, address and/or the family of socket() for udp server:
  udp: { 
    port: 53,
    address: "0.0.0.0",
    type: "udp4",  // IPv4 or IPv6 (Must be either "udp4" or "udp6")
  },
  
//   // Optionally specify port and/or address for tcp server:
//   tcp: { 
//     port: 5333,
//     address: "127.0.0.1",
//   },
});