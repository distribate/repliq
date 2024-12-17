import { connect } from '@nats-io/transport-node';
import { receivePaymentSub } from '#lib/subs/receive-payment-sub';

export async function startNATS() {
  const nc = await connect({ servers: 'nats://localhost:4222' });
  console.log('\x1b[34mNATS started\x1b[0m');
  
  await receivePaymentSub(nc)
}