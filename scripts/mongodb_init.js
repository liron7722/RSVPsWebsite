const db = require('../models');
const dbConfig = require('../config/db.config');
const logger = require('./logger');

const Role = db.role;
const childLogger = logger.child({ service: 'db' });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user',
      }).save((saveErr) => {
        if (saveErr) {
          childLogger.error('error', saveErr);
        }

        childLogger.debug("added 'user' to roles collection");
      });

      new Role({
        name: 'moderator',
      }).save((saveErr) => {
        if (saveErr) {
          childLogger.error('error', saveErr);
        }

        childLogger.debug("added 'moderator' to roles collection");
      });

      new Role({
        name: 'admin',
      }).save((saveErr) => {
        if (saveErr) {
          childLogger.error('error', saveErr);
        }

        childLogger.debug("added 'admin' to roles collection");
      });
    }
  });
}

db.mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    childLogger.debug('Successfully connect to MongoDB.');
    initial();
  })
  .catch((err) => {
    childLogger.error('Connection error', err);
    process.exit();
  });
