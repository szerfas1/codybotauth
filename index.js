const express = require('express');
const app = express();
require('dotenv').config()
const utils = require('./utils.js');

const port = process.env.PORT || 3001
const host = process.env.HOST || 'localhost'
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = 'http://localhost:3001/token';
const stateVerification = 'cody@'; // random string



app.get('/', (req, res) => {
  res.json('welcome!');
})

app.get('/auth', (req, res) => {
  const base_url = 'https://slack.com/oauth/authorize'

  // space - separated list of OAuth scopes, indicating which parts of the
  // Slack user's account you'd like your app to be able to access.The
  // complete list of scopes can be found here.
  const scope = 'bot'
  // Docs read that no matter what scopes requested, all bots get same scopes
  // For reference, Cody on 11/28 wanted to request hte following scopes: 'bot users:read users.profile:read usergroups:read team read stars read reactions write reactions read im write im read im history identity.basic user identity.basic groups write groups read emoji read chat write user chat write bot channels write channels read';

  // The state parameter should be used to avoid forgery
  // attacks by passing in a value that's unique to the user you're
  // authenticating and checking it when auth completes.
  const state = stateVerification // optional
  const team = 'UEFTH6QBG'; // not 100% sure if this is the correct or even a valid team ID, found this by going to codybotauthtest.slack.com, inspecting the DOM, and ctrl+f for team_id --> seems to work!
  res.redirect(`${base_url}?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}&team=${team}`)
})

app.get('/token', (req, res) => {
  const { code, state } = req.query;

  // best practice to check state to ensure unauthorized third party not requesting access
  console.log('state is', state);
  if (state !== stateVerification) throw new Error('State not verified');

  const base_url = 'https://slack.com/api/oauth.access'
  const request_url = `${base_url}?client_id=${client_id}&client_secret=${client_secret}&code=${code}&redirect_uri=${redirect_uri}`

  utils.request(request_url)
  .then((response) => {
    const { bot_user_id, bot_access_token } = response.bot
    res.send(
      `<h1>welcome to the token endpoint!</h1>
      <p>bot_user_id: ${bot_user_id}</p>
      <p>bot_access_token: ${bot_access_token}</p>`
    );
  }).catch(err => {
    console.log('Err caught:', err);
    res.send('whoops, looks like there was an error')
  })
})

app.listen(port, host, console.log('codybot authorization server listening on port:', port));