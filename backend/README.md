# Add new card
### Need to add activation code.
http://localhost:3420/card-management/add-card
POST
    {
        "groupId" : 1,
        "orderEmail" : "paromita2@nazmeen.com",
        "qrCode" : "qrCode",
        "orderReference" : "orderReference"
    }

{
  "dbResult": {
    "card_id": 20,
    "user_id": 1,
    "card_link": "juJzcIExmwqC",
    "group_id": 1,
    "order_email": "paromita2@nazmeen.com",
    "qr_code": "qrCode",
    "card_tag": "",
    "action_id": 0,
    "is_active": false,
    "is_blocked": false,
    "order_reference": "orderReference",
    "updatedAt": "2023-02-19T11:05:29.279Z",
    "createdAt": "2023-02-19T11:05:29.279Z"
  },
  "activationCode": "q8LnMapiSf"
}

# Get list of cards of a single user or all users as admin
http://localhost:3420/card-management/list-cards
POST

Request: 
{
  "userId": 2
}
OR null body

Response: 
[
  {
    "card_link": "xozvhhzuoaquzsk",
    "card_tag": "Baby",
    "is_active": false,
    "is_blocked": false,
    "group_link": "https://link.smarttaps.co/codemarshal",
    "registered_email": "Curt8@gmail.com",
    "username": "Curt Hauck"
  }
]

or (in case of list all)
[
  {
    "card_link": "tfxtdq6rl4q3hud",
    "card_tag": "Elvie",
    "is_active": false,
    "is_blocked": false,
    "group_link": "https://link.smarttaps.co/card/",
    "group_name": "migrated",
    "registered_email": "Fidel.Kovacek89@yahoo.com",
    "username": "Mrs. Fidel Kovacek Jr."
  },
]

# Block a single card
http://localhost:3420/card-management/block-card
POST

Request:
{
  "cardId": 10
}

Response:
[
  1
]

# Unblock a single card
http://localhost:3420/card-management/unblock-card
POST

Request:
{
  "cardId": 10
}

Response:
[
  1
]

# Activate a single card
http://localhost:3420/card-management/activate-card
POST

Request: 
{
  "cardId": 10,
  "activationCode": "gsu4960c7xtrxht5r940"
}

Response:
{
  "success": 1,
  "msg": [
    1
  ]
}

# Signup
http://localhost:3420/user-management/signup
POST

Req: 
{
  "email": "find.if@gmail.com",
  "passPlain": "2441139",
  "userName": "Nahid Iftekhar",
  "type": 0
}

Res:
{
  "successStatus": true,
  "message": {
    "user_id": 21,
    "user_type": 0,
    "username": "Nahid Iftekhar",
    "registered_email": "find.if@gmail.com",
    "password": "$2b$10$CLitDZRYpkKol69732XUpOVtznXaeVNtSZp6Ykuw9zYf1PX66g8R.",
    "is_deactive": true,
    "updatedAt": "2023-02-18T15:49:01.107Z",
    "createdAt": "2023-02-18T15:49:01.107Z"
  },
  "type": 0
}
- This will send an email. The user will need to verify the email before they can use the account.

# Email verification API
 http://localhost:3420/user-management/verify-email/:token/:userId
 GET
 Response: web feedback success/failure

# Login
http://localhost:3420/user-management/login
POST

Req:
{
  "email": "find.if@gmail.com",
  "passPlain": "2441139",
  "type": 0
}

response
    JSON: { successStatus: true/false, type: 0/1, reason: reasonText, CMRT: refreshToken, }
    Cookie: Access token set for key CMAT
    refresh token should be stored in browser local storage for persistent access
    FE should allow BE to set cookie (withCredential: true)

# Forgot Password
/forgotpassword? user(email)
    POST
    successStatus
    In case of success FE will instruct user to check mail and click link

# Logout

    /logout
    GET

  Response

    { logoutStatus: true/false, }
    FE will remove CMRT token from browser local storage




# Add Action to a card
http://localhost:3420/action-management/add-action
POST

Req:
    {
        "actionType" : 5,
        "cardId" : 20,
        "actionAttribute" : "+8801817183465"
    }

Res:
{
  "action_id": 1,
  "action_type_id": 5,
  "card_id": 20,
  "action_attribute": "+8801817183465",
  "updatedAt": "2023-02-19T13:13:38.937Z",
  "createdAt": "2023-02-19T13:13:38.937Z"
}

# Edit action
http://localhost:3420/action-management/edit-action
POST

    {
        "actionId" : 4,
        "cardId" : 20,
        "actionType": 4,
        "actionAttribute" : "Profile",
        "profileData": {
          "actionId": 4,
          "aboutme": "I am a good human being",
          "title": "Super boss"
        }
    }

Res:
[
  1
]

#