# INFO834_Projet_Chatty_Chat  


## About this project 💡 

The main objectives of this project are to create a chat between users using soket.io, NodeJS, MongoDB and Redis.

## How to install 🔧 

1. Clone the repository  
```
git clone https://github.com/clement-massit/INFO834_Projet_Redis
```  
2. Install dependencies  
```
npm install 
```

## How to run the app  🏃
1. Create a folder named "data" (for Mongod storage)  

2. Launch a mongod server  
```
mongod --port 27017 --dbpath .\data\
```  
3. Launch the Redis server on the classic ports (localhost:6379)

4. Run the server  
```
node index.js
``` 
5. Go to [localhost:3000/accueil](http://localhost:3000/accueil)

## What the app can do 🔍

When launching the app, you are on the accueil page. This page allows you to sign in if you already have an account, or to sign up if you don't.  
The app can handle 3 types of errors :  

1. The username is already taken when trying to sign up
2. The username doesen't exist when trying to sign in 
3. The password is incorrect when trying to sign in with a valid username

When singing up, the user name and the encrypted password are stored in the mongo database, and a new key is created with the username and the value 1 in Redis.  
When signin in, this key is incremented to count the number of connections of the user. You can get this number by launching a Redis client and use the command :
```
get *username*
```
Where `*username*` is ne name of the user.  

You are then redirected to the chat page, where you can send messages to the chat.

