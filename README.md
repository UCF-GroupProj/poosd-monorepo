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

# Infra/DevOP Write Up
This is a final? update to the project and is a way for me (@zhiyan114) to write a comprehensive summary on the choices I made for each of the tech stack I've used for the project.

### The MERN Stack
As per project requirement, we're require to use: MongoDB, ExpressJS, ReactJS, and NodeJS. Below, I'll explain what I liked and/or what I didn't liked:
- MongoDB - Honestly, our project is better suited when using a SQL-based database (such as PostgreSQL). ERD also didn't make sense since the use-case for document-based database is for unpredictable data structure, but our entire data structure are pretty much well-defined and have proper relationship with other objects (table). The database also didn't provide any feedback when it fails the database's internal validation, which made certain debugging very much frustrated. One thing I did enjoy is the zero need to write SQL statement, but ORM will usually get the job, plus it's not that bad.
- ExpressJS - I don't have much opinion on this. The only other web framework I use is Fastify, but that's like one-time thing and there's was a weird issue that I end up not figuring out that would've been solved by just using Express..
- ReactJS - React itself is just a web framework, have to either choose a pre-existing template or configure the framework manually, from file structures to build/bundler. Unless there's an edge case, there's almost never a need to do that, so there I chose NextJS. There's of course other templates like Vite I can choose, but nextjs specifically pulled my attention is because it's a fullstack web application tool. Yes, you can write frontend and backend system simultaneously. Why the need for a fullstack, when we'll be using ExpressJS already? There's just certain cases where processing data from the frotend directly would make more sense. Keep in mind that I wasn't involved with this, but if I were going to write a **password reset** page, for example, I would use `getServerSideProps` to determine if the request is valid or not then return the status. That way, the client doesn't have to make an extra request. With good, there's also bad, such as framework getting breaking-changes every year...
- NodeJS - There's tool like buns that could replace NodeJS, but it's the de facto JIT interpretor when it comes to backend javascripts..


### Project Structure

