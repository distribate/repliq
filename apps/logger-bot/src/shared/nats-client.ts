import { connect } from '@nats-io/transport-node';
import { receivePaymentSub } from '#lib/subs/receive-payment-sub';

export async function startNATS() {
  const nc = await connect({ servers: 'nats://localhost:4222' });
  console.log('NATS started');
  
  await Promise.all([
    receivePaymentSub(nc)
  ])
}