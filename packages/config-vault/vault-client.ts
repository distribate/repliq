
import { Client } from '@litehex/node-vault';

export const vc = new Client({
  apiVersion: 'v1',
  endpoint: 'http://127.0.0.1:1488', 
  token: 'root' 
});

const mountPath = 'secret';
const path = 'shared';

export const getSecrets = await vc.kv2.read({ mountPath, path });