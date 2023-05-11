const username = 'o9a8qb1k5m80xtzo';
const password =
  'tc394q3h7ev4o4ptyfv6upt75zt79unnkwlr4bcr3vbkypwdhabrkgrd1kzptscr';

// Combine the username and password with a colon separator
const credentials = `${username}:${password}`;

// Encode the credentials in base64
const encodedCredentials = Buffer.from(credentials).toString('base64');

console.log(encodedCredentials);
