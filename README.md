
# Document E-sign

This is small nestjs project that has zoho sign integration to send pdf documents for signature for recipients.




## Pre-Requisites
- How to create pdf file with e-sign tags:
 
 ```
https://help.zoho.com/portal/en/kb/zoho-sign/user-guide/sending-a-document/articles/automatic-field-addition-in-zoho-sign
```

- API Documentation for Zoho Sign:
  
  ```
   https://www.zoho.com/sign/api/#introduction
  ```



## 🛠 How To Setup 
- Clone the repository  
  ```
  git clone git@github.com:AnishRane/E-Sign-Document.git
  ```
- Go to project directory
  ```
  cd E-Sign-Document
  ```
- Install dependencies
  ```
  npm install
  ```
- Create a Environment folder within the repository
  ```
  mkdir env
  ```
- Create respective .env file accordingly
  ```
  touch ./env/local.env
  ```
- Environment variables needed to be configured to run the project:
  ```
  ZOHO_REFRESH_TOKEN=""
  ZOHO_CLIENT_ID=""
  ZOHO_CLIENT_SECRET=""
  ZOHO_OAUTH_TOKEN_API="https://accounts.zoho.in/oauth/v2/token"
  ```
## API Reference

#### Get all items [just for dev purposes]
- Generate new Oauth access token for zoho apis

```http
  GET /document/token
```


#### Get item [just for dev purposes]

```http
  GET /document/tokenDetails
```

#### Upload and submit file for e-sign
```http
 POST /document/sendSignRequest
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `recipients`      | `array of object` | **Required**. Name and email address of recipients |:
`files` | `files` | **Required**. Files to be uploaded

This api accepts the receipients in array like:
```
[
    {
        "name":"",
        "email":""
    }
]
```
And files to be uploaded and sent for e-signing.

- Curl request:
```
curl --location 'http://localhost:3000/document/sendSignRequest' \
--form 'documents=@"/Users/anishrane/Downloads/testDoc2.pdf"' \
--form 'documents=@"/Users/anishrane/Downloads/testDoc2.pdf"' \
--form 'recipients="[
  {
    \"name\":\"Anish Rane\",
    \"email\":\"anish.rane21@outlook.com\"
  },
  {
    \"name\":\"Anish Manoj Rane\",
    \"email\":\"anishrane.dev@gmail.com\"
  }
]"'
```
This can be imported to postman for testing the API.
## Run Locally

Clone the project

Configure your NODE_ENV environment in package.json

```bash
"start:dev": "NODE_ENV=local nest start --watch"
```

Start the server

```bash
  npm run start:dev
```

