File of various stack overflow links or resources I have for coming across errors and finding the solution.



_ _ _ _ _ _ _

IRC HELP on the problem: 
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client:
joepie91  I'd recommend adding a console.log to your error-handling middleware to see if that's getting called and with what error
5:52:39 PM	joepie91  two (probably) unrelated recommendations: 1) don't hardcode DB credentials into your code, have a separate `config.json` that's in `.gitignore`, and 2) you'll want to look into using promises rather than error-first callbacks, as error-first callbacks (the `(error, result)` type callbacks) are very fragile and error-prone
5:52:57 PM	joepie91  there's some possibility that the issue you're running into is caused by point 2
oepie91  circ-user-hDwIS: oh, another issue: you're currently using template strings for database queries, and string concatenation (which that is doing) is very dangerous; it creates SQL injection vulnerabilities
5:56:16 PM	joepie91  you should use the parameter API provided by your DB module/driver instead
5:56:26 PM	joepie91  where you use placeholders in the query, and then separately give it an array of values to use for those placeholders
joepie91  that prevents those vulnerabilities; by either sending the query and the values to the database separately (in `pg` and `mysql2`) or at least automatically escaping the values before inserting them into the query (in `mysql`)
joepie91  I'd recommend reading up on how SQL injections work, it's an example of a broader class of injection vulnerabilities that you'll see in a lot of places (HTML/XSS, command injection in shell commands, etc.)


_ _ __ _ __ _ _  _ __ 

Remove this error. It deletes your typing midway? <img src="https://i.imgur.com/3OSSaav.png" /> 
The solution to this error was to make sure you're response to the client on every call to the server. If you check the header in question under the network tab you would realize that the request was being made and then the server did nothing after the write to the database.. even though doing a write to the db was correct needed res.send(result) in the api call.


<br />
Failed to load resource: the server responded with a status of 502 (cannotconnect)<br />
MAMP <br>
/Applications/MAMP/Library/bin/mysql --host=localhost -uroot -proot
<br>
-| Variable_name           | Value                        |
+-------------------------+------------------------------+
| innodb_version          | 5.7.23                       |
| protocol_version        | 10                           |
| slave_type_conversions  |                              |
| tls_version             | TLSv1,TLSv1.1                |
| version                 | 5.7.23                       |
| version_comment         | MySQL Community Server (GPL) |
| version_compile_machine | x86_64                       |
| version_compile_os      | osx10.9                      | <br>


warning in console resolution (two images below):<br>
-https://imgur.com/a/xVxeaji    <br>
https://imgur.com/a/em4PbSW


https://stackoverflow.com/questions/8062496/how-to-change-max-allowed-packet-size?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa


_ _ _ _ 
Better way to renew cert on ubuntu server:<br />
https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04#step-5-%E2%80%94-verifying-certbot-auto-renewal
_ _ _ _ _
Run SET @@global.sql_mode= "NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION";
