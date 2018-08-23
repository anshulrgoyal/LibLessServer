<h1>LibLessServer</h1>
This is attempt to write a Nodejs Server without any npm module and with out any framework.Comments and suggestions are most welcomed . The server comes with a load balancer and automatic restart and zero downtime restart .  
<h2>Contains the Example for :</h2>
1 baseurl <br>
2 jsonwebtoken <br>
3 express <br>
4 request <br>

<h2>Contains a bench Marking tool for server</h2>
command :
```shell
node cli.js url --time time(in s) --request requestPerSecond --interval 1000 --method [post,get,put,delete,patch] --body string --statusCode [any valid status code for http]
```
<br>
Flags: <br>
1 <b>time</b> : provide the time for which request must be made<br>
2 <b>request </b>:provide the number of concurrent request<br>
3<b> interval</b> :provide the interval between each batch of notification<br>
4<b> method:</b> provide the method for request<br>
5<b> body:</b>required with post and put method<br>
6<b> statusCode :</b>provide the status code assumed sucess for request<br>

