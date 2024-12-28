import { connect } from '@nats-io/transport-node';

export async function initializeNatsClient() {
  const nc = await connect({ servers: 'nats://localhost:4222' });
  console.log('\x1b[34mNATS started\x1b[0m');

  return nc;
}