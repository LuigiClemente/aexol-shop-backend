import { bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config';

require('dotenv').config();

console.log('APP_ENV:', process.env.APP_ENV);  

bootstrapWorker(config)
    .then(worker => worker.startJobQueue())
    .catch(err => {
        console.log(err);
    });
