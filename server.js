
require("greenlock-express")
import GreenLockExpress from "greenlock-express"

GreenLockExpress.create({
    // Let's Encrypt v2 is ACME draft 11
    version: 'draft-11'
  , server: 'https://acme-v02.api.letsencrypt.org/directory'
  
    // You MUST change these to valid email and domains
  , email: 'john.doe@example.com'
  , approveDomains: [ 'example.com', 'www.example.com' ]
  , agreeTos: true
  , configDir: "/path/to/project/acme/"
  
  , app: require('./express-app.j')
  
  , communityMember: true // Get notified of important updates
  , telemetry: true       // Contribute telemetry data to the project
  }).listen(80, 443);