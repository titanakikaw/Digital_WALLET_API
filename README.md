# Digital_WALLET_API
A SIMPLE DIGITAL_WALLET_API

Welcome to the documentation for the Simple Central Wallet System API. This documentation provides detailed information on how to integrate and use the API to interact with the wallet system programmatically. The API allows you to perform various financial transactions, retrieve user information, and manage user balances. The data is stored in a MySQL database. Let's get started!

Base URL
The base URL for accessing the API is: http://localhost:3000/

Authentication & User Management
Login
This endpoint allows users to log in to their accounts.

Endpoint: /auth/login
Method: POST

Request Body: {
  	"email": "johndoe@example.com",
  	"password": "password123"
}

Response: {
    	"status": "success",
   	  "message": "Logged In!",
  	  "data": {
        		"UserID": 8,
        		"Name": "SAMPLE NAME",
      		  "Email": "test@email3.com",
        		"AccountBalance": 6010.12,
       		  "LastLoginDate": null,
       		  "Activated": 1,
            "accessToken": your_access_token
    		}
}

Create User
This endpoint allows you to create a new user account in the wallet system.

Endpoint: /auth/registerUser
Method: POST

Request Body:
{
	"name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123"
}

Response: {
   	 "status": "success",
   	 "message": "Account created successfully",
     "data": {
       		 "email": "johndoe@example1.com",
       		 "password": "password123"
   	 }
}



Transaction

Check Balance 
This endpoint allows you to check funds into a user's account.

Endpoint: /api/transaction/balance/(your_user_id) 
Method: GET
Authorization (Bearer Token): Bearer (your_generated_accessToken) 

Response: {
   	 "status": "success",
     "message": "Your account balance is ₱0.00",
   	 "data": {
        		"AccountBalance": 0
    	}
}


Deposit
This endpoint allows you to deposit funds into a user's account.

Endpoint: /api/transaction/balance/(your_user_id) 
Method: PUT
Authorization (Bearer Token): Bearer (your_generated_accessToken) 

Request Body: {
   	"depositBal": 12000
}

Response: {
   	"status": "success",
  	"message": "Successfuly updated! Your new balance is ₱12,000.00",
    "data": {
       		 "AccountBalance": 12000
   	 }
}


Debit
This endpoint allows you to debit funds into a user's account.

Endpoint: /api/transaction/balance/(your_user_id) 
Method: PUT
Authorization (Bearer Token): Bearer (your_generated_accessToken) 

Request Body: {
   	"debitBal" : 1000
}

Response: {
   	"status": "success",
   	"message": "Successfuly updated! Your new balance is ₱11,000.00",
    "data": {
       		 "AccountBalance": 11000
   	 }
}


Transaction History
This endpoint allows you to retrieve the transaction history for a specific user account.

Endpoint: /api/transaction/history/(your_user_id) 
Method: GET
Authorization (Bearer Token): Bearer (your_generated_accessToken) 


Response: {
   	"status": "success",
    "message": "Transaction History",
   	"data": {
      "transactionHistory": [
        {
           "TransactionID": 49,
           "UserID": 12,
           "Description": "",
           "Amount": 0,
           "TransactionType": "Balance Inquiry",
           "TransDate": "2023-06-01T03:59:55.423Z"
          }
		  ]
    }
}


Error Handling

	Status Code: 400 Bad Request
  	This error occurs when the request is missing required details or contains invalid data.
Details: 
	- Missing important resources
	- Email and password are required!
	- Email, password and full name are required!
	- User undefined! Please try again
	- No data provided! Please try again
	Response Example: 

	{
		status: “error”,
		message: “Bad Request”,
		details: “Missing important resources”
}


Status Code: 401 Unauthorized
This error occurs when the request lacks valid authentication credentials or the provided credentials are invalid.

	Details:
    -	Invalid password! Please try again!
    -	No data provided! Please try again
    -	Invalid entry! Please try again
    -	Authentication token is required to access the requested resource. Please provide a valid token.

  Response Example:
  {
    status: “error”,
		message: “Unauthorized”,
		details: “Invalid password! Please try again”
  }
  
  
Status Code: 403 Forbidden
This error occurs when the client does not have sufficient permissions to access the requested resource.
 
Details:
  -	You cannot access this resource! Please try again.
  
  Response Example:
  {
    status: “error”,
		message: “Unauthorized”,
		details: “Access denied”
  }


Status Code: 404 Not found
This error occurs when the requested resource or endpoint is not found on the server.

Details:
-	No data was found! Please try again.

Response Example:
  {
    status: “error”,
		message: “Not found”,
		details: “No data was found! Please try again”
  }

Status Code: 500 Internal Server Error
This error occurs when the requested resource or endpoint is not found on the server.

Details:
-	No data was found! Please try again.

Response Example:
{
    status: “error”,
		message: “Internal Server Error”,
		details: “Server could not process request! Please try again”
}

