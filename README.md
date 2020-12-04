<a href="https://www.families-share.eu/"><img src="https://live.comune.venezia.it/sites/live.comune.venezia.it/files/styles/tb-wall-single-style/public/field/image/FamiliesShare-1200x672.jpg?itok=rcGCGBQW" title="Families_Share" alt="Families Share Logo"></a>

# Families Share Platform

> Funded under the Information and Communication Technologies programme of Horizon 2020’s Industrial Leadership component, and its call for collective awareness platforms for sustainability and social innovation, the Families_Share project is developing a social networking and awareness-raising platform dedicated to encouraging childcare and work/life balance. The platform capitalises on neighbourhood networks and enables citizens to come together to share tasks, time and skills relevant to childcare and after-school education/leisure, where these have become unaffordable in times of stagnation and austerity.

## Families_Share Platform Deployment instructions

### Initialization
   - If the user doesn’t have Node.js locally installed on their machine they can get and install the latest version from:

[NodeJS](https://nodejs.org/en/download)

   - In addition, the user needs to have a Google account. Any Gmail account is a valid developer account. If they don’t have one, they can create one at:
   
[Google Account](https://accounts.google.com)
  
  - The user needs to create a new Google project and a service account, as they will need the key from the service account in order to access the Google APIs from their Node.js client. Subsequently they need to enable the Google Calendar API that is necessary for the calendar features of the platform. All the above functionalities can be accessed from Google’s developer console. The following links can act as a guide for the above actions:
  
[Google Project](https://cloud.google.com/resource-manager/docs/creating-managing-projects)

[Google Service Account ](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)

[Google APIs](https://support.google.com/googleapi/answer/6158841?hl=en)

   - In case the user wants to enable single sign on with Google, which is supported by the platform they will need to create an OAuth client ID from their Google developer console credential’s section. During the creation of the OAuth client ID the user needs to select “Web application” as the type and authorize redirects to <http://localhost:4000> and their production server URL in order to use this functionality both in development and production.
   
   - An additional email account is needed, that will act as the platform’s email account which notifies the users for platform specific events.
   
   - In case the user wants to enable front-end error logs in production they will need a SENTRY account and a Sentry React project. These  canbe created at:

[Sentry](https://sentry.io/login)

   - Finally,in case the user wants to opt in for analytics in your production deployment they will need a Google Analytics account. You can create one at :
 
[Google Analytics](https://analytics.google.com/analytics/web/provision/?authuser=0#/provision/create)



