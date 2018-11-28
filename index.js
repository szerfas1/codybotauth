const express = require('express');
const app = express();

const port = process.env.PORT || 3001
const host = process.env.HOST || 'localhost'

app.get('/', (req, res) => {
  res.json('welcome!');
})

app.get('/auth', (req, res) => {
  const base_url = 'https://slack.com/oauth/authorize'
  const client_id = process.env.CLIENT_ID;

  // space - separated list of OAuth scopes, indicating which parts of the
  // Slack user's account you'd like your app to be able to access.The
  // complete list of scopes can be found here.
  const scope = 'bot users:read users.profile:read usergroups:read team read stars read reactions write reactions read im write im read im history identity.basic user identity.basic groups write groups read emoji read chat write user chat write bot channels write channels read';

  const redirect_uri = 'http://localhost:3001/token';

  // The state parameter should be used to avoid forgery
  // attacks by passing in a value that's unique to the user you're
  // authenticating and checking it when auth completes.
  const state = 'cody@#$' // optional
  const team = 'UEFTH6QBG'; // not 100% sure if this is the correct or even a valid team ID, found this by going to codybotauthtest.slack.com, inspecting the DOM, and ctrl+f for team_id
  res.redirect(`${base_url}?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}&team=${team}`)
})

app.get('/token', (req, res) => {
  console.log(req.params);
  console.log(req.query);
  const { code, state } = req.query;
  res.json('welcome to the token endpoint!');
})

app.listen(port, host, console.log('codybot authorization server listening on port:', port));