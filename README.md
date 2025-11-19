# Main Project
https://docs.google.com/presentation/d/1CUfod2HlLWnzYPBgxBslwANia4onzo_R0gAnx2tD2zU/edit?usp=sharing

### Web Dev Setup:
1. Ensure pnpm is installed, otherwise run `npm install -g pnpm`
2. Install Packages in the root directory: `pnpm install`
3. Run `npm run dev` to start development server

### Web Dev Options:
1. `npm run dev` - spins up both nextjs and express server for development purpose
2. `npm run build` - Build the application for production purpose
3. `npm run lint` - Check if codes are within the styling guidelines


### Mobile Dev
Good thing is that you can ignore all the instructions above, unless you're a web dev too.

Your code is isolated/independent from other monorepo apps, so any changes you made to mobile will only stay there.

For addition resource, please access [flutter doc](https://docs.flutter.dev/get-started/quick) 

# Project Init Write Up
This is a final? update to the project and is a way for me (@zhiyan114) to write a comprehensive summary on the choices I made for each of the tech stack I've used for the project.

### The MERN Stack
As per project requirement, we're require to use: MongoDB, ExpressJS, ReactJS, and NodeJS. Below, I'll explain what I liked and/or what I didn't liked:
- MongoDB - Honestly, our project is better suited when using a SQL-based database (such as PostgreSQL). ERD also didn't make sense since the use-case for document-based database is for unpredictable data structure, but our entire data structure are pretty much well-defined and have proper relationship with other objects (table). The database also didn't provide any feedback when it fails the database's internal validation, which made certain debugging very much frustrated. One thing I did enjoy is the zero need to write SQL statement, but ORM will usually get the job, plus it's not that bad.
- ExpressJS - I don't have much opinion on this. The only other web framework I use is Fastify, but that's like one-time thing and there's was a weird issue that I end up not figuring out that would've been solved by just using Express..
- ReactJS - React itself is just a web framework, have to either choose a pre-existing template or configure the framework manually, from file structures to build/bundler. Unless there's an edge case, there's almost never a need to do that, so there I chose NextJS. There's of course other templates like Vite I can choose, but nextjs specifically pulled my attention is because it's a fullstack web application tool. Yes, you can write frontend and backend system simultaneously. Why the need for a fullstack, when we'll be using ExpressJS already? There's just certain cases where processing data from the frotend directly would make more sense. Keep in mind that I wasn't involved with this, but if I were going to write a **password reset** page, for example, I would use `getServerSideProps` to determine if the request is valid or not then return the status. That way, the client doesn't have to make an extra request. With good, there's also bad, such as framework getting breaking-changes every year...
- NodeJS - There's tool like buns that could replace NodeJS, but it's the de facto JIT interpretor when it comes to backend javascripts..


### Project Setups/Infra
#### Project Structure
The project is setup in a structure in what we called "MonoRepo". As the name emplied, one-repo or all the application will be developed inside one application. Up-side is it can make large development easier: No more navigating to different repo just to make changes to that. Downside, well, all the web app will be deployed regardless if the changes was applied to that specific application all because it shares the same "main" branch. It was also difficult to get that setup because the start of this project marks the 0th anniversary of using it. Even though no other app members end up contributing each other's project, it did allowed project integration easier, specifically the web app since the frontend developer can run their own express server and use it to develop and view any errors during the integration process. This is also the reason I've used `pnpm` package manager and `turborepo`: It makes dependencies installation cleaner and enables running multiple project conseecutive easier.

I've also isolated development and production database so that all the testing data doesn't "dirty" the database, but the entire team just collectively (implicit) decided to test on prod instead... Yeah, the prod = dev environment is really coming back hard with this one.
#### Github Action (CI)/Codeowner
The purpose of this setup is to encourage all of us reviewing each other's code and providing feedback (a good way to learn how different people approach an algorithm and finding its flaw), and also running automated tests to make sure code are functional before pushed. Since well most of us started the project fairly late (I mean come on, there's CI error during the day of the presentation), I just end up overriding everything and this served zero purpose.. Hopefully this will actually work when I start my senior design project..
#### Railway and Docker (CD)
This was interesting one and the only reason I choose railway is because it had a decent automated deployment system, and I was on their grandfathered free plan. Unfortunately, some of the railway limitation affected how I implement things, you'll have to modify the project for it to work elsewhere:
- No `.git` - To get the commit hash, you have to use their custom-named environment variable (normally, you would just run a git command to pull stuff, and that would work universally)
- NO PORT 25 - Screw RAILWAY. I have to use my own email API system instead of nodemailer. I literally only found that out when I was working on another project using their platform...

I lied! For my backend build system, I actually use git command as a backup way to retrieve the hash if the railway ENV isn't found for this exact senario: Running the project somewhere else. Notice I didn't write docker compose file? Well, the obvious reason is I didn't need it for railway and second is the frontend and backend are suppose to run independently, otherwise it would be a race to see who would get the port `443`. Different port? Nah, don't expect company to whitelist any uncommon ports, this means UCF too (p.s. notice how one of the group member's email link was broken, well, they were using port 8080. Now why on earth UCF didn't unblock the port will remains a mystery...
#### Obserability (dev/prod)
Sentry - Awesome tool, their hosted stuff are very expensive, but I'm on their grandfathered plan, but you can always run your own selfhosted version FOR FREE. Literally almost no big company let people run their core software FOR FREE (as long as you dont become "another" provider). How big? Talking about Discord, Stripe, Twitch, Apple, Roblox, and even some UCF development team uses it. I had this installed in frontend and backend project, but ended not being used in frontend. What's useful about this?
- Automated Error catching - Yup, it logs all the exception my code throws and shows other related context that I provided. I wasn't able to identify all the issue with this (*cough* Mongo Document Validation Failure *cough*), but a lot of them are pretty straight forward to identify and fix.
- Logging - See all the `Logger.[...]()` stuff, that's what its used for. It can either be useful or useless, depending on how one configures it, but it certainly helped me because it was mostly used to capture code execution steps/context. If there was an issue, I can simply look up what the software execution state in the moment that the issue occured.

There's a specific feature that sentry is still working on their SDK that would make logger even more efficient, but that's for my future projects (I mean duh, it's not released yet)..
#### Mail System
This is all my (@zhiyan114) stuff, from personally developed [API System](https://github.com/zhiyan114/email-queue) to email server hosting. It used to be Postfix/Dovecot, but I've decided to use `stalwart` after the server upgrade. Don't get me wrong, Postfix/Dovecot works really well with very minimal maintenance, but if you tries to do any advanced configuration or setting up from scratch, it can be a PITA. But upgrading the serveer shouldn't need you to reinstall right? WRONG, my server provided uses LXC container as a way to provide the server to me instead of KVM. Because it's a container, the image is configured to work with the specific OS. Did I test it? Yes, but not on my email server. You see, I have another server with this provider and I decided to proceed with the full system upgrade, knowing it will break stuff. Well, stuff actuallly broke lmao. It pretty much break all the web server control panel for that server instance (yes, I cant even load in the backup or reinstall the image), and I ended up having to completely nuke that entire instance and start a new one. So yes, reinstallation is required and I did not want to do it  again for Postfix/Dovecot..

### I wanna spin up the server, help plz (Web App Only)???

#### the secret (aka .env)
This is it... The... Secret.. FILE!!!
```
BACKEND_SENTRY_DSN=SENTRY_DSN_FOR_BACKEND_APP
ENVIRONMENT=ENVIRONMENT_NAMING
MONGO_CONN=MONGODB_CONN_STR
NEXT_PUBLIC_SENTRY_DSN=SENTRY_DSN_FOR_FRONTEND_APP
SENTRY_ORG=SENTRY_ORG_FOR_SOURCEMAPPING
JWT_KEY=RANDOM_JWT_SIGN_KEY
EMAIL_KEY=EMAIL_SERVICE_API_KEY
```
or just look at `.env.example`

- `BACKEND_SENTRY_DSN` - Sentry DSN (keep empty if you dont know what this is)
- `ENVIRONMENT` - "dev"/"Prod" - It helps isolate sentry event labeling and CoreService database naming
- `MONGO_CONN` - MongoDB Connection String
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN but for frontend
- `SENTRY_ORG` - Sentry deployment stuff, just ignore
- `JWT_KEY` - Fixed JWT signing key (something cryptographically RNG)
- `EMAIL_KEY` - @zhiyan114's email API Key.


#### Development Setup
1. Get the tools installed `npm install -g dotenv-cli pnpm`
2. git clone the software
3. Setup the env variable. You really only need `ENVIRONMENT`, `MONGO_CONN`, and `JWT_KEY`. Give `EMAIL_KEY` some random value.
4. Install the depencies `pnpm install`
5. Run it `npx run dev`

#### Production Setup
There's not really a way to deploy both project at the same time as the deployment for frontend and backend are done independently...
Since railway does the deployment automatically using my dockerfile, I don't have any command setup for manual operation.

My recommendation is to lookup how to build/start a docker container (or even docker compose if you want a way to deploy the entire web app with the DB included in a VM environment).

Something like
```sh
docker build -f ./app/backend/Dockerfile -t backend .
docker run -d --name backend-app -p 8080:8080 backend
```
could be used to spinup your own copy of the backend server (*COMMAND UNTESTED). Don't forget to pass the env variable to the docker when building/running the instance lol.


#### Email Not working??
Well yeah, you'll have to modify the source and replace my `MailService` with other email provider if you want that back. Good news, you only have to modify the backend source for this. Plz dont ask me for an API email, this is literlly my personal email server..
