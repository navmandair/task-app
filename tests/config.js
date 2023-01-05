const path = require('path')

const dotenvConfigPath = process.env.TEST_DOTENV_CONFIG_PATH || path.resolve(process.cwd(), 'config', 'test.env');
require('dotenv').config({ path: dotenvConfigPath, debug: true});