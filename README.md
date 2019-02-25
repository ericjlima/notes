Steps to run this app. Apologies if this README is not up to date but this project should be easy to get running if you have a basic understanding of mysql, node, react, express. Contact me on discord if you have issues EricL
#3392


Steps to take:

1.) Have mysql installed and create an empty DB. I called my database "mydb".

2.) Look at routes/notes and replace the credentials with your own. My user is ericx2x. Make your own mysql user that created your 'mydb' database.

3.) Uncomment the lines in routes/notes if you wish to easily create the DB structure. Feel free to recomment them afterwards. These are all easy to understand sql statements to help setup your DB.

4.) Run "npm install" and "node bin/www" from the root of the project via the terminal.

5.) Go to /client and run "npm install && npm start"

6.) Enjoy your own note taking app. This uses my code so if you have any questions feel free to ask. I'm sure you can code your own note taking system as they I find them incredibly helpful and easy to write. It's a great way to learn.






Common Errors and Solutions for me:


After npm start on express path:
"Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client"
https://stackoverflow.com/questions/11403980/how-do-i-login-as-root-on-mysql-on-os-x


after going to "mysql -u root" to fix above
"ERROR 2059 (HY000): Authentication plugin 'caching_sha2_password' cannot be loaded: dlopen(/usr/local/Cellar/mysql/5.7.22/lib/plugin/caching_sha2_password.so, 2): image not found"
https://stackoverflow.com/questions/49945649/mysql-error-authentication-plugin-caching-sha2-password-cannot-be-loaded

Ended up reinstalling mysql for the above arrors 27-35 https://stackoverflow.com/questions/10610875/mysql-pid-ended-cannot-start-mysql
