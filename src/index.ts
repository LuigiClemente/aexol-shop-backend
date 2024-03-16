import { bootstrap, runMigrations } from "@vendure/core";
import { config } from "./vendure-config";

require('dotenv').config();

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const appEnv = "development";   

runMigrations(config)
  .then(() => bootstrap(config))
  .catch((err) => {
    console.log(err);
  });
