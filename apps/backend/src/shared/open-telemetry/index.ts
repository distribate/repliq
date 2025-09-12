import { NodeSDK } from '@opentelemetry/sdk-node'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { resourceFromAttributes } from "@opentelemetry/resources"
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions"
import { getNodeAutoInstrumentations  } from "@opentelemetry/auto-instrumentations-node"
import { AXIOM_DATASET, AXIOM_DOMAIN, AXIOM_TOKEN } from '../env'

const traceExporter = new OTLPTraceExporter({
  url: `https://${AXIOM_DOMAIN}/v1/traces`,
  headers: {
    Authorization: `Bearer ${AXIOM_TOKEN}`,
    'X-Axiom-Dataset': AXIOM_DATASET
  }
})

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: 'node traces',
});

export const sdk = new NodeSDK({
  spanProcessor: new BatchSpanProcessor(traceExporter), // Use BatchSpanProcessor for batching and sending traces
  resource: resource, // Attach the defined resource to provide additional context
  instrumentations: [getNodeAutoInstrumentations()], // Automatically instrument common Node.js modules
});

export function startOtel() {
  sdk.start()
  console.log("\x1B[35m[OpenTelemetry]\x1B[0m SDK started")
}