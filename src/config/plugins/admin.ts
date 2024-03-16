import { AdminUiPlugin as Base } from "@vendure/admin-ui-plugin";
import { compileUiExtensions } from "@vendure/ui-devkit/compiler";
import path from 'path';
import { StripeSubscriptionPlugin } from '@pinelab/vendure-plugin-stripe-subscription';
import { WebhookPlugin } from '@pinelab/vendure-plugin-webhook';

export const AdminUiPlugin = Base.init({
  route: "admin",
  port: 3002,
  adminUiConfig: {},
  app: compileUiExtensions({
    outputPath: path.join(__dirname, '../admin-ui'),
    // Add the WebhookPlugin's UI to the admin
    extensions: [WebhookPlugin.ui, StripeSubscriptionPlugin.ui],
  }),
});
