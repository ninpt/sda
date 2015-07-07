e-Sci Prototype URL: http://openfda-esciads.rhcloud.com/

e-Sci Deisgn URL: https://github.com/ninpt/sda


Agile Approach to Prototype Design and Development-

For the design and development of the prototype using OpenFDA Drug, Device, and Food datasets, e-Sci team used a compressed Agile Sprint approach.  We put together an Agile team for the roles specified for "Pool Two-Development". As with many Agile projects, and given that this was a short, limited prototype design and development effort, several roles were handled by a single person.  

Project Kick-off and Chartering:  The product manager convened a project kick-off/chartering meeting to establish the vision and goals of the prototype design and development effort. The Agile process began with definition of several User Epics.  e-Sci team decided to use a generic user “John” to represent the public users of the prototype system. The team also agreed on a Definition of Ready for the Sprints and a Definition of Done for the individual stories and the Sprints.  Please refer to the document “e-Sci_AgileProcess.docx” in the repository https://github.com/ninpt/sda/tree/master/Documentation for a detailed description of our agile process.

Release Planning: Following the kick-off/chartering meeting, a release planning meeting was conducted by the Product Manager. The Epics were refined into smaller, discreet user stories.  Note, that we used “John” to refer to a generic user that is a member of the general public that wishes to use the OpenFDA database for searching information related to drugs prescribed for hypertension and for pacemaker devices.  The team decided that the effort would be consist of 2 very short Sprints.

Sprint Planning and Backlog Story Grooming:  The team conducted two combined Sprint Planning and Backlog Story Grooming sessions.  The developers worked with our Product Owner on Backlog Grooming to ensure that each User Story was sufficiently defined and understood to allow the developers to begin work on them.  As part of the Sprint Planning, points were assigned to each User Story and Technical Story to estimate the relative size and complexity of each story.

Sprinting and Technical Approach:  e-Sci team accomplished the design and development in two Sprints following the Sprint Planning and Backlog Grooming session.  The most important aspect of the technical approach was to use open-source software that was publicly accessible in the cloud. The major components of our architecture were:
1)	Free editors such as Bracket for HTML, JavaScript, CSS files. We also used the free trial run of “Axure” to develop rapid prototypes for the wireframe.
2)	We created an account for e-Sci organization on GitHub and created a repository “sda” for the Agile Delivery prototype. The entire e-Sci team was added as members for access to the repository.
3)	The developers reviewed the OpenFDA datasets and APIs and tested queries related to our user stories on the OpenFDA website by changing the parameters. Next, we used JavaScript to make RESTful web service calls to the FDA datasets for Devices and Drugs.
4)	e-Sci developer team used JSFIDDLE for debugging as the tool displays code and also executes it in a browser. We used QUnit to write unit tests for the JavaScript code.
5)	The team chose to use OpenShift Online by Red Hat as our PaaS service to deploy the web application. Red Hat allows users to create a free account, and an application in OpenShift Online. We then push the web application code from our GitHub repository (“sda”) to OpenShift. The prototype URL at the beginning of this document refers to the application deployed in Red Hat OpenShift.
6)	OpenShift provides continuous integration with Jenkins server that can run builds, tests, and other scheduled tasks and integrate with applications deployed therein.
7)	Red Hat also provides OpenStack workload management capabilities through Zabbix which addresses the need for continuous monitoring of applications.

As developers completed coding on modules, they were integrated with the other software modules using continuous integration with GitHub.  This allowed other members of the team to act as testers to perform User Functional Testing and Usability Testing.
During the Sprints, metrics were maintained on the progress of the work.  The primary metrics were points completed versus points planned.  A combined burn-down chart was maintained for both Sprints. 