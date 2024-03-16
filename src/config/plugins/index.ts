import {
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  OrderPlacedEvent,
  VendureConfig,
} from "@vendure/core";
import { AssetsPlugin } from "./assets";
import { AdminUiPlugin } from "./admin";
import { EmailPlugin } from "./email";

import { RequestTransformer, WebhookPlugin } from '@pinelab/vendure-plugin-webhook';
import {
  CustomerEvent,
  CustomerGroupChangeEvent
} from '@vendure/core';
import 'dotenv/config';

const webhookTransformer = new RequestTransformer({
  name: 'Webhook Transformer',
  supportedEvents: [CustomerEvent, CustomerGroupChangeEvent],
  transform: async (event: any, injector) => {
    if (event instanceof CustomerEvent && event.type == "created") {
      return {
        body: JSON.stringify({
          "firstname": event.entity.firstName,
          "lastname": event.entity.lastName,
          "email": event.entity.emailAddress,
          "roles": [
              "Customer"
           ],
           "groups": { "Users": ["full"] }
        }),
        headers: {
          'Authorization': `Basic ${btoa(`${process.env.ZAMMAD_USERNAME}:${process.env.ZAMMAD_PASSWORD}`)}`,
          'content-type': 'application/json',
        },
      };
    } else {
      throw Error(`This transformer is only for create CustomerEvents!`);
    }
  },
});

const cubeTransformer = new RequestTransformer({
  name: 'Cube Transformer',
  supportedEvents: [CustomerEvent, CustomerGroupChangeEvent],
  transform: (event: any, injector: any) => {
    if (event instanceof CustomerEvent && event.type == "created") {
      return {
        body: JSON.stringify({
          "id": event.entity.id,
          "firstname": event.entity.firstName,
          "lastname": event.entity.lastName,
          "email": event.entity.emailAddress,
        }),
        headers: {
          'content-type': 'application/json',
        },
      };
    } else if (event instanceof CustomerGroupChangeEvent) {
      return {
        body: JSON.stringify({
          type: event.type,
          customers: event.customers.map(customer => ({
            "id": customer.id,
            "firstname": customer.firstName,
            "lastname": customer.lastName,
            "email": customer.emailAddress,
          })),
          group: event.customGroup,
        }),
        headers: {
          'content-type': 'application/json',
        },
      };
    } else {
      throw Error(`This transformer is only for create CustomerEvents!`);
    }
  },
});

const orderTransformer = new RequestTransformer({
  name: 'Order Transformer',
  supportedEvents: [OrderPlacedEvent],
  transform: (event: any, injector: any) => {
    if (event instanceof OrderPlacedEvent) {
      console.log(event, "orderTransformer")
      return {
        body: JSON.stringify(event.order),
        headers: {
          'content-type': 'application/json',
        },
      };
    } else {
      throw Error(`This transformer is only for create OrderPlacedEvent!`);
    }
  },
});

export const plugins: VendureConfig["plugins"] = [
  AssetsPlugin,
  DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
  DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
  EmailPlugin,
  AdminUiPlugin,
  WebhookPlugin.init({
    /**
     * Optional: 'delay' waits and deduplicates events for 3000ms.
     * If 4 events were fired for the same channel within 3 seconds,
     * only 1 webhook call will be sent
     */
    delay: 3000,
    events: [CustomerEvent, CustomerGroupChangeEvent, OrderPlacedEvent],
    /**
     * Optional: A requestTransformer allows you to send custom headers
     * and a custom body with your webhook call.
     * If no transformers are specified
     */
    requestTransformers: [webhookTransformer, cubeTransformer, orderTransformer],
  }),
];
