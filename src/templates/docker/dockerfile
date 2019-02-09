# base image
FROM node:alpine

# maintainer
MAINTAINER __author__

# creating and setting working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy dependency package
COPY ./package.json /usr/src/app

# install dependency
RUN npm install

# updates npm dependency
RUN npm update

# install pm2 globally
RUN npm install pm2 -g

# copy the rest of the src code
COPY . /usr/src/app

# expose port
EXPOSE __port__

# initialize app
CMD npm run start