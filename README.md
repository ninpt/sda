### Build Instruction
The code base is developed using scripting languages including html, css, javascript, jQuery and other javascript based libraries which are either provided or referencing a Content Delivery Network (CDN). No code compilation is required. 

### Deployment Instruction
As deployment file structures varies depends on Application Server selected, only general instruction are provided. In general:
1. Local your application 'root' directory where the base URL can be accessed (e.g, http://localhost:8080/prototype).
2. Copy all files, including sub-folders and their contents into the root directory.
3. If the packaging structure is a WAR file, make sure in your 'WEB-INF/web.xml' file, specify the following:
    <welcome-file-list>
    	<welcome-file>reports_over_time.html</welcome-file>
   	</welcome-file-list>
4. To enable cross domain javascript calls, make sure your application server is configured to allow CORS requests. An Tomcat example is provided in 'crossdomain.xml' file. 