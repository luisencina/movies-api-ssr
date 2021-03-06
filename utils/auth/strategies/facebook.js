const passport = require('passport');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const axios = require('axios')

const { config } = require("../../../config/index");


passport.use(
    new FacebookStrategy(
      {
        clientID: config.facebookClientId,
        clientSecret: config.facebookClientSecret,
        callbackURL: "/auth/facebook/callback",
        profilerFields: ["id", "email", "displayName"]
      },
      async function(accessToken, refreshToken, profile, done) {
      // Esta declaración de email es necesaria, pues Facebook no me retornaba el correo del usuario
        const email = profile.email
          ? profile.email
          : `${profile.id}@facebook.com`;
  
        const { data, status } = await axios({
          url: `${config.apiUrl}/api/auth/sign-provider`,
          method: "post",
          data: {
            name: profile.displayName,
            email: email,
            password: profile.id,
            apiKeyToken: config.apiKeyToken
          }
        });
  
        if (!data || status !== 200) {
          return done(boom.unauthorized(), false);
        }
  
        return done(null, data);
      }
    )
  );