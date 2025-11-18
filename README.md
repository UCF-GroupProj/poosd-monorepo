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
The project is setup in a strcture in what we called "MonoRepo". As the name emplied, one-repo or all the application will be developed inside one application. Up-side is it can make large development easier: No more navigating to different repo just to make changes to that. Downside, well, all the web app will be deployed regardless if the changes was applied to that specific application all because it shares the same "main" branch. It was also difficult to get that setup because the start of this project marks the 0th anniversary of using it. Even though no other app members end up contributing each other's project, it did allowed project integration easier, specifically the web app since the frontend developer can run their own express server and use it to develop and view any errors during the integration process. This is also the reason I've used `pnpm` package manager and `turborepo`: It makes dependencies installation cleaner and enables running multiple project conseecutive easier.

I've also isolated development and production database so that all the testing data doesn't "dirty" the database, but the entire team just collectively (implicit) decided to test on prod instead... Yeah, the prod = dev environment is really coming back hard with this one.
#### Github Action (CI)/Codeowner
The purpose of this setup is to encourage all of us reviewing each other's code and providing feedback (a good way to learn how different people approach an algorithm and finding its flaw), and also running automated tests to make sure code are functional before pushed. Since well most of us started the project fairly late (I mean come on, there's CI error during the day of the presentation), I just end up overriding everything and this served zero purpose.. Hopefully this will actually work when I start my senior design project..
#### Railway and Docker (CD)
This was interesting one and the only reason I choose railway is because it had a decent automated deployment system, and I was on their grandfathered free plan. Unfortunately, some of the railway limitation affected how I implement things, you'll have to modify the project for it to work elsewhere:
- No `.git` - To get the commit hash, you have to use their custom-named environment variable (normally, you would just run a git command to pull stuff, and that would work universally)
- NO PORT 25 - Screw RAILWAY. I have to use my own email API system instead of nodemailer. I literally only found that out when I was working on another project using their platform...
#### Obserability (dev/prod)
Sentry - Awesome tool, their hosted stuff are very expensive, but I'm on their grandfathered plan, but you can always run your own selfhosted version FOR FREE. Literally no other company let people run their core software FOR FREE (as long as you dont become "another" provider). I had this installed in frontend and backend project, but ended not being used in frontend. What's useful about this?
- Automated Error catching - Yup, it logs all the exception my code throws and shows other related context that I provided. Not all the issue was fixed with this, but I was able to immediately fix a lot of them with it.
- Logging - See all the `Logger.[...]()` stuff, that's what its used for. It can either be useful or useless, depending on how one configures it, but it certainly helped me because it was mostly used to capture code execution steps/context. If there was an issue, I can simply look up what the software did at that time that caused the issue.
#### Mail System
This is all my (@zhiyan114) stuff, from personally developed [API System](https://github.com/zhiyan114/email-queue) to email server hosting. It used to be Postfix/Dovecot. Works pretty much without any maintenance, but it is very difficult to configure certain things. The server was, however, really due for an upgrade. I mean it was on ubuntu 18 (EoL expired like 5 years ago?). Due to the way hosting provider virtualization system, I can't simply run system upgrade (this literally broke my VM profile and I had to delete and spin up another VM), so instead, I factory-resetted. Now general maintenance for Postfix is very easy, but trying to set it up and adding specific configuration will be a PITA, so instead of dealing with that, I've used `stalwart` that made it very easy to manage.

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
could be used to spinup your own copy of the backend server (*COMMAND UNTESTED)


#### Email Not working??
Well yeah, you'll have to modify the source and replace my `MailService` with other email provider if you want that back. Good news, you only have to modify the backend source for this.