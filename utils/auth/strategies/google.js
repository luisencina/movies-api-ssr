const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const axios = require('axios');
const boom = require('@hapi/boom');

const { config } = require('../../../config');

passport.use( new GoogleStrategy({
    clientID: config.googleClientId,
    clientSecret: config.googleClientSecret,
    callbackURL: "/auth/google/callback",  
},
async (accessToken, refreshToken, { _json: profile }, done) => {
    try{
        const { data, status } = await axios({
            url: `${config.apiUrl}/api/auth/sign-provider`,
            method: "post",
            data: {
                name: profile.name,
                email: profile.email,
                password: profile.sub,
                apiKeyToken: config.apiKeyToken
            }
        });

        if(!data || status !== 200){
            done(boom.unauthorized(), false)
        }

        done(null, data)
    }catch(err){
        done(err)
    }
}
) );